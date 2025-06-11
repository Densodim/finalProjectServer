import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ["error", "warn"],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log("Successfully connected to database");
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log("Successfully disconnected from database");
    } catch (error) {
      console.error("Error disconnecting from database:", error);
      throw error;
    }
  }
}
