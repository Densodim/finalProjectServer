import { Module } from '@nestjs/common';
import { QuestionValidationService } from './question-validation.service';
import { QuestionValidationController } from './question-validation.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [QuestionValidationController],
  providers: [QuestionValidationService],
  imports: [PrismaModule],
})
export class QuestionValidationModule {}
