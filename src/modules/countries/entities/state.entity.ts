import { CityEntity } from './city.entity';

export interface StateEntity {
  readonly id: number;
  readonly name: string;
  readonly iso2: string;
  readonly type: string;
  readonly country_code: string;
  readonly fips_code: string;
  readonly level: number | null;
  readonly parent_id: number | null;
  readonly native: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly wikiDataId: string;
  readonly cities: CityEntity[];
}
