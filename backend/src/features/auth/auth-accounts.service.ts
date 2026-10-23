import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { AccountType, LoginAccount } from './auth-session.types';

@Injectable()
export class AuthAccountsService {
  constructor(private readonly dataSource: DataSource) {}

  async findByEmail(email: string, type: AccountType) {
    return this.findAccount('email', email, type);
  }

  async findById(id: string, type: AccountType) {
    return this.findAccount('id', id, type);
  }

  private async findAccount(
    field: 'email' | 'id',
    value: string,
    type: AccountType,
  ): Promise<LoginAccount | null> {
    // Table and field come only from internal literal unions; values are bound parameters.
    const table = type === 'admin' ? 'platform_admins' : 'users';
    const role =
      type === 'admin'
        ? "'admin'"
        : `CASE WHEN EXISTS (
            SELECT 1 FROM tenants t WHERE t.owner_id = a.id AND t.status = 'ACTIVE'
          ) THEN 'entrepreneur' ELSE 'buyer' END`;
    // Select only fields shared by both supplied schemas (no Google/verification columns).
    const accounts = await this.dataSource.query<LoginAccount[]>(
      `SELECT a.id, a.name, a.email, a.status, a.password_hash AS "passwordHash",
              ${role} AS role FROM ${table} a WHERE a.${field} = $1 LIMIT 1`,
      [value],
    );
    return accounts[0] ?? null;
  }
}
