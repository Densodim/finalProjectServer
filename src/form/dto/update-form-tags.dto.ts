import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class UpdateFormTagsDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  formId: number;

  @ApiProperty({ example: [1, 2], description: 'IDs of tags to connect' })
  @IsArray()
  @ArrayNotEmpty()
  tagIds: number[];
}
