import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestionEntity } from './entities/question.entity';

@Controller('questions')
@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/forms/:id/questions')
  @ApiCreatedResponse({ type: QuestionEntity, isArray: true })
  async getFormQuestions(@Param('id', ParseIntPipe) formId: number) {
    return this.questionsService.getQuestionsByFormId(formId);
  }

  @Post('/forms/:id/questions')
  @ApiOkResponse({ type: QuestionEntity })
  async addQuestionToForm(
    @Param('id', ParseIntPipe) formId: number,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionsService.createQuestions(createQuestionDto, formId);
  }

  @Patch('/questions/:id')
  @ApiOkResponse({ type: QuestionEntity })
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.updateQuestion(+id, updateQuestionDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: QuestionEntity })
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.questionsService.removeQuestion(+id);
    return { message: 'Question deleted successfully' };
  }
}
