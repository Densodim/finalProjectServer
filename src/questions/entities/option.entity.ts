import { ApiProperty } from '@nestjs/swagger';

export class OptionEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  questionId: number;
}
