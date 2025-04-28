import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { CommonModule } from './common/common.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesModule } from './modules/cities/cities.module';
import { StatesModule } from './modules/states/states.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { CommandsModule } from './command/command.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { collectDefaultMetrics, Registry } from 'prom-client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: join(__dirname, '/resources/i18n/'),
        watch: false,
      },
      resolvers: [new HeaderResolver([])],
    }),
    PrometheusModule.register(),
    CommonModule,
    CountriesModule,
    CitiesModule,
    StatesModule,
    ConfigurationModule,
    CommandsModule,
  ],
  controllers: [HeaderResolver],
  providers: [
    {
      provide: 'PrometheusRegistry',
      useValue: (() => {
        const registry = new Registry();
        collectDefaultMetrics({ register: registry });
        return registry;
      })(),
    },
  ],
})
export class AppModule {}
