import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ uniqueItems: true })
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  lastLoginAt?: Date;

  @ApiProperty({ default: 'USER' })
  role: UserRole;
}
