import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  create({ name }: CreateTagDto) {
    return this.prisma.tag.create({ data: { name } });
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  update(id: number, { name }: UpdateTagDto) {
    return this.prisma.tag.update({ where: { id }, data: { name } });
  }

  remove(id: number) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
