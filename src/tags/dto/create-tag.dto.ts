import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ type: String, uniqueItems: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
