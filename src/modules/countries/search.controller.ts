import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, HttpCode, HttpStatus, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { SearchResultDto } from './dto/search-result.dto';
import { SearchResult } from './repositories/country.repository.interface';

@ApiTags('Search')
@Controller('search')
@UseInterceptors(CacheInterceptor)
export class SearchController {
  constructor(private readonly service: CountriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Global search across countries, states, and cities',
    description:
      'Performs a simultaneous accent/case-insensitive search across countries, states, and cities. ' +
      'Returns matching results grouped by type (up to 20 per category). ' +
      'Example: "Santia" returns Santiago (Chile), Santiago del Estero (Argentina), Santiago de Cuba (Cuba).',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search term (minimum 2 characters)',
    example: 'Santia',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results grouped by countries, states, and cities.',
    type: SearchResultDto,
  })
  @ApiResponse({ status: 400, description: 'Search term is required and must be at least 2 characters.' })
  async search(@Query('q') q: string): Promise<SearchResult> {
    return this.service.search(q);
  }
}
