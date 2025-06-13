import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAnswerDto } from '../../answer/dto/create-answer.dto';
import { Type } from 'class-transformer';

export class CreateResponseDto {
  @ApiProperty({ type: Number })
  @IsInt()
  formId: 1;

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @IsOptional()
  userId?: 1;

  @ApiProperty({ type: String, required: false })
  @IsEmail()
  @IsOptional()
  email?: 'test@test.com';

  @ApiProperty({ type: String, required: false })
  @IsString()
  ipAdress?: '127.0.0.1';

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  userAgent: 'Mozilla/5.0';

  @ApiProperty({ type: CreateAnswerDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answer: CreateAnswerDto[];
}
