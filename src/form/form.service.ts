import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFormTagsDto } from './dto/update-form-tags.dto';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { MeiliSearch } from 'meilisearch';
import { CloudinaryService } from 'nestjs-cloudinary';

@Injectable()
export class FormService {
  constructor(
    private prisma: PrismaService,
    @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createFormDto: CreateFormDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    let fileUrl: string | undefined = undefined;

    const categoryId = Number(createFormDto.categoryId);
    if (isNaN(categoryId)) {
      throw new BadRequestException('categoryId must be a valid number');
    }

    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      fileUrl = result.url;
    }
    await this.validation(createFormDto);
    const form = await this.prisma.form.create({
      data: {
        ...createFormDto,
        categoryId,
        authorId: userId,
        fileUrl,
      },
    });
    await this.meiliSearch.index('form').addDocuments([
      {
        id: form.id,
        title: form.title,
        description: form.description,
        isDeleted: form.isDeleted,
      },
    ]);
    return form;
  }

  findAllUser(userId: number) {
    return this.prisma.form.findMany({
      where: {
        isDeleted: false,
        authorId: userId,
      },
    });
  }

  findAll() {
    return this.prisma.form.findMany();
  }

  displayPublished() {
    return this.prisma.form.findMany({ where: { isPublished: true } });
  }

  findOne(id: number, userId: number) {
    return this.prisma.form.findFirst({
      where: {
        id,
        isDeleted: false,
        authorId: userId,
      },
    });
  }

  findAllDeleted(userId: number) {
    return this.prisma.form.findMany({
      where: { isDeleted: true, authorId: userId },
    });
  }

  async update(id: number, updateFormDto: UpdateFormDto, userId: number) {
    const form = await this.prisma.form.update({
      where: {
        id,
        isDeleted: false,
        authorId: userId,
      },
      data: updateFormDto,
    });
    await this.meiliSearch.index('form').updateDocuments([
      {
        id: form.id,
        title: form.title,
        description: form.description,
        isDeleted: form.isDeleted,
      },
    ]);
    return form;
  }

  async remove(id: number) {
    const form = await this.prisma.form.delete({ where: { id } });
    await this.meiliSearch.index('form').deleteDocument(form.id);
    return form;
  }

  async softDelete(id: number, userId: number) {
    const form = await this.prisma.form.update({
      where: {
        id,
        authorId: userId,
      },
      data: { isDeleted: true },
    });
    await this.meiliSearch.index('form').updateDocuments([
      {
        id: form.id,
        title: form.title,
        description: form.description,
        isDeleted: true,
      },
    ]);
    return form;
  }

  async addTags({ tagIds, formId }: UpdateFormTagsDto) {
    return this.prisma.form.update({
      where: { id: formId },
      data: {
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: { tags: true },
    });
  }

  deleteTags({ formId, tagIds }: UpdateFormTagsDto) {
    return this.prisma.form.update({
      where: { id: formId },
      data: {
        tags: {
          disconnect: tagIds.map((id) => ({ id })),
        },
      },
      include: { tags: true },
    });
  }

  async fullTextSearch(query: string) {
    const result = await this.meiliSearch.index('form').search(query);
    return result;
  }

  private async validation(createFormDto: CreateFormDto) {
    if (createFormDto.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: Number(createFormDto.categoryId) },
      });
      if (!categoryExists) {
        throw new NotFoundException(
          `Category with id ${createFormDto.categoryId} does not exist.`,
        );
      }
    }
  }
}
