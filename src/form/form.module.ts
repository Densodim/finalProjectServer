import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FormController],
  providers: [FormService, PrismaService],
  imports: [PrismaModule],
})
export class FormModule {}
