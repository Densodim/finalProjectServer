import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class QuestionsService {
  constructor(
    private prisma: PrismaService,
    @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch,
  ) {}

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
    await this.meiliSearch.index('form').addDocuments([
      {
        id: question.id,
        title: question.title,
      },
    ]);
    return question;
  }

  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.prisma.question.update({
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
    await this.meiliSearch.index('form').updateDocuments([
      {
        id: question.id,
        title: question.title,
      },
    ]);
    return question;
  }

  async removeQuestion(id: number) {
    await this.getByIdOrThrowQuestion(id);
    const question = await this.prisma.question.delete({ where: { id } });
    await this.meiliSearch.index('form').deleteDocument(question.id);
    return question;
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
