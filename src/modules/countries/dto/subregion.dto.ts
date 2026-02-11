import { ApiProperty } from '@nestjs/swagger';

export class SubregionDto {
  @ApiProperty({ example: 'América del Sur' })
  readonly name!: string;

  @ApiProperty({ example: { es: 'América del Sur' }, nullable: true })
  readonly translations!: Record<string, string> | null;

  @ApiProperty({ example: 'Q18' })
  readonly wikiDataId!: string;
}
