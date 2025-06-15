import { ApiProperty } from '@nestjs/swagger';

export class TagEntity {
  @ApiProperty({
    type: String,
    uniqueItems: true,
    description: 'The unique name Tag',
    example: 'TagName',
  })
  name: string;
}
