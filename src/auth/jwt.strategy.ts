import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || '123456',
    });
  }

  validate(payload: InPayload) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}

//type
interface InPayload {
  sub: number;
  email: string;
  role: UserRole;
}
