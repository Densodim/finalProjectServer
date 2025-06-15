import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFormTagsDto } from './dto/update-form-tags.dto';

@Injectable()
export class FormService {
  constructor(private prisma: PrismaService) {}

  create(createFormDto: CreateFormDto, userId: number) {
    return this.prisma.form.create({
      data: {
        ...createFormDto,
        authorId: userId,
      },
    });
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

  update(id: number, updateFormDto: UpdateFormDto, userId: number) {
    return this.prisma.form.update({
      where: {
        id,
        isDeleted: false,
        authorId: userId,
      },
      data: updateFormDto,
    });
  }

  softDelete(id: number, userId: number) {
    return this.prisma.form.update({
      where: {
        id,
        authorId: userId,
      },
      data: { isDeleted: true },
    });
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
}
