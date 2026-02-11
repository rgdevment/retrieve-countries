export interface SubregionEntity {
  readonly name: string;
  readonly translations: Record<string, string> | null;
  readonly wikiDataId: string;
}
