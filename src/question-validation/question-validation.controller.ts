import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionValidationService } from './question-validation.service';
import { CreateQuestionValidationDto } from './dto/create-question-validation.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestionValidationEntity } from './entities/question-validation.entity';

@Controller('questions/:id/validation')
@ApiTags('Question validation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class QuestionValidationController {
  constructor(
    private readonly questionValidationService: QuestionValidationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create validation rules for a question' })
  @ApiCreatedResponse({ type: QuestionValidationEntity })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @HttpCode(201)
  create(
    @Body() createQuestionValidationDto: CreateQuestionValidationDto,
    @Param('id', ParseIntPipe) questionId: number,
  ) {
    return this.questionValidationService.create(
      questionId,
      createQuestionValidationDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get validation rules for a question' })
  @ApiOkResponse({ type: QuestionValidationEntity })
  @ApiNotFoundResponse({ description: 'Validation not found' })
  @HttpCode(200)
  async findOne(@Param('id', ParseIntPipe) questionId: number) {
    return this.questionValidationService.findOne(questionId);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete validation rules for a question' })
  @ApiOkResponse({ description: 'Validation deleted' })
  @ApiNotFoundResponse({ description: 'Validation not found' })
  remove(@Param('id') questionId: number) {
    return this.questionValidationService.remove(questionId);
  }
}
