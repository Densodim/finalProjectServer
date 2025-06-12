import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Option, QuestionType, QuestionValidation } from '@prisma/client';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(5)
  desctiption?: string;

  @IsEnum(QuestionType)
  @ApiProperty()
  type: QuestionType;

  @IsBoolean()
  @ApiProperty({ default: false })
  isRequired: boolean = false;

  @IsInt()
  @ApiProperty()
  order: number;

  @ApiProperty()
  options: Option[];

  @ApiProperty({ required: false })
  @IsOptional()
  validation: QuestionValidation;
}
