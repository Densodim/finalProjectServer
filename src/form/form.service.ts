import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFormTagsDto } from './dto/update-form-tags.dto';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class FormService {
  constructor(
    private prisma: PrismaService,
    @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch,
  ) {}

  async create(createFormDto: CreateFormDto, userId: number) {
    await this.validation(createFormDto);
    const form = await this.prisma.form.create({
      data: {
        ...createFormDto,
        authorId: userId,
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

  findAll(userId: number) {
    return this.prisma.form.findMany({
      where: {
        isDeleted: false,
        authorId: userId,
      },
    });
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
        where: { id: createFormDto.categoryId },
      });
      if (!categoryExists) {
        throw new NotFoundException(
          `Category with id ${createFormDto.categoryId} does not exist.`,
        );
      }
    }
  }
}
