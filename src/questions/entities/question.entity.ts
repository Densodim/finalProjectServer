import { Question, QuestionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionValidationEntity } from '../../question-validation/entities/question-validation.entity';
import { OptionEntity } from '../../option/entities/option.entity';

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
