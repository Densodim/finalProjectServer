import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity {
  @ApiProperty({
    description: 'The unique identifier of the category',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Customer Feedback',
  })
  name: string;

  @ApiProperty({
    description: 'Optional description of the category',
    example: 'Forms for collecting customer feedback and suggestions',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'The date when the category was created',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the category was last updated',
    example: '2024-03-20T10:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The number of forms in this category',
    example: 5,
    required: false,
  })
  _count?: {
    forms: number;
  };
}
