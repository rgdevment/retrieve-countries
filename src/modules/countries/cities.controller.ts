import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CityDto } from './dto/city.dto';
import { CityEntity } from './entities';

@ApiTags('Cities')
@Controller('cities')
@UseInterceptors(CacheInterceptor)
export class CitiesController {
  constructor(private readonly service: CountriesService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a city by ID',
    description:
      'Returns the details of a specific city by its numeric ID. ' + 'Example: Calama (Antofagasta region, Chile).',
  })
  @ApiParam({ name: 'id', description: 'Numeric city ID', example: '21553' })
  @ApiResponse({ status: 200, description: 'City found.', type: CityDto })
  @ApiResponse({ status: 204, description: 'City not found.' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<CityEntity> {
    return this.service.findCityById(id);
  }
}
