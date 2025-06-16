import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOptionDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Yes' })
  @IsString()
  text: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false, example: 1 })
  order: number;
}
