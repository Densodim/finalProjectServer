import { Answer } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerEntity implements Answer {
  @ApiProperty({ type: Number })
  id: 1;

  @ApiProperty({ required: false, type: String })
  textAnswer: 'string';

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Number })
  questionId: number;

  @ApiProperty({ required: false, type: URL })
  fileUrl: 'http://localhost:3001/';

  @ApiProperty({ required: false, type: Number })
  optionId: number;

  @ApiProperty({ type: Number })
  responseId: 1;
}
