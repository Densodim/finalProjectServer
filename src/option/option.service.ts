import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OptionEntity } from './entities/option.entity';

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  async create(questionId: number, createOptionDto: CreateOptionDto) {
    await this.validate(questionId);
    const count = await this.prisma.option.count({ where: { questionId } });
    const option = await this.prisma.option.create({
      data: {
        ...createOptionDto,
        questionId,
        order: createOptionDto.order ?? count + 1,
      },
    });
    return option;
  }

  async findAll(questionId: number) {
    await this.validate(questionId);
    return this.prisma.option.findMany({
      where: { questionId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(questionId: number, id: number) {
    await this.validate(id);
    const option = await this.prisma.option.findUnique({ where: { id } });
    this.validateQuestion(option, questionId);
    return option;
  }

  async update(
    questionId: number,
    id: number,
    updateOptionDto: UpdateOptionDto,
  ) {
    await this.validate(id);
    const option = await this.prisma.option.update({
      where: { id },
      data: updateOptionDto,
    });
    this.validateQuestion(option, questionId);
    return option;
  }

  async remove(questionId: number, id: number) {
    await this.validate(id);
    const option = await this.prisma.option.delete({ where: { id } });
    this.validateQuestion(option, questionId);
    return option;
  }

  private async validate(id: number) {
    const validation = await this.prisma.questionValidation.findUnique({
      where: { questionId: id },
    });
    if (!validation) {
      throw new NotFoundException('Question validation does not exist');
    }
  }

  private validateQuestion(option: OptionEntity | null, questionId: number) {
    if (!option || option.questionId !== questionId) {
      throw new NotFoundException('Option not found for this question');
    }
  }
}
