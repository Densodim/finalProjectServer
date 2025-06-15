import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateQuestionValidationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  minLength?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  maxLength?: number;

  @ApiProperty({ required: false, example: '^[A-Za-z]+$' })
  @IsOptional()
  @IsString()
  pattern?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  minValue?: number;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsInt()
  maxValue?: number;

  @ApiProperty({ example: 'Only letters allowed' })
  @IsOptional()
  @IsString()
  customMessage?: string;
}
