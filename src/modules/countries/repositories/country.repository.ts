import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from '../../../common/schemas/country.schema';
import { CountryRepository } from './country.repository.interface';
import { ExcludeOptions } from '../../../common/interfaces/exclude-options.interface';

@Injectable()
export class CountryRepositoryMongo implements CountryRepository {
  constructor(@InjectModel(Country.name) private readonly countryModel: Model<Country>) {}

  async findAll(options: ExcludeOptions): Promise<Country[]> {
    const projection: any = {
      cities: 0,
    };

    if (options.excludeStates) {
      projection.states = 0;
    }

    return this.countryModel.find({}, projection).exec();
  }

  async findByName(name: string, options: ExcludeOptions): Promise<Country | null> {
    const projection: any = {};

    const normalizedName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s()'.\-\/]+/g, ' ')
      .trim();

    await this.countryModel.createIndexes({ name: 'text' });

    if (options.excludeStates) {
      projection.states = 0;
    }

    if (options.excludeCities) {
      projection.cities = 0;
    }

    return this.countryModel.findOne({ $text: { $search: normalizedName, $caseSensitive: false } }, projection).exec();
  }
}
