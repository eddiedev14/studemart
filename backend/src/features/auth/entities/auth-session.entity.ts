import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { AccountType } from '../auth-session.types';

@Entity('auth_sessions')
export class AuthSession {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ name: 'account_id', type: 'text' })
  accountId: string;

  @Column({ name: 'account_type', type: 'text' })
  accountType: AccountType;

  @Column({ name: 'expires_at', type: 'timestamptz', precision: 3 })
  expiresAt: Date;

  @Column({
    name: 'revoked_at',
    type: 'timestamptz',
    precision: 3,
    nullable: true,
  })
  revokedAt: Date | null;
}
