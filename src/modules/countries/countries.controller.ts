import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, HttpCode, HttpStatus, Param, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CountryDto } from './dto/country.dto';
import { StateDto } from './dto/state.dto';

@ApiTags('countries')
@Controller()
@UseInterceptors(CacheInterceptor)
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all countries with states and cities' })
  @ApiResponse({ status: 200, type: [CountryDto] })
  @ApiResponse({ status: 204, description: 'No countries found.' })
  async getAllCountries(): Promise<CountryDto[]> {
    return this.service.getAllCountries();
  }

  @Get('state/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a state by name with its cities' })
  @ApiParam({ name: 'name', example: 'Antofagasta' })
  @ApiResponse({ status: 200, type: StateDto })
  @ApiResponse({ status: 204, description: 'State not found.' })
  async getStateByName(@Param('name') name: string): Promise<StateDto> {
    return this.service.getStateByName(name);
  }

  @Get(':name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a country by name with states and cities' })
  @ApiParam({ name: 'name', example: 'Chile' })
  @ApiResponse({ status: 200, type: CountryDto })
  @ApiResponse({ status: 204, description: 'Country not found.' })
  async getCountryByName(@Param('name') name: string): Promise<CountryDto> {
    return this.service.getCountryByName(name);
  }
}
