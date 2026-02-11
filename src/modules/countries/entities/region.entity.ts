export interface RegionEntity {
  readonly name: string;
  readonly translations: Record<string, string> | null;
  readonly wikiDataId: string;
}
