import { randomUUID } from 'node:crypto';
import { hash } from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, DataSource } from 'typeorm';
import { StoreCategory } from '../stores/entities/store-category.entity';
import { Tenant } from '../stores/entities/tenant.entity';
import { TenantStatus } from '../stores/entities/tenant-status.enum';
import { User } from '../users/entities/user.entity';
import { RegisterEntrepreneurDto } from './dto/register-entrepreneur.dto';

const USER_EMAIL_CONSTRAINT = 'users_email_key';
const TENANT_SLUG_CONSTRAINT = 'tenants_slug_key';
const TENANT_OWNER_CONSTRAINT = 'tenants_owner_id_key';

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource) {}

  async registerEntrepreneur(dto: RegisterEntrepreneurDto) {
    if (Buffer.byteLength(dto.password, 'utf8') > 72) {
      throw new BadRequestException(
        'La contraseña no puede superar los 72 bytes.',
      );
    }

    const email = dto.email.trim().toLowerCase();
    const normalizedStoreName = this.normalizeStoreName(dto.storeName);
    const slug = this.createSlug(normalizedStoreName);

    try {
      return await this.dataSource.transaction(async (manager) => {
        const userRepository = manager.getRepository(User);
        const tenantRepository = manager.getRepository(Tenant);
        const categoryRepository = manager.getRepository(StoreCategory);

        if (await userRepository.exist({ where: { email } })) {
          throw this.emailConflict();
        }

        const category = await categoryRepository.findOne({
          where: { slug: dto.storeCategory },
        });
        if (!category) {
          throw new NotFoundException('La categoría de tienda no existe.');
        }

        const user = await userRepository.save(
          userRepository.create({
            id: randomUUID(),
            name: dto.name.trim(),
            email,
            passwordHash: await hash(dto.password, 12),
            status: 'INACTIVE',
          }),
        );

        const tenant = await tenantRepository.save(
          tenantRepository.create({
            ownerId: user.id,
            owner: user,
            name: normalizedStoreName,
            slug,
            status: TenantStatus.Pending,
            description: dto.storeDescription.trim(),
            categorySlug: category.slug,
            category,
          }),
        );

        return {
          message: 'Tu tienda quedó pendiente de aprobación',
          nextStep:
            'El administrador revisará los datos y aprobará la tienda antes de que puedas empezar a vender.',
          entrepreneur: {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
          },
          store: {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            category: {
              slug: category.slug,
              name: category.name,
            },
            status: tenant.status,
          },
        };
      });
    } catch (error: unknown) {
      const constraint = this.getPostgresConstraint(error);

      if (constraint === USER_EMAIL_CONSTRAINT) {
        throw this.emailConflict();
      }

      if (
        constraint === TENANT_SLUG_CONSTRAINT ||
        constraint === TENANT_OWNER_CONSTRAINT
      ) {
        throw new ConflictException({
          code:
            constraint === TENANT_SLUG_CONSTRAINT
              ? 'STORE_NAME_ALREADY_EXISTS'
              : 'ENTREPRENEUR_STORE_ALREADY_EXISTS',
          message:
            constraint === TENANT_SLUG_CONSTRAINT
              ? 'Ya existe una tienda con este nombre.'
              : 'Este emprendedor ya tiene una tienda pendiente o aprobada.',
        });
      }

      throw error;
    }
  }

  private normalizeStoreName(name: string): string {
    return name.normalize('NFKC').trim().replace(/\s+/g, ' ');
  }

  private createSlug(name: string): string {
    const slug = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 63)
      .replace(/-+$/g, '');

    if (slug.length < 2) {
      throw new BadRequestException({
        code: 'INVALID_STORE_NAME',
        message:
          'El nombre de la tienda debe contener al menos dos caracteres alfanuméricos.',
      });
    }
    return slug;
  }

  private emailConflict(): ConflictException {
    return new ConflictException({
      code: 'EMAIL_ALREADY_REGISTERED',
      message: 'Este correo ya está registrado.',
    });
  }

  private getPostgresConstraint(error: unknown): string | undefined {
    if (!(error instanceof QueryFailedError)) {
      return undefined;
    }

    const driverError: unknown = error.driverError;
    if (
      typeof driverError === 'object' &&
      driverError !== null &&
      'constraint' in driverError &&
      typeof driverError.constraint === 'string'
    ) {
      return driverError.constraint;
    }
    return undefined;
  }
}
