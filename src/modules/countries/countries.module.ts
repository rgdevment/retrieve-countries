import { Module } from '@nestjs/common';
import { CitiesController } from './cities.controller';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { CountryRepositorySqlite } from './repositories/country.repository';
import { SearchController } from './search.controller';
import { StatesController } from './states.controller';

@Module({
  providers: [CountriesService, { provide: 'CountryRepository', useClass: CountryRepositorySqlite }],
  controllers: [CountriesController, StatesController, CitiesController, SearchController],
})
export class CountriesModule {}
