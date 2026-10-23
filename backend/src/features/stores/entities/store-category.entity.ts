import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('categories')
export class StoreCategory {
  @PrimaryColumn({ type: 'citext' })
  slug: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ name: 'created_at', type: 'timestamptz', precision: 3 })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', precision: 3 })
  updatedAt: Date;

  @OneToMany(() => Tenant, (tenant) => tenant.category)
  tenants: Tenant[];
}
