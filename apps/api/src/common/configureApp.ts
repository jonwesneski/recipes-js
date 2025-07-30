import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { json, urlencoded } from 'express';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

export function configureApp(app: INestApplication<any>) {
  app.enableCors({
    origin: [
      'http://localhost:3000', // allow your frontend origins
      'https://recipes-ui-tau.vercel.app',
    ],
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
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
          validationErrors.reduce((acc, error) => {
            acc[error.property] = Object.values(error.constraints!).join(', ');
            return acc;
          }, {}),
        );
      },
    }),
  );
  app.useLogger(app.get(Logger));
}
