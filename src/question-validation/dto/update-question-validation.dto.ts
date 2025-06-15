import { PartialType } from '@nestjs/swagger';
import { CreateQuestionValidationDto } from './create-question-validation.dto';

export class UpdateQuestionValidationDto extends PartialType(
  CreateQuestionValidationDto,
) {}
