import { ApiProperty } from '@nestjs/swagger';
import { Form } from '@prisma/client';
import { FormEntity } from '../../form/entities/form.entity';

export class FormSettingEntity {
  @ApiProperty({
    description: 'The unique identifier of the Form Settings',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'This field allow responses',
    type: Boolean,
    default: true,
  })
  allowResponses: boolean;

  @ApiProperty({
    description:
      'This field allow responses for collecting customer feedback and suggestions',
    type: Boolean,
    default: false,
  })
  collectEmails: boolean = false;

  @ApiProperty({
    description: 'this field limit Response',
    type: Number,
    required: false,
    example: 1,
  })
  limitResponses?: number;

  @ApiProperty({
    description: 'Date dead line',
    required: false,
    type: Date,
  })
  responseDeadLine?: Date;

  @ApiProperty({
    description: 'This field require Login',
    required: false,
    default: false,
    type: Boolean,
  })
  requireLogin: boolean = false;

  @ApiProperty({
    description: 'this field allow file upload',
    default: false,
    example: false,
    type: Boolean,
  })
  allowFileUpload: boolean = false;

  @ApiProperty({
    description: 'this field sets the size of the field',
    required: false,
    type: Number,
    example: 1,
  })
  maxFileSize: number;

  @ApiProperty({
    description: 'this field limit the format of loaded content',
    type: [String],
    example: ['image/png', 'image/jpeg', 'application/pdf'],
  })
  allowedFileTypes: string[];

  @ApiProperty({
    description: 'form',
    type: FormEntity,
  })
  form: Form;

  @ApiProperty({
    description: 'The unique ID of the Form',
    type: Number,
  })
  formId: number;
}
