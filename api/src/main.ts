import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'log'],
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*',
  });
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
