import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExternalService } from './external.service';

@Controller('external')
@ApiTags('External API')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Get('results')
  @ApiOperation({
    summary: 'Получить агрегированные результаты форм',
    description:
      'Возвращает агрегированные результаты всех форм пользователя по API токену. Для числовых вопросов возвращает среднее, минимум, максимум. Для текстовых - топ-3 популярных ответа.',
  })
  @ApiQuery({
    name: 'token',
    description: 'API токен пользователя',
    type: 'string',
    required: true,
    example: 'abc123def456',
  })
  @ApiResponse({
    status: 200,
    description: 'Агрегированные результаты успешно получены',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Customer Feedback Form' },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string', example: 'How satisfied are you?' },
                type: { type: 'string', example: 'number' },
                count: { type: 'number', example: 10 },
                average: { type: 'number', example: 4.2 },
                min: { type: 'number', example: 1 },
                max: { type: 'number', example: 5 },
                topAnswers: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Very satisfied', 'Satisfied', 'Neutral'],
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'API токен не предоставлен',
  })
  @ApiResponse({
    status: 401,
    description: 'Недействительный API токен',
  })
  async getResults(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('API token is required');
    }
    return this.externalService.getAggregatedResults(token);
  }
}
