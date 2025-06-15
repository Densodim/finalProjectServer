import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private handlePrismaError(error: unknown, id: number): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
    }
    throw error;
  }

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            forms: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        forms: true,
        _count: {
          select: {
            forms: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async getCategoryStats(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        forms: {
          include: {
            _count: {
              select: {
                responses: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const stats = {
      totalForms: category.forms.length,
      totalResponses: category.forms.reduce(
        (acc, form) => acc + form._count.responses,
        0,
      ),
      forms: category.forms.map((form) => ({
        id: form.id,
        title: form.title,
        responseCount: form._count.responses,
      })),
    };

    return stats;
  }
}
