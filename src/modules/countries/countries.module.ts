import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from '../../common/schemas/country.schema';
import { CountryRepositoryMongo } from './repositories/country.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }])],
  providers: [CountriesService, { provide: 'CountryRepository', useClass: CountryRepositoryMongo }],
  controllers: [CountriesController],
})
export class CountriesModule {}
