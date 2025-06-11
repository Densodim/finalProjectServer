import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerCustomOptions } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Form")
    .setDescription("The Form API description")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
      filter: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        theme: "monokai",
      },
    },
    customSiteTitle: "Form API Documentation",
    customfavIcon: "https://nestjs.com/img/favicon.ico",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
    ],
  };

  SwaggerModule.setup("api", app, document, customOptions);
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
