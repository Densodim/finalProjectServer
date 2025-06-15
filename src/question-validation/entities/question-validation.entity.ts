import { ApiProperty } from '@nestjs/swagger';

export class QuestionValidationEntity {
  @ApiProperty({
    description: 'The unique identifier of the Question Validation',
    type: String,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'A unique ID question',
    example: 1,
    type: Number,
  })
  questionId: number;

  @ApiProperty({
    description: 'The minimum issue length',
    type: Number,
    required: false,
  })
  minLength: number;

  @ApiProperty({
    description: 'The max issue length',
    type: Number,
    required: false,
  })
  maxLength: number;

  @ApiProperty({
    description: 'Regular expression (regex)',
    type: String,
    example: '^[A-Za-z]+$',
    required: false,
  })
  pattern?: string;

  @ApiProperty({
    description: 'The min value length',
    type: Number,
    required: false,
  })
  minValue?: number;

  @ApiProperty({
    description: 'The max value length',
    type: Number,
    required: false,
  })
  maxValue?: number;

  @ApiProperty({
    description: 'custom message',
    example: 'Only letters allowed',
    type: String,
    required: false,
  })
  customMessage?: string;
}
