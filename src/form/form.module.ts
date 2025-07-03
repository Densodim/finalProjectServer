import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { NestCloudinaryClientModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [FormController],
  providers: [FormService, PrismaService],
  imports: [PrismaModule, NestCloudinaryClientModule],
})
export class FormModule {}
