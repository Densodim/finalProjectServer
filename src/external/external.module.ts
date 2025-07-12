import { Module } from '@nestjs/common';
import { ExternalService } from './external.service';
import { ExternalController } from './external.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExternalController],
  providers: [ExternalService, PrismaService],
  imports: [PrismaModule],
  exports: [ExternalService],
})
export class ExternalModule {}
