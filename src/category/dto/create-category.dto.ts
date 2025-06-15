import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the category',
    example: 'Customer Feedback',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional description of the category',
    example: 'Forms for collecting customer feedback and suggestions',
    required: false,
    maxLength: 500,
  })
  description?: string;
}
