import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        isGlobal: false,
        cloud_name: configService.get('CLOUD_NAME'),
        api_key: configService.get('API_KEY'),
        api_secret: configService.get('API_SECRET'),
      }),
    }),
  ],
})
export class NestCloudinaryClientModule {}
