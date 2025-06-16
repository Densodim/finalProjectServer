import { ApiProperty } from '@nestjs/swagger';

export class OptionEntity {
  @ApiProperty({
    description: 'the unique Id',
    type: String,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description:
      'In the Text field, the OPTION model conveys the text value of the option',
    example: 'text: Yes',
    type: String,
  })
  text: string;

  @ApiProperty({
    description: 'The procedure for throwing options',
    type: Number,
    example: '[1, 2, 3]',
  })
  order: number;

  @ApiProperty({
    description: 'question ID',
    type: Number,
    example: 1,
  })
  questionId: number;
}
