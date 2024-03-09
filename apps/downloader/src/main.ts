import "reflect-metadata";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorHandlingUtils } from "./utils/error-handling-utils";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";

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
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3000);
}
bootstrap();
