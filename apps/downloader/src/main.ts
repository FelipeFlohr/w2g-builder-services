import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorHandlingUtils } from "./utils/error-handling-utils";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ErrorHandlingUtils.handleValidationErrors,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
