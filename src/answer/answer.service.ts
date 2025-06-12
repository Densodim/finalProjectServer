import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  async createMany(answer: CreateAnswerDto[]) {
    return this.prisma.answer.createMany({
      data: answer,
      skipDuplicates: true,
    });
  }

  async createOne(answer: CreateAnswerDto) {
    return this.prisma.answer.create({
      data: answer,
    });
  }
}
