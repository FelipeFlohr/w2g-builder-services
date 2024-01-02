import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvironmentSettingsService } from "./env/environment-settings.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ErrorHandlingUtils } from "./utils/error-handling-utils";

async function bootstrap() {
  const logger = new Logger(NestApplication.name);
  const app = await NestFactory.create(AppModule);
  const envService: EnvironmentSettingsService = app.get(
    EnvironmentSettingsService,
  );

  const swagger = new DocumentBuilder()
    .setTitle("W2G Messenger Bot")
    .setDescription("W2G Messenger Bot API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return ErrorHandlingUtils.handleValidationErrors(errors);
      },
      transform: true,
    }),
  );

  await app.listen(envService.port);
  logger.log(`Application running on port ${envService.port}`);
}
bootstrap();
