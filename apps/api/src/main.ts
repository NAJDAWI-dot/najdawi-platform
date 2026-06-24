import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SanitizePipe } from './common/pipes/sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Add security headers to protect against common web vulnerabilities
  app.use(helmet());

  app.setGlobalPrefix('api');

  // Register our custom sanitizer to strip XSS and trim spaces
  app.useGlobalPipes(new SanitizePipe());

  // Strict validation and payload cleaning
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error if unallowed properties are sent
      transform: true, // Transform payloads into DTO instances
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 MOS Platform API running on http://localhost:${port}/api`);
}

bootstrap();
