import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async getQuestionsByFormId(formId: number) {
    return this.prisma.question.findMany({
      where: { formId },
      include: {
        options: true,
        validation: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async createQuestions(createQuestionDto: CreateQuestionDto, formId: number) {
    await this.getByIdOrThrowForm(formId);

    const question = await this.prisma.question.create({
      data: {
        ...createQuestionDto,
        formId,
        options: createQuestionDto.options
          ? {
              create: createQuestionDto.options,
            }
          : undefined,
        validation: createQuestionDto.validation
          ? {
              create: createQuestionDto.validation,
            }
          : undefined,
      },
      include: {
        options: true,
        validation: true,
      },
    });
    return question;
  }

  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto) {
    return this.prisma.question.update({
      where: { id },
      data: {
        ...updateQuestionDto,
        options: updateQuestionDto.options
          ? {
              deleteMany: {},
              create: updateQuestionDto.options,
            }
          : undefined,
        validation: updateQuestionDto.validation
          ? {
              upsert: {
                update: updateQuestionDto.validation,
                create: updateQuestionDto.validation,
              },
            }
          : undefined,
      },
      include: {
        validation: true,
        options: true,
      },
    });
  }

  async removeQuestion(id: number) {
    await this.getByIdOrThrowQuestion(id);
    return this.prisma.question.delete({ where: { id } });
  }

  private async getByIdOrThrowQuestion(id: number) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }
    return question;
  }

  private async getByIdOrThrowForm(id: number) {
    const form = await this.prisma.form.findUnique({ where: { id } });
    if (!form) {
      throw new NotFoundException(`Form with id ${id} not found`);
    }
    return form;
  }
}
