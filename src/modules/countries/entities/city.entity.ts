export interface CityEntity {
  readonly id: number;
  readonly name: string;
  readonly state_code: string;
  readonly country_code: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly wikiDataId: string;
}

export interface CitySimpleEntity {
  readonly id: number;
  readonly name: string;
}
