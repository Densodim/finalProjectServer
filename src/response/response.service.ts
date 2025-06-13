import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResponseDto } from './dto/create-response.dto';

@Injectable()
export class ResponseService {
  constructor(private prisma: PrismaService) {}

  async submitForm(dto: CreateResponseDto) {
    await this.validateSubmitPayload(dto);

    const response = this.prisma.response.create({
      data: {
        ...dto,
        answer: {
          create: dto.answer.map((answer) => ({
            questionId: answer.questionId,
            textAnswer: answer.textAnswer,
            optionId: answer.optionId,
            fileUrl: answer.fileUrl,
          })),
        },
      },
    });

    return response;
  }

  private async validateSubmitPayload(dto: CreateResponseDto) {
    // Проверка формы
    const form = await this.prisma.form.findUnique({
      where: { id: dto.formId },
    });
    if (!form) {
      throw new NotFoundException(`Form with id ${dto.formId} not found`);
    }

    // Проверка пользователя
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${dto.userId} not found`);
      }
    }

    // Проверка каждого ответа (вопроса и опции)
    for (const answer of dto.answer) {
      const question = await this.prisma.question.findUnique({
        where: { id: answer.questionId },
      });
      if (!question) {
        throw new NotFoundException(
          `Question with id ${answer.questionId} not found`,
        );
      }

      // Проверяем optionId если он задан (не 0 и не null)
      if (answer.optionId) {
        const option = await this.prisma.option.findUnique({
          where: { id: answer.optionId },
        });
        if (!option) {
          throw new NotFoundException(
            `Option with id ${answer.optionId} not found`,
          );
        }
        if (option.questionId !== answer.questionId) {
          throw new BadRequestException(
            `Option ${answer.optionId} does not belong to question ${answer.questionId}`,
          );
        }
      }
    }
  }
}
