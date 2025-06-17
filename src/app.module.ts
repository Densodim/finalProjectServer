import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FormModule } from './form/form.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswerModule } from './answer/answer.module';
import { ResponseModule } from './response/response.module';
import { CategoryModule } from './category/category.module';
import { TagsModule } from './tags/tags.module';
import { FormSettingsModule } from './form-settings/form-settings.module';
import { QuestionValidationModule } from './question-validation/question-validation.module';
import { OptionModule } from './option/option.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeiliSearchModule } from 'nestjs-meilisearch';


@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    FormModule,
    QuestionsModule,
    AnswerModule,
    ResponseModule,
    CategoryModule,
    TagsModule,
    FormSettingsModule,
    QuestionValidationModule,
    OptionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MeiliSearchModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('MEILI_HOST') ?? 'localhost',
        apiKey: configService.get<string>('MEILI_API_KEY') ?? '',
      }),
    }),
  ],
})
export class AppModule {}
