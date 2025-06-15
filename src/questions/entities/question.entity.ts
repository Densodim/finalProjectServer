import { Question, QuestionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { OptionEntity } from './option.entity';
import { QuestionValidationEntity } from '../../question-validation/entities/question-validation.entity';

export class QuestionEntity implements Question {
  @ApiProperty()
  id: number;

  @ApiProperty()
  order: number;

  @ApiProperty({ enum: QuestionType })
  type: QuestionType;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  desctiption: string;

  @ApiProperty()
  formId: number;

  @ApiProperty({ default: false })
  isRequired: boolean;

  @ApiProperty({ type: [OptionEntity] })
  options: OptionEntity[];

  @ApiProperty({ type: [QuestionValidationEntity], required: false })
  validation?: QuestionValidationEntity[];
}
