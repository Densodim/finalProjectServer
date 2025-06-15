import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionValidationDto } from './dto/create-question-validation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionValidationService {
  constructor(private prisma: PrismaService) {}

  async create(
    questionId: number,
    createQuestionValidationDto: CreateQuestionValidationDto,
  ) {
    await this.validate(questionId);
    const createdQuestionValidation =
      await this.prisma.questionValidation.upsert({
        where: { questionId },
        create: {
          ...createQuestionValidationDto,
          questionId,
        },
        update: createQuestionValidationDto,
      });
    return createdQuestionValidation;
  }

  async findOne(questionId: number) {
    await this.validate(questionId);
    return this.prisma.questionValidation.findUnique({
      where: { questionId },
    });
  }

  async remove(questionId: number) {
    await this.validate(questionId);
    return this.prisma.questionValidation.delete({ where: { questionId } });
  }

  private async validate(questionId: number) {
    const validation = await this.prisma.questionValidation.findUnique({
      where: { questionId },
    });
    if (!validation) {
      throw new NotFoundException('Question validation does not exist');
    }
  }
}
