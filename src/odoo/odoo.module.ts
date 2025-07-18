import { Module } from "@nestjs/common";
import { OdooService } from "./odoo.service";
import { OdooController } from "./odoo.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { DropboxModule } from "../dropbox/dropbox.module";

@Module({
  imports: [PrismaModule, DropboxModule],
  controllers: [OdooController],
  providers: [OdooService],
  exports: [OdooService],
})
export class OdooModule {}
