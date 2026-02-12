export interface GeoAreaEntity {
  readonly name: string;
  readonly translations: Record<string, string> | null;
  readonly wikiDataId: string;
}

export type RegionEntity = GeoAreaEntity;
