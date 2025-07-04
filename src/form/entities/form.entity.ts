import { ApiProperty } from "@nestjs/swagger";
import { Category, FormSettings, Question, Tag, User } from "@prisma/client";

export class FormEntity {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ default: false })
  isPublished: boolean;

  @ApiProperty({ default: false })
  isDeleted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  author: User;

  @ApiProperty({ type: Number })
  authorId: number;

  @ApiProperty()
  questions: Question[];

  @ApiProperty()
  responses: Response[];

  @ApiProperty({ required: false })
  settings?: FormSettings;

  @ApiProperty({ required: false })
  category?: Category;

  @ApiProperty({ required: false, type: Number })
  categoryId?: number;

  @ApiProperty()
  tags: Tag[];

  @ApiProperty({ required: false, type: String })
  file?: string;
}
