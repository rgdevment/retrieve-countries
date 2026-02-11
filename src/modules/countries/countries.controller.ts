import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, HttpCode, HttpStatus, Param, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CountryDto } from './dto/country.dto';
import { CountryEntity } from './entities';

@ApiTags('countries')
@Controller()
@UseInterceptors(CacheInterceptor)
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener todos los países',
    description:
      'Retorna la lista completa de países con sus estados/regiones y ciudades. ' +
      'Ejemplo: Chile con la región de Antofagasta y la ciudad de Calama.',
  })
  @ApiResponse({ status: 200, description: 'Lista de países con estados y ciudades.', type: [CountryDto] })
  @ApiResponse({ status: 204, description: 'No se encontraron países.' })
  async getAllCountries(): Promise<CountryEntity[]> {
    return this.service.getAllCountries();
  }

  @Get('state/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener país por nombre de estado',
    description:
      'Busca un estado por nombre (insensible a mayúsculas y acentos) y retorna el país completo ' +
      'con todos sus estados y ciudades. Ejemplo: "Antofagasta" retorna Chile.',
  })
  @ApiParam({ name: 'name', description: 'Nombre del estado o región. Ej: Antofagasta', example: 'Antofagasta' })
  @ApiResponse({ status: 200, description: 'País que contiene el estado buscado.', type: CountryDto })
  @ApiResponse({ status: 204, description: 'No se encontró el estado.' })
  async getCountryByStateName(@Param('name') name: string): Promise<CountryEntity> {
    return this.service.getCountryByStateName(name);
  }

  @Get(':name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener país por nombre',
    description:
      'Busca un país por nombre con coincidencia insensible a mayúsculas y acentos. ' +
      'Soporta coincidencia exacta, por prefijo o parcial. Ejemplo: "chile", "Chile" o "Chi" retornan Chile.',
  })
  @ApiParam({ name: 'name', description: 'Nombre del país. Ej: Chile, México', example: 'Chile' })
  @ApiResponse({ status: 200, description: 'País encontrado con sus estados y ciudades.', type: CountryDto })
  @ApiResponse({ status: 204, description: 'No se encontró el país.' })
  async getCountryByName(@Param('name') name: string): Promise<CountryEntity> {
    return this.service.getCountryByName(name);
  }
}
