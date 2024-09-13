import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDto } from '../../common/dto/country.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('countries')
@Controller()
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get('all')
  @ApiOperation({
    summary: 'Get all country data.',
    description: `This operation retrieves data for all countries along with their states. However, you will 
                  not be able to obtain a list of cities in this call due to the large number of cities in the 
                  world. Including all cities in the response of this API is not recommended for us or for the 
                  application consuming this JSON. If you need to obtain cities, you can make a new call to one 
                  of our other endpoints or filter by country, region, or other criteria. States are included by 
                  default, but you can exclude them using the parameter excludeStates=true. 
                  As a commitment to best practices, we ask for your help by caching the API response to avoid 
                  excessive usage and help us keep it public and available for everyone.`,
  })
  @ApiQuery({
    name: 'excludeStates',
    description: `Exclude states in the response. This option is temporarily disabled until we optimize and improve
                  the response size.`,
    required: false,
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: [CountryDto],
  })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  async getAllCountries(@Query('excludeStates') _: string): Promise<CountryDto[]> {
    // It will always be excluded until the response size is optimized
    return this.service.getAllCountries(true);
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Get country data by name.',
    description: `This operation retrieves data for a country by its name and includes its cities. 
                  If you wish to include the states from the results, you can use the parameter 
                  excludeStates=false; similarly, if you want to exclude the cities, you can use 
                  excludeCities=true; 
                  As a commitment to best practices, we ask for your help by caching the API response to avoid 
                  excessive usage and help us keep it public and available for everyone.`,
  })
  @ApiQuery({
    name: 'excludeStates',
    description: 'If true, states will be excluded from the result.',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'excludeCities',
    description: 'If true, cities will be excluded from the result.',
    required: false,
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: CountryDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  async getCountryByName(
    @Param('name') name: string,
    @Query('excludeStates') excludeStates: string,
    @Query('excludeCities') excludeCities: string,
  ): Promise<CountryDto> {
    return await this.service.getCountryByName(name, excludeStates === 'true', excludeCities === 'true');
  }
}
