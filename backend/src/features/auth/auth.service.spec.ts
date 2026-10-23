import { DataSource, EntityManager, EntityTarget } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StoreCategory } from '../stores/entities/store-category.entity';
import { Tenant } from '../stores/entities/tenant.entity';
import { TenantStatus } from '../stores/entities/tenant-status.enum';
import { User } from '../users/entities/user.entity';
import { RegisterEntrepreneurDto } from './dto/register-entrepreneur.dto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('rejects incomplete and invalid registration data', async () => {
    const dto = plainToInstance(RegisterEntrepreneurDto, {
      name: ' ',
      email: 'invalid-email',
      password: 'short',
      storeName: 'A',
      storeDescription: '',
      storeCategory: '',
    });

    const errors = await validate(dto);

    expect(errors.map(({ property }) => property)).toEqual(
      expect.arrayContaining([
        'name',
        'email',
        'password',
        'storeName',
        'storeDescription',
        'storeCategory',
      ]),
    );
  });

  it('creates an inactive account and a pending store in one transaction', async () => {
    const category = { slug: 'ropa', name: 'Ropa' } as StoreCategory;
    const userRepository = {
      exist: jest.fn().mockResolvedValue(false),
      create: jest.fn((user: Partial<User>) => user),
      save: jest.fn((user: Partial<User>) => Promise.resolve(user)),
    };
    const tenantRepository = {
      create: jest.fn((tenant: Partial<Tenant>) => tenant),
      save: jest.fn((tenant: Partial<Tenant>) =>
        Promise.resolve({ id: '42', ...tenant }),
      ),
    };
    const categoryRepository = {
      findOne: jest.fn().mockResolvedValue(category),
    };
    const repositories = new Map<EntityTarget<unknown>, object>([
      [User, userRepository],
      [Tenant, tenantRepository],
      [StoreCategory, categoryRepository],
    ]);
    const manager = {
      getRepository: jest.fn((entity: EntityTarget<unknown>) =>
        repositories.get(entity),
      ),
    };
    const transaction = jest.fn(
      <T>(callback: (manager: EntityManager) => Promise<T>) =>
        callback(manager as unknown as EntityManager),
    );
    const dataSource = {
      transaction,
    } as unknown as DataSource;
    const service = new AuthService(dataSource);
    const dto: RegisterEntrepreneurDto = {
      name: ' Emprendedor ',
      email: 'emprendedor@uao.edu.co',
      password: 'password-segura',
      storeName: '  Café Central  ',
      storeDescription: ' Café y productos locales ',
      storeCategory: 'ropa',
    };

    const result = await service.registerEntrepreneur(dto);

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Emprendedor',
        email: 'emprendedor@uao.edu.co',
        status: 'INACTIVE',
      }),
    );
    const createdTenant = tenantRepository.create.mock.calls[0]?.[0];
    expect(typeof createdTenant?.ownerId).toBe('string');
    expect(createdTenant).toMatchObject({
      name: 'Café Central',
      slug: 'cafe-central',
      description: 'Café y productos locales',
      categorySlug: 'ropa',
      status: TenantStatus.Pending,
    });
    expect(userRepository.save.mock.invocationCallOrder[0]).toBeLessThan(
      tenantRepository.save.mock.invocationCallOrder[0],
    );
    expect(result).toMatchObject({
      message: 'Tu tienda quedó pendiente de aprobación',
      entrepreneur: { status: 'INACTIVE' },
      store: {
        id: '42',
        status: TenantStatus.Pending,
        category: { slug: 'ropa', name: 'Ropa' },
      },
    });
  });
});
