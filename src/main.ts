import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule } from "@nestjs/swagger";
import { swaggerConfig, swaggerCustomOptions } from "./config/swagger.config";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
    });

    app.setGlobalPrefix("api");

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/swagger", app, document, swaggerCustomOptions);

    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
  } catch (error) {
    console.error("Error starting application:", error);
    throw error;
  }
}

bootstrap().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
