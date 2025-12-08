import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private firebaseService: FirebaseService,
    private config: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
    });
    const token = await this.singToken(user.id, user.email, user.role);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const token = await this.singToken(user.id, user.email, user.role);
    return { user, token };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = await this.singToken(user.id, user.email, user.role);
    return { user, token };
  }

  async firebaseAuth(dto: FirebaseAuthDto) {
    try {
      // Verify Firebase ID token
      const decodedToken = await this.firebaseService.verifyIdToken(
        dto.idToken,
      );

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
      });

      if (!user) {
        // Try to find by email if available
        if (decodedToken.email) {
          user = await this.prisma.user.findUnique({
            where: { email: decodedToken.email },
          });

          if (user) {
            // Update existing user with Firebase UID
            user = await this.prisma.user.update({
              where: { id: user.id },
              data: {
                firebaseUid: decodedToken.uid,
                providerId: dto.providerId,
                photoURL: dto.photoURL,
                lastLoginAt: new Date(),
              },
            });
          }
        }

        // Create new user if not found
        if (!user) {
          user = await this.prisma.user.create({
            data: {
              email: decodedToken.email ?? `${decodedToken.uid}@firebase.user`,
              name: dto.displayName ?? decodedToken.name ?? 'Firebase User',
              password: null,
              firebaseUid: decodedToken.uid,
              providerId: dto.providerId,
              photoURL: dto.photoURL,
              role: UserRole.USER,
              lastLoginAt: new Date(),
            },
          });
        }
      } else {
        // Update last login
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      }

      // Generate tokens
      const accessToken = await this.singToken(user.id, user.email, user.role);
      const refreshToken = await this.generateRefreshToken(
        user.id,
        user.email,
        user.role,
      );

      // Save refresh token to database
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return {
        user,
        accessToken,
        refreshToken,
        expiresIn: 86400, // 24 hours in seconds
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const accessToken = await this.singToken(user.id, user.email, user.role);
      const newRefreshToken = await this.generateRefreshToken(
        user.id,
        user.email,
        user.role,
      );

      // Update refresh token
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 86400,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async singToken(
    userId: number,
    email: string,
    role: UserRole,
  ): Promise<string> {
    const payload = { sub: userId, email, role };
    return this.jwt.signAsync(payload);
  }

  private async generateRefreshToken(
    userId: number,
    email: string,
    role: UserRole,
  ): Promise<string> {
    const payload = { sub: userId, email, role };
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }
}
