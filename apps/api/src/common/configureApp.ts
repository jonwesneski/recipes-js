import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

type NestedRecord = { [k: string]: string | NestedRecord };
const buildValidationErrorResponse = (
  validationErrors: ValidationError[] = [],
  response: NestedRecord = {},
) => {
  for (const validationError of validationErrors) {
    if (validationError.children?.length) {
      response[validationError.property] = buildValidationErrorResponse(
        validationError.children,
      );
    } else {
      response[validationError.property] = Object.values(
        validationError.constraints!,
      ).join(', ');
    }
  }
  return response;
};

export function configureApp(app: INestApplication<any>) {
  app.enableCors({
    origin: ['http://localhost:3000', 'https://recipehall-tau.vercel.app'],
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          buildValidationErrorResponse(validationErrors),
        );
      },
    }),
  );
  app.useLogger(app.get(Logger));
}
