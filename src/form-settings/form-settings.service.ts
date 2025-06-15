import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFormSettingDto } from './dto/update-form-setting.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSetting(id: number) {
    return this.prisma.formSettings.findUnique({ where: { formId: id } });
  }

  async updateSettings(id: number, updateFormSettingDto: UpdateFormSettingDto) {
    const form = this.prisma.form.findUnique({ where: { id } });

    if (!form) {
      throw new NotFoundException(`Form with id ${id} not found`);
    }

    return this.prisma.formSettings.upsert({
      where: { formId: id },
      update: updateFormSettingDto,
      create: {
        ...updateFormSettingDto,
        formId: id,
      },
    });
  }
}
