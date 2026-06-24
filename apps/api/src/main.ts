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

  const allowedOrigins = [
    (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
    'http://localhost:5173',
    'http://localhost:4200',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(normalized)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 MOS Platform API running on port ${port}`);
}

bootstrap();
