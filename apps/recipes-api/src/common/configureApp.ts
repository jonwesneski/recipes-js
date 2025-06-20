import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
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
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useLogger(app.get(Logger));
}
