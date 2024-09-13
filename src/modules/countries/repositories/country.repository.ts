import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from '../../../common/schemas/country.schema';
import { CountryRepository } from './country.repository.interface';
import { IncludeOptions } from '../../../common/interfaces/include-options.interface';

@Injectable()
export class CountryRepositoryMongo implements CountryRepository {
  constructor(@InjectModel(Country.name) private readonly countryModel: Model<Country>) {}

  async findAll(options: IncludeOptions = {}): Promise<Country[]> {
    const projection: any = {
      cities: 0,
    };

    if (!options.includeStates) {
      projection.states = 0;
    }

    return this.countryModel.find({}, projection).exec();
  }
}
