import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // --- Swagger Configuration ---
  const config = new DocumentBuilder()
    .setTitle('Jomoro Coffee - Product API')
    .setDescription('Microservice handling categories, products, and inventory.')
    .setVersion('1.0')
    .addBearerAuth() // Adds the lock icon to protected routes
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  // This exposes the UI at http://localhost:3002/api/docs
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Product Service running on: http://localhost:${port}`);
  console.log(`Swagger UI ready at: http://localhost:${port}/api/docs`);
}
bootstrap();