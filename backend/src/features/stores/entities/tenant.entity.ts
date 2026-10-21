import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { StoreCategory } from './store-category.entity';
import { TenantStatus } from './tenant-status.enum';

@Entity('tenants')
@Index('tenants_slug_key', ['slug'], {
  unique: true,
  where: `"status" <> 'REJECTED'`,
})
@Index('tenants_owner_id_key', ['ownerId'], {
  unique: true,
  where: `"status" <> 'REJECTED'`,
})
@Index('tenants_status_idx', ['status'])
export class Tenant {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: string;

  @Column({ name: 'owner_id', type: 'text' })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.tenants, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  slug: string;

  @Column({
    type: 'enum',
    enum: TenantStatus,
    enumName: 'tenant_status',
    default: TenantStatus.Pending,
  })
  status: TenantStatus;

  @Column({ name: 'category_slug', type: 'citext' })
  categorySlug: string;

  @ManyToOne(() => StoreCategory, (category) => category.tenants, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_slug', referencedColumnName: 'slug' })
  category: StoreCategory;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string | null;

  @Column({ name: 'banner_url', type: 'text', nullable: true })
  bannerUrl: string | null;

  @Column({ name: 'reviewed_by_id', type: 'text', nullable: true })
  reviewedById: string | null;

  @Column({
    name: 'reviewed_at',
    type: 'timestamptz',
    precision: 3,
    nullable: true,
  })
  reviewedAt: Date | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ name: 'created_at', type: 'timestamptz', precision: 3 })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', precision: 3 })
  updatedAt: Date;
}
