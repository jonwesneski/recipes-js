import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { configureApp } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  configureApp(app);

  const config = new DocumentBuilder()
    .setTitle('Recipes API')
    .setDescription('The recipes API description')
    .setVersion('1.0')
    .addTag('recipes')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const outputPath = path.resolve(process.cwd(), 'swagger.json');
  writeFileSync(outputPath, JSON.stringify(documentFactory), {
    encoding: 'utf8',
  });

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
