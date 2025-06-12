import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @IsInt()
  @ApiProperty()
  questionId: number;

  @IsInt()
  @ApiProperty()
  responseId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  textAnswer?: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  optionId?: number;

  @ApiProperty()
  @IsOptional()
  fileUrl?: string;
}
