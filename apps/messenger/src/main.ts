import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoggerUtils } from "./utils/logger.utils";
import { ValidationPipe } from "@nestjs/common";
import { ErrorHandlingUtils } from "./utils/error-handling.utils";
import { EnvironmentSettingsServiceImpl } from "./modules/env/services/impl/environment-settings.impl.service";
import { EnvironmentSettingsServiceProvider } from "./modules/env/providers/environment-settings-service.provider";

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
  await app.listen(envService.application.port);
  logger.log(`Application running on port ${envService.application.port}`);
}
bootstrap();
