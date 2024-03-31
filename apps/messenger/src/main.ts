import { ValidationPipe } from "@nestjs/common";
import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvironmentSettingsServiceProvider } from "./modules/env/providers/environment-settings-service.provider";
import { EnvironmentSettingsServiceImpl } from "./modules/env/services/impl/environment-settings.impl.service";
import { ErrorHandlingUtils } from "./utils/error-handling.utils";
import { LoggerUtils } from "./utils/logger.utils";

async function bootstrap() {
  const logger = LoggerUtils.from(NestApplication);
  const app = await NestFactory.create(AppModule);
  const envService: EnvironmentSettingsServiceImpl = app.get(EnvironmentSettingsServiceProvider);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ErrorHandlingUtils.handleValidationErrors,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useLogger(logger);
  app.enableCors();
  await app.listen(envService.application.port);
  logger.log(`Application running on port ${envService.application.port}`);
}
bootstrap();
