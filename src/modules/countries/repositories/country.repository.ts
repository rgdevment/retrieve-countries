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
    options.excludeCities = true;
    const projection = this.resolveProjection(options);
    return this.countryModel.find({}, projection).exec();
  }

  async findByField(field: string, value: string, options: ExcludeOptions): Promise<Country | null> {
    const projection = this.resolveProjection(options);
    const query = { [field]: value };
    return this.countryModel.findOne(query, projection).collation({ locale: 'en', strength: 1 }).exec();
  }

  private resolveProjection(options: ExcludeOptions) {
    const projection: any = {};

    if (options.excludeStates) {
      projection.states = 0;
    }

    if (options.excludeCities) {
      projection.cities = 0;
    }
    return projection;
  }
}
