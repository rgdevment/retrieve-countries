import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.use((req: { path: string }, res: { redirect: (arg0: number, arg1: string) => void }, next: () => void) => {
    if (req.path === '/') {
      res.redirect(301, 'https://github.com/rgdevment/retrieve-countries');
    } else {
      next();
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          error => `${error.property} has wrong value ${error.value}, ${Object.values(error.constraints).join(', ')}`,
        );
        return new BadRequestException(messages);
      },
    }),
  );

  app.setGlobalPrefix('v1');

  const config = new DocumentBuilder()
    .setTitle('Retrieve Countries API')
    .setDescription('')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap().then();
