import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateFormSettingDto {
  @ApiProperty({
    description: 'This field allow responses',
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  allowResponses: boolean = true;

  @ApiProperty({
    description:
      'This field allow responses for collecting customer feedback and suggestions',
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  collectEmails: boolean = false;

  @ApiProperty({
    description: 'this field limit Response',
    type: Number,
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  limitResponses?: number;

  @ApiProperty({ description: 'Date dead line', required: false })
  @IsDateString()
  @IsOptional()
  responseDeadLine?: Date;

  @ApiProperty({
    description: 'This field require Login',
    required: false,
    default: false,
  })
  @IsBoolean()
  requireLogin: boolean = false;

  @ApiProperty({ description: 'this field allow file upload', default: false })
  @IsBoolean()
  allowFileUpload: boolean = false;

  @ApiProperty({
    description: 'this field sets the size of the field',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  maxFileSize?: number;

  @ApiProperty({
    description: 'this field limit the format of loaded content',
    type: [String],
  })
  @IsArray()
  allowedFileTypes: string[];
}
