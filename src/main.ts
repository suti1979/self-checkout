import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // to be used for all incoming requests to the NestJS application. This ensures that all incoming requests are automatically validated before they are processed by the application.
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('self-checkout api')
    .setDescription('The self-checkout API description')
    .setVersion('1.0')
    .addTag('Stock', 'Endpoints related to Stock')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme('v3');
  const options = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
  };
  SwaggerModule.setup('/swagger', app, document, options);

  await app.listen(4000);
}
bootstrap();
