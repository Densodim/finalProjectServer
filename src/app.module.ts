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
  ],
})
export class AppModule {}
