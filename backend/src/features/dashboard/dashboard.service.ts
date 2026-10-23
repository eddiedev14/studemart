import { Injectable } from '@nestjs/common';
import type { SessionUser } from '../auth/auth-session.types';

@Injectable()
export class DashboardService {
  welcome(title: string, user: SessionUser) {
    return {
      title,
      message: `Bienvenido/a, ${user.name}.`,
      user,
    };
  }
}
