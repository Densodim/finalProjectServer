import { Module } from '@nestjs/common';
import { FormSettingsService } from './form-settings.service';
import { FormSettingsController } from './form-settings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [FormSettingsController],
  providers: [FormSettingsService],
  imports: [PrismaModule],
})
export class FormSettingsModule {}
