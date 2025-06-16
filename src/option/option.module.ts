import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [OptionController],
  providers: [OptionService],
  imports: [PrismaModule],
})
export class OptionModule {}
