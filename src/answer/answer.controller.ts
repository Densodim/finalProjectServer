import { Body, Controller, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AnswerEntity } from './entities/answer.entity';

@Controller('answer')
@ApiTags('Answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Answer saved', type: AnswerEntity })
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.createOne(createAnswerDto);
  }

  @Post('batch')
  @ApiCreatedResponse({ description: 'Answer saved', type: AnswerEntity })
  createBatch(@Body() createAnswerDto: CreateAnswerDto[]) {
    return this.answerService.createMany(createAnswerDto);
  }
}
