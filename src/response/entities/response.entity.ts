import { Response } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseEntity implements Response {
  @ApiProperty({ type: Number })
  id: 1;

  @ApiProperty({ type: Number })
  formId: 1;

  @ApiProperty({ type: String, required: false })
  email: 'email@email.com';

  @ApiProperty({ type: String, required: false })
  ipAdress: '127.0.0.1';

  @ApiProperty({ type: String, required: false })
  userAgent: 'Mazila';

  @ApiProperty({ type: Number, required: false })
  userId: 1;

  @ApiProperty({ type: Boolean, default: false })
  isSpam: false;

  @ApiProperty({ type: String })
  submittedAt: Date;
}
