import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FirebaseAuthDto {
  @ApiProperty({
    description: 'Firebase ID token from client',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @ApiProperty({
    description: 'Firebase UID',
    example: 'yGCEvAqQCsT8P5qzuW3E4oB9TEL2',
    required: false,
  })
  @IsString()
  @IsOptional()
  uid?: string;

  @ApiProperty({
    description: 'Provider ID (google.com, twitter.com, etc.)',
    example: 'twitter.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  providerId?: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({
    description: 'User photo URL',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  photoURL?: string;
}