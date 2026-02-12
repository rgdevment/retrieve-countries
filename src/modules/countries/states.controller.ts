import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { StateDto } from './dto/state.dto';
import { StateEntity } from './entities';

@ApiTags('States')
@Controller('states')
@UseInterceptors(CacheInterceptor)
export class StatesController {
  constructor(private readonly service: CountriesService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a state/region by ID',
    description:
      'Returns the details of a specific state or region by its numeric ID, ' +
      'including its cities by default. ' +
      'Example: Antofagasta (ID 2113) returns the Antofagasta region of Chile with cities like Calama.',
  })
  @ApiParam({ name: 'id', description: 'Numeric state ID', example: '2113' })
  @ApiQuery({
    name: 'exclude',
    enum: ['cities'],
    required: false,
    description: 'Set to "cities" to omit the cities array from the response.',
  })
  @ApiResponse({ status: 200, description: 'State found with its cities.', type: StateDto })
  @ApiResponse({ status: 204, description: 'State not found.' })
  async findById(@Param('id', ParseIntPipe) id: number, @Query('exclude') exclude?: string): Promise<StateEntity> {
    return this.service.findStateById(id, exclude === 'cities');
  }
}
