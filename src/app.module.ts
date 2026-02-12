import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database';
import { CountriesModule } from './modules/countries/countries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.getOrThrow<number>('CACHE_TTL'),
        max: config.getOrThrow<number>('CACHE_MAX'),
      }),
    }),
    DatabaseModule,
    CommonModule,
    CountriesModule,
  ],
})
export class AppModule {}
