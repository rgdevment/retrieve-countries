import { Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.use(compression({ level: 6, threshold: 2048 }));

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('Retrieve Countries API')
    .setDescription(
      'Hierarchical REST API for querying countries, states/regions, and cities worldwide. ' +
        'Features Smart Resolve (auto-detects ID, ISO code, or name), ' +
        'accent/case-insensitive search (e.g., "mexico" finds "México"), ' +
        'hierarchy control (?exclude=cities|states), ' +
        'and a lightweight dropdown mode (?type=simple). ' +
        'Data includes currency, timezone, coordinates, and more.',
    )
    .setVersion('1.0')
    .setLicense('GPL-3.0-only', 'https://www.gnu.org/licenses/gpl-3.0.en.html')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
