import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ExcludeOption, ResponseType } from './dto/country-query.dto';
import {
  CityEntity,
  CitySimpleEntity,
  CountryEntity,
  CountrySimpleEntity,
  StateEntity,
  StateSimpleEntity,
} from './entities';
import { CountryRepository, HierarchyOptions, SearchResult } from './repositories/country.repository.interface';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('CountryRepository')
    private readonly repo: CountryRepository,
  ) {}

  // ── Countries ───────────────────────────────────────────────

  /** List all countries. Supports hierarchy exclusion and simple mode. */
  async findAllCountries(
    exclude?: ExcludeOption,
    type?: ResponseType,
  ): Promise<CountryEntity[] | CountrySimpleEntity[]> {
    const options = this.parseExclude(exclude);

    const countries = await this.repo.findAll(options);
    if (!countries.length) throw new HttpException('No content', HttpStatus.NO_CONTENT);

    return type === ResponseType.SIMPLE ? countries.map(c => this.toSimple(c)) : countries;
  }

  /** Smart Resolve — find a country by ID, ISO2, ISO3, or name. */
  async findCountryByTerm(
    term: string,
    exclude?: ExcludeOption,
    type?: ResponseType,
  ): Promise<CountryEntity | CountrySimpleEntity> {
    const options = this.parseExclude(exclude);

    const country = await this.repo.findByTerm(term, options);
    if (!country) throw new HttpException('No content', HttpStatus.NO_CONTENT);

    return type === ResponseType.SIMPLE ? this.toSimple(country) : country;
  }

  /** Filter countries by region/continent name. */
  async findCountriesByRegion(
    name: string,
    exclude?: ExcludeOption,
    type?: ResponseType,
  ): Promise<CountryEntity[] | CountrySimpleEntity[]> {
    const options = this.parseExclude(exclude);

    const countries = await this.repo.findByRegion(name, options);
    if (!countries.length) throw new HttpException('No content', HttpStatus.NO_CONTENT);

    return type === ResponseType.SIMPLE ? countries.map(c => this.toSimple(c)) : countries;
  }

  /** Filter countries by subregion name. */
  async findCountriesBySubregion(
    name: string,
    exclude?: ExcludeOption,
    type?: ResponseType,
  ): Promise<CountryEntity[] | CountrySimpleEntity[]> {
    const options = this.parseExclude(exclude);

    const countries = await this.repo.findBySubregion(name, options);
    if (!countries.length) throw new HttpException('No content', HttpStatus.NO_CONTENT);

    return type === ResponseType.SIMPLE ? countries.map(c => this.toSimple(c)) : countries;
  }

  // ── States ──────────────────────────────────────────────────

  /** Get a specific state by ID, optionally excluding its cities. */
  async findStateById(id: number, excludeCities: boolean): Promise<StateEntity> {
    const state = await this.repo.findStateById(id, !excludeCities);
    if (!state) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return state;
  }

  // ── Cities ──────────────────────────────────────────────────

  /** Get a specific city by ID. */
  async findCityById(id: number): Promise<CityEntity> {
    const city = await this.repo.findCityById(id);
    if (!city) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return city;
  }

  // ── Search ──────────────────────────────────────────────────

  /** Global search across countries, states, and cities. */
  async search(query: string): Promise<SearchResult> {
    if (!query || query.trim().length < 2) {
      throw new HttpException('Search term is required and must be at least 2 characters', HttpStatus.BAD_REQUEST);
    }
    return this.repo.search(query.trim(), 20);
  }

  // ── Private helpers ─────────────────────────────────────────

  private parseExclude(exclude?: ExcludeOption): HierarchyOptions {
    switch (exclude) {
      case ExcludeOption.STATES:
        return { includeStates: false, includeCities: false };
      case ExcludeOption.CITIES:
        return { includeStates: true, includeCities: false };
      default:
        return { includeStates: true, includeCities: true };
    }
  }

  private toSimple(country: CountryEntity): CountrySimpleEntity {
    return {
      id: country.id,
      name: country.name,
      iso2: country.iso2,
      emoji: country.emoji,
      states: (country.states ?? []).map(s => this.toSimpleState(s)),
    };
  }

  private toSimpleState(state: StateEntity): StateSimpleEntity {
    return {
      id: state.id,
      name: state.name,
      iso2: state.iso2,
      cities: (state.cities ?? []).map(c => this.toSimpleCity(c)),
    };
  }

  private toSimpleCity(city: CityEntity): CitySimpleEntity {
    return {
      id: city.id,
      name: city.name,
    };
  }
}
