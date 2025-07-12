import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { generateApiToken } from '../common/utils/generate-token';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  findDrafts() {
    return this.prisma.user.findMany({ where: { isActive: false } });
  }

  async genApiToken(userId: number) {
    const token = generateApiToken();

    return this.prisma.user.update({
      where: { id: userId },
      data: { apiToken: token },
      select: { apiToken: true },
    });
  }

  async getApiToken(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { apiToken: true },
    });

    if (user?.apiToken) return { apiToken: user.apiToken };
    return this.genApiToken(userId);
  }
}
