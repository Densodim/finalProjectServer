import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [PrismaModule],
})
export class QuestionsModule {}
