import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sécurité : Helmet pour les headers HTTP (OWASP)
  app.use(helmet());

  // Sécurité : Enable CORS avec une configuration restrictive
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // À affiner en prod
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Validation : Global Pipe pour class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Lance une erreur si propriétés inconnues
      transform: true, // Transforme les payloads en instances de DTO
    }),
  );

  // API Prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`🚀 Sentinel API is running on: ${await app.getUrl()}/api/v1`);
}
bootstrap();
