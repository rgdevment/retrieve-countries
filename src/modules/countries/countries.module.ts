import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { CountryRepositorySqlite } from './repositories/country.repository';

@Module({
  providers: [CountriesService, { provide: 'CountryRepository', useClass: CountryRepositorySqlite }],
  controllers: [CountriesController],
})
export class CountriesModule {}
