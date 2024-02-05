import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvironmentSettingsService } from "./env/environment-settings.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { ErrorHandlingUtils } from "./utils/error-handling-utils";
import { LoggerUtils } from "./utils/logger-utils";

async function bootstrap() {
  const logger = LoggerUtils.from(NestApplication);
  const app = await NestFactory.create(AppModule);
  const envService: EnvironmentSettingsService = app.get(EnvironmentSettingsService);

  const swagger = new DocumentBuilder()
    .setTitle("W2G Messenger Bot")
    .setDescription("W2G Messenger Bot API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ErrorHandlingUtils.handleValidationErrors,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(envService.application.port);
  logger.log(`Application running on port ${envService.application.port}`);
}
bootstrap();
