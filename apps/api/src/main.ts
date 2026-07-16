import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

function assertSecretsConfigured(config: ConfigService): void {
  const jwtSecret = config.get<string>('jwt.secret');
  const webhookSecret = config.get<string>('webhookSecret');

  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error(
      'JWT_SECRET ausente ou fraco (mínimo 32 caracteres) — configure apps/api/.env antes de subir a API.',
    );
  }
  if (!webhookSecret || webhookSecret.length < 32) {
    throw new Error(
      'WEBHOOK_SECRET ausente ou fraco (mínimo 32 caracteres) — configure apps/api/.env antes de subir a API.',
    );
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  assertSecretsConfigured(config);

  app.setGlobalPrefix('api');

  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: config.get<string>('corsOrigin'),
    credentials: true,
  });

  const port = config.get<number>('port') ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}

bootstrap();
