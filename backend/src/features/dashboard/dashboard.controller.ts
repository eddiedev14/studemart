import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';
import type { AuthenticatedRequest } from '../auth/auth-session.types';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentSession } from '../auth/decorators/session-user.decorator';
import { AuthErrorFilter } from '../auth/filters/auth-error.filter';
import { JwtSessionGuard } from '../auth/guards/jwt-session.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';
import { PanelResponseDto } from './dto/panel-response.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@ApiOkResponse({ type: PanelResponseDto })
@ApiUnauthorizedResponse({
  description: 'Falta el token o la sesión no está vigente.',
})
@ApiForbiddenResponse({
  description: 'El rol no corresponde al panel, code: ROLE_FORBIDDEN.',
})
@ApiInternalServerErrorResponse({
  description: 'Error del servidor, code: SERVER_ERROR.',
})
@UseFilters(AuthErrorFilter)
@UseGuards(JwtSessionGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('buyer')
  @Roles(Role.Buyer)
  @ApiOperation({ summary: 'Panel base del comprador' })
  buyer(@CurrentSession() session: AuthenticatedRequest['auth']) {
    return this.dashboard.welcome('Panel del comprador', session.user);
  }

  @Get('entrepreneur')
  @Roles(Role.Entrepreneur)
  @ApiOperation({ summary: 'Panel base del vendedor (emprendedor)' })
  entrepreneur(@CurrentSession() session: AuthenticatedRequest['auth']) {
    return this.dashboard.welcome('Panel del vendedor', session.user);
  }

  @Get('admin')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Panel base del administrador' })
  admin(@CurrentSession() session: AuthenticatedRequest['auth']) {
    return this.dashboard.welcome('Panel del administrador', session.user);
  }
}
