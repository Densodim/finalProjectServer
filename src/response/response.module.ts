import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ResponseController],
  providers: [ResponseService],
  imports: [PrismaModule],
})
export class ResponseModule {}
