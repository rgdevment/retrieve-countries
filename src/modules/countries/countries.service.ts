import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CountryCacheService } from './cache';
import { ExcludeOption, ResponseType } from './dto/country-query.dto';
import { CityEntity, CountryEntity, CountrySimpleEntity, StateEntity } from './entities';
import { parseExclude, toSimpleCountry } from './helpers/simplify';
import { CountryRepository, SearchResult } from './repositories/country.repository.interface';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('CountryRepository')
    private readonly repo: CountryRepository,
    private readonly cache: CountryCacheService,
  ) {}

  findAllCountriesGzip(exclude?: ExcludeOption, type?: ResponseType): { gzip: Buffer; count: number } {
    const cached = this.cache.getAll(type, exclude);
    if (cached && cached.count > 0) return cached;

    throw new HttpException('No content', HttpStatus.NO_CONTENT);
  }

  async findCountryByTerm(
    term: string,
    exclude?: ExcludeOption,
    type?: ResponseType,
  ): Promise<CountryEntity | CountrySimpleEntity> {
    const options = parseExclude(exclude);

    const country = await this.repo.findByTerm(term, options);
    if (!country) throw new HttpException('No content', HttpStatus.NO_CONTENT);

    return type === ResponseType.SIMPLE ? toSimpleCountry(country) : country;
  }

  async findCountriesByRegion(
    name: string,
    exclude?: ExcludeOption,
    type?: ResponseType,
  ): Promise<CountryEntity[] | CountrySimpleEntity[]> {
    return this.findCountriesBy(n => this.repo.findByRegion(n, parseExclude(exclude)), name, type);
  }

  async findCountriesBySubregion(
    name: string,
    exclude?: ExcludeOption,
    type?: ResponseType,
  ): Promise<CountryEntity[] | CountrySimpleEntity[]> {
    return this.findCountriesBy(n => this.repo.findBySubregion(n, parseExclude(exclude)), name, type);
  }

  async findStateById(id: number, excludeCities: boolean): Promise<StateEntity> {
    const state = await this.repo.findStateById(id, !excludeCities);
    if (!state) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return state;
  }

  async findCityById(id: number): Promise<CityEntity> {
    const city = await this.repo.findCityById(id);
    if (!city) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return city;
  }

  async search(query: string): Promise<SearchResult> {
    if (!query || query.trim().length < 2) {
      throw new HttpException('Search term is required and must be at least 2 characters', HttpStatus.BAD_REQUEST);
    }
    return this.repo.search(query.trim(), 20);
  }

  private async findCountriesBy(
    finder: (name: string) => Promise<CountryEntity[]>,
    name: string,
    type?: ResponseType,
  ): Promise<CountryEntity[] | CountrySimpleEntity[]> {
    const countries = await finder(name);
    if (!countries.length) throw new HttpException('No content', HttpStatus.NO_CONTENT);

    return type === ResponseType.SIMPLE ? countries.map(toSimpleCountry) : countries;
  }
}
