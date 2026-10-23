import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterEntrepreneurDto } from './dto/register-entrepreneur.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('entrepreneur/register')
  @ApiOperation({
    summary: 'Registrar un emprendedor y su tienda',
    description:
      'Crea en una sola transacción la cuenta del emprendedor (`INACTIVE`) y su tienda (`PENDING`). ' +
      'No devuelve token: el emprendedor no puede iniciar sesión ni vender hasta que el administrador apruebe la tienda. ' +
      'Un emprendedor solo puede tener una tienda pendiente o aprobada. ' +
      'Antes de mostrar el formulario, carga las categorías con `GET /api/stores/categories`. ' +
      'El body rechaza campos que no estén en el contrato.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'email',
        'password',
        'storeName',
        'storeDescription',
        'storeCategory',
      ],
      properties: {
        name: {
          type: 'string',
          maxLength: 191,
          description: 'Nombre completo del emprendedor.',
          example: 'Ana Pérez',
        },
        email: {
          type: 'string',
          format: 'email',
          maxLength: 191,
          description:
            'Correo institucional. Debe terminar en `@uao.edu.co`. Se guarda en minúsculas y es único.',
          example: 'ana.perez@uao.edu.co',
        },
        password: {
          type: 'string',
          format: 'password',
          minLength: 8,
          maxLength: 72,
          description:
            'Entre 8 y 72 caracteres; además no puede superar 72 bytes en UTF-8 (las tildes y los emojis pesan más de 1 byte).',
          example: 'MiClaveSegura123',
        },
        storeName: {
          type: 'string',
          minLength: 3,
          maxLength: 191,
          description:
            'Debe tener al menos 2 caracteres alfanuméricos y generar un slug único entre las tiendas no rechazadas.',
          example: 'Dulces de Ana',
        },
        storeDescription: {
          type: 'string',
          maxLength: 280,
          description: 'Descripción corta de la tienda.',
          example: 'Postres y galletas hechos a mano.',
        },
        storeCategory: {
          type: 'string',
          maxLength: 191,
          description:
            'Slug de una categoría existente, obtenido de `GET /api/stores/categories`.',
          example: 'comida',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Cuenta y tienda creadas; la tienda queda pendiente.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Tu tienda quedó pendiente de aprobación',
        },
        nextStep: {
          type: 'string',
          example:
            'El administrador revisará los datos y aprobará la tienda antes de que puedas empezar a vender.',
        },
        entrepreneur: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '0b6f3c2e-6d0e-4f6e-9a55-3f1d2f6c8a10',
            },
            name: { type: 'string', example: 'Ana Pérez' },
            email: { type: 'string', example: 'ana.perez@uao.edu.co' },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE'],
              description: 'Siempre `INACTIVE` al registrarse.',
              example: 'INACTIVE',
            },
          },
        },
        store: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Id numérico serializado como string.',
              example: '1',
            },
            name: { type: 'string', example: 'Dulces de Ana' },
            slug: {
              type: 'string',
              description:
                'Nombre normalizado para URL (minúsculas, sin tildes, guiones, máx. 63 caracteres).',
              example: 'dulces-de-ana',
            },
            category: {
              type: 'object',
              properties: {
                slug: { type: 'string', example: 'comida' },
                name: { type: 'string', example: 'Comida' },
              },
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'],
              description: 'Siempre `PENDING` al registrarse.',
              example: 'PENDING',
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Body inválido. Hay tres formas de error: ' +
      '(1) validación de campos, con `message` como arreglo de textos; ' +
      '(2) contraseña de más de 72 bytes, con `message` de texto; ' +
      '(3) nombre de tienda sin al menos 2 caracteres alfanuméricos, con `code: INVALID_STORE_NAME` y sin `statusCode`.',
    content: {
      'application/json': {
        examples: {
          validacion: {
            summary: 'Validación de campos',
            value: {
              statusCode: 400,
              message: ['El correo debe pertenecer al dominio @uao.edu.co.'],
              error: 'Bad Request',
            },
          },
          contrasenaLarga: {
            summary: 'Contraseña de más de 72 bytes',
            value: {
              statusCode: 400,
              message: 'La contraseña no puede superar los 72 bytes.',
              error: 'Bad Request',
            },
          },
          nombreTiendaInvalido: {
            summary: 'Nombre de tienda inválido',
            value: {
              code: 'INVALID_STORE_NAME',
              message:
                'El nombre de la tienda debe contener al menos dos caracteres alfanuméricos.',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'El `storeCategory` enviado no existe.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'La categoría de tienda no existe.',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiConflictResponse({
    description:
      'Conflicto de unicidad (sin `statusCode`). Ramifica por `code`: ' +
      '`EMAIL_ALREADY_REGISTERED`, `STORE_NAME_ALREADY_EXISTS` o `ENTREPRENEUR_STORE_ALREADY_EXISTS`.',
    content: {
      'application/json': {
        examples: {
          correo: {
            summary: 'Correo ya registrado',
            value: {
              code: 'EMAIL_ALREADY_REGISTERED',
              message: 'Este correo ya está registrado.',
            },
          },
          nombreTienda: {
            summary: 'Nombre de tienda en uso',
            value: {
              code: 'STORE_NAME_ALREADY_EXISTS',
              message: 'Ya existe una tienda con este nombre.',
            },
          },
          tiendaExistente: {
            summary: 'El emprendedor ya tiene tienda',
            value: {
              code: 'ENTREPRENEUR_STORE_ALREADY_EXISTS',
              message:
                'Este emprendedor ya tiene una tienda pendiente o aprobada.',
            },
          },
        },
      },
    },
  })
  registerEntrepreneur(@Body() dto: RegisterEntrepreneurDto) {
    return this.authService.registerEntrepreneur(dto);
  }
}
