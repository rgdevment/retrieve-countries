import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { ExcludeOption, ResponseType } from './dto/country-query.dto';
import { CountrySimpleDto } from './dto/country-simple.dto';
import { CountryDto } from './dto/country.dto';
import { CountryEntity, CountrySimpleEntity } from './entities';

@ApiTags('Countries')
@Controller('countries')
@UseInterceptors(CacheInterceptor)
@ApiExtraModels(CountryDto, CountrySimpleDto)
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all countries',
    description:
      'Returns the complete list of countries with their states/regions and cities. ' +
      'Use query parameters to control the response depth and detail level. ' +
      'Example: Chile with the Antofagasta region and the city of Calama.',
  })
  @ApiQuery({
    name: 'exclude',
    enum: ExcludeOption,
    required: false,
    description:
      'Controls hierarchy depth. ' +
      '"cities": returns countries with states but without cities. ' +
      '"states": returns only countries without states or cities.',
  })
  @ApiQuery({
    name: 'type',
    enum: ResponseType,
    required: false,
    description:
      'Controls the detail level. ' +
      '"simple": returns only id, name, iso2, and emoji (ideal for dropdowns). ' +
      '"full" (default): returns all fields.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of countries. Shape depends on the `type` query parameter.',
    content: {
      'application/json': {
        schema: {
          oneOf: [
            { type: 'array', items: { $ref: getSchemaPath(CountryDto) } },
            { type: 'array', items: { $ref: getSchemaPath(CountrySimpleDto) } },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 204, description: 'No countries found.' })
  async findAll(
    @Query('exclude') exclude?: ExcludeOption,
    @Query('type') type?: ResponseType,
  ): Promise<CountryEntity[] | CountrySimpleEntity[]> {
    return this.service.findAllCountries(exclude, type);
  }

  @Get('region/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Filter countries by continent/region',
    description:
      'Filters countries by continent or region name with accent/case-insensitive matching. ' +
      'Example: "Americas" returns all countries in the Americas, including Chile.',
  })
  @ApiParam({ name: 'name', description: 'Region/continent name', example: 'Americas' })
  @ApiQuery({ name: 'exclude', enum: ExcludeOption, required: false })
  @ApiQuery({ name: 'type', enum: ResponseType, required: false })
  @ApiResponse({ status: 200, description: 'Countries in the specified region.', type: [CountryDto] })
  @ApiResponse({ status: 204, description: 'No countries found for this region.' })
  async findByRegion(
    @Param('name') name: string,
    @Query('exclude') exclude?: ExcludeOption,
    @Query('type') type?: ResponseType,
  ): Promise<CountryEntity[] | CountrySimpleEntity[]> {
    return this.service.findCountriesByRegion(name, exclude, type);
  }

  @Get('subregion/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Filter countries by subregion',
    description:
      'Filters countries by subregion name with accent/case-insensitive matching. ' +
      'Example: "South America" returns Chile, Argentina, Brazil, etc.',
  })
  @ApiParam({ name: 'name', description: 'Subregion name', example: 'South America' })
  @ApiQuery({ name: 'exclude', enum: ExcludeOption, required: false })
  @ApiQuery({ name: 'type', enum: ResponseType, required: false })
  @ApiResponse({ status: 200, description: 'Countries in the specified subregion.', type: [CountryDto] })
  @ApiResponse({ status: 204, description: 'No countries found for this subregion.' })
  async findBySubregion(
    @Param('name') name: string,
    @Query('exclude') exclude?: ExcludeOption,
    @Query('type') type?: ResponseType,
  ): Promise<CountryEntity[] | CountrySimpleEntity[]> {
    return this.service.findCountriesBySubregion(name, exclude, type);
  }

  @Get(':term')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Smart Resolve — Find a country by ID, ISO code, or name',
    description:
      'Intelligently resolves a country using multiple strategies: ' +
      'numeric ID (e.g., "44"), ISO2 code (e.g., "CL"), ISO3 code (e.g., "CHL"), ' +
      'or name with accent/case-insensitive matching (e.g., "Chile", "chile", "Chi"). ' +
      'Returns the full country with its states and cities by default.',
  })
  @ApiParam({
    name: 'term',
    description: 'Country identifier: numeric ID, ISO2 code, ISO3 code, or name',
    examples: {
      byId: { value: '44', summary: 'By numeric ID' },
      byIso2: { value: 'CL', summary: 'By ISO2 code' },
      byIso3: { value: 'CHL', summary: 'By ISO3 code' },
      byName: { value: 'Chile', summary: 'By name' },
    },
  })
  @ApiQuery({ name: 'exclude', enum: ExcludeOption, required: false })
  @ApiQuery({ name: 'type', enum: ResponseType, required: false })
  @ApiResponse({ status: 200, description: 'Country found with its states and cities.', type: CountryDto })
  @ApiResponse({ status: 204, description: 'Country not found.' })
  async findByTerm(
    @Param('term') term: string,
    @Query('exclude') exclude?: ExcludeOption,
    @Query('type') type?: ResponseType,
  ): Promise<CountryEntity | CountrySimpleEntity> {
    return this.service.findCountryByTerm(term, exclude, type);
  }
}
