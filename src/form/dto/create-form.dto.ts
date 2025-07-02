import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFormDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isPublished: boolean = false;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  categoryId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fileUrl: string;
}
