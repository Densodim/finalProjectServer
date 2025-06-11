import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false })
  lastLoginAt: Date;

  @ApiProperty({ default: true })
  isActive: boolean = true;
}
