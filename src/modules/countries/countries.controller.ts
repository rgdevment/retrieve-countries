import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDto } from '../../common/dto/country.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryQueryDto } from '../../common/dto/country-query.dto';
import { CountriesQueryDto } from '../../common/dto/countries-query.dto';

@ApiTags('countries')
@Controller()
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all country data',
    description: `
      Retrieves data for all countries along with their states. 
      Note that obtaining a list of cities in this call is not possible due to the large number of cities globally.
      
      **Optional Query Parameters:**
      - \`excludeStates=true\`: *This option is temporarily disabled until we optimize and improve the response size.*
      
      **Best Practices:**
      We recommend caching the API response to prevent excessive usage and help keep the service public and available 
      for everyone.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation. Returns a list of countries with their details, excluding states and cities.',
    type: [CountryDto],
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CountryDto',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'No content. No countries found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Please verify the provided parameters.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Please try again later.',
  })
  async getAllCountries(@Query() query: CountriesQueryDto): Promise<CountryDto[]> {
    // We are working to optimize the size of the query, in the meantime they will always be excluded
    query.excludeStates = true;
    return this.service.getAllCountries(query);
  }

  @Get('region/:region')
  @ApiOperation({
    summary: 'Retrieve countries by region',
    description: `Fetches a list of countries within a specified region. Optionally, you can exclude states from the 
                  response using the \`excludeStates\` query parameter. To promote efficient API usage, please consider 
                  caching the response to minimize unnecessary requests.`,
  })
  @ApiParam({
    name: 'region',
    description: 'The name of the region to filter countries by (e.g., "Americas", "Europe").',
    example: 'Americas',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of countries within the specified region.',
    isArray: true,
    type: CountryDto,
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CountryDto',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'No content found for the specified region.',
  })
  async getCountryByRegion(@Param('region') region: string, @Query() query: CountriesQueryDto): Promise<CountryDto[]> {
    return await this.service.getCountryByRegion(region, query);
  }

  @Get('subregion/:subregion')
  @ApiOperation({
    summary: 'Retrieve countries by subregion',
    description: `Fetches a list of countries within a specified subregion. Optionally, you can exclude states from the
                  response using the \`excludeStates\` query parameter. To promote efficient API usage, please consider 
                  caching the response to minimize unnecessary requests.`,
  })
  @ApiParam({
    name: 'subregion',
    description: 'The name of the subregion to filter countries by (e.g., "Southern Europe").',
    example: 'Southern Europe',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of countries within the specified subregion.',
    isArray: true,
    type: CountryDto,
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CountryDto',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'No content found for the specified subregion.',
  })
  async getCountryBySubregion(
    @Param('subregion') subregion: string,
    @Query() query: CountriesQueryDto,
  ): Promise<CountryDto[]> {
    return await this.service.getCountryBySubregion(subregion, query);
  }

  @Get(':name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get country data by name',
    description: `
      Retrieves data for a country based on its name. 
      Includes information about the country's cities.
      
      **Optional Query Parameters:**
      - \`excludeStates=true\`: Excludes states from the results.
      - \`excludeCities=true\`: Excludes cities from the results.
      
      **Best Practices:**
      It is recommended to cache API responses to prevent excessive usage and ensure the service remains available 
      to all users.
    `,
  })
  @ApiParam({
    name: 'name',
    description: 'Name of the country (e.g., "Spain")',
    example: 'Spain',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation. Returns a list of countries with their details.',
    type: [CountryDto],
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CountryDto',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'No content. The provided country name does not correspond to any registered country.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Please verify the provided parameters.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Please try again later.',
  })
  async getCountryByName(@Param('name') name: string, @Query() query: CountryQueryDto): Promise<CountryDto> {
    return await this.service.getCountryByName(name, query);
  }

  @Get('capital/:capital')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get country data by capital',
    description: `
      Retrieves data for a country based on its capital city.

      **Optional Query Parameters:**
      - \`excludeStates=false\`: Includes states in the results.
      - \`excludeCities=true\`: Excludes cities from the results.

      **Best Practices:**
      It is recommended to cache API responses to prevent excessive usage and ensure the service remains available 
      to all users.
    `,
  })
  @ApiParam({
    name: 'capital',
    description: 'Name of the capital city (e.g., "Santiago")',
    example: 'Santiago',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation. Returns the requested country data.',
    type: CountryDto,
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CountryDto',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'No content. The provided capital does not correspond to any registered country.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Please verify the provided parameters.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Please try again later.',
  })
  async getCountryByCapital(@Param('capital') capital: string, @Query() query: CountryQueryDto): Promise<CountryDto> {
    return await this.service.getCountryByCapital(capital, query);
  }
}
