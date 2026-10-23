import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { Tenant } from '../../stores/entities/tenant.entity';

@Entity('users')
@Index('users_email_key', ['email'], { unique: true })
export class User {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'citext' })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'text',
    nullable: true,
    select: false,
  })
  passwordHash: string | null;

  @Column({ name: 'google_id', type: 'text', nullable: true, unique: true })
  googleId: string | null;

  @Column({ type: 'text', nullable: true })
  phone: string | null;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE'],
    enumName: 'account_status',
    default: 'INACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE';

  @Column({
    name: 'email_verified_at',
    type: 'timestamptz',
    precision: 3,
    nullable: true,
  })
  emailVerifiedAt: Date | null;

  @Column({
    name: 'terms_accepted_at',
    type: 'timestamptz',
    precision: 3,
    nullable: true,
  })
  termsAcceptedAt: Date | null;

  @Column({ name: 'created_at', type: 'timestamptz', precision: 3 })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', precision: 3 })
  updatedAt: Date;

  @OneToMany(() => Tenant, (tenant) => tenant.owner)
  tenants: Tenant[];
}
