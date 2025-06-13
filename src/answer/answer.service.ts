import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  async createMany(answer: CreateAnswerDto[]) {
    for (const answerDTO of answer) {
      await this.validateAnswer(answerDTO);
    }
    return this.prisma.answer.createMany({
      data: answer,
      skipDuplicates: true,
    });
  }

  async createOne(answer: CreateAnswerDto) {
    await this.validateAnswer(answer);
    return this.prisma.answer.create({
      data: answer,
    });
  }

  private async validateAnswer(dto: CreateAnswerDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
    });
    if (!question) {
      throw new NotFoundException(
        `Question with id ${dto.questionId} not found`,
      );
    }
    if (dto.optionId) {
      const option = await this.prisma.option.findUnique({
        where: { id: dto.optionId },
      });
      if (!option) {
        throw new NotFoundException(`Option with id ${dto.optionId} not found`);
      }
      if (option.questionId !== dto.questionId) {
        throw new BadRequestException(
          `Option ${dto.optionId} does not belong to question ${dto.questionId}`,
        );
      }
    }
    if (!dto.textAnswer && !dto.optionId && !dto.fileUrl) {
      throw new BadRequestException(
        `Answer must contain at least one of: textAnswer, optionId, or fileUrl`,
      );
    }
    if (dto.responseId) {
      const response = await this.prisma.response.findUnique({
        where: { id: dto.responseId },
      });
      if (!response) {
        throw new NotFoundException(
          `Response with id ${dto.responseId} not found`,
        );
      }
    }
  }
}
