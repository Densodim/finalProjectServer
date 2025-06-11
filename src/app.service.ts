import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello() {
    return {
      message: "Welcome to Form API",
      documentation: "/api",
      version: "1.0.0",
    };
  }
}
