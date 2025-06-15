import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      message: 'Welcome to Form API',
      documentation: '/api/swagger',
      version: '1.0.0',
    };
  }
}
