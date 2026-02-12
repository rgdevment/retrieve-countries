import { ApiProperty } from '@nestjs/swagger';

export abstract class GeoAreaDto {
  @ApiProperty({ example: 'Americas' })
  readonly name!: string;

  @ApiProperty({ example: { es: 'Américas' }, nullable: true })
  readonly translations!: Record<string, string> | null;

  @ApiProperty({ example: 'Q828' })
  readonly wikiDataId!: string;
}
