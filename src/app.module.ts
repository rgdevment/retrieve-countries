import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database';
import { CountriesModule } from './modules/countries/countries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60_000, // 60 seconds default TTL (in ms)
      max: 200, // max items in cache
    }),
    DatabaseModule,
    CommonModule,
    CountriesModule,
  ],
})
export class AppModule {}
