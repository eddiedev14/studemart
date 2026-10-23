import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('categories')
  @ApiOperation({
    summary: 'Listar categorías de tienda',
    description:
      'Devuelve todas las categorías ordenadas por nombre. Endpoint público. ' +
      'Usa `slug` como valor de `storeCategory` en el registro de emprendedor y `name` para mostrar.',
  })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string', example: 'comida' },
          name: { type: 'string', example: 'Comida' },
        },
      },
    },
  })
  getCategories() {
    return this.storesService.getCategories();
  }
}
