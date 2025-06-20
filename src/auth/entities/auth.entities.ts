import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class AuthEntities {
  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  token: string;
}
