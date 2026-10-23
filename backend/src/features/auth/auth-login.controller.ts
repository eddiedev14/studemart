import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthLoginService } from './auth-login.service';
import type { AuthenticatedRequest } from './auth-session.types';
import { CurrentSession } from './decorators/session-user.decorator';
import { LoginDto } from './dto/login.dto';
import {
  CurrentUserResponseDto,
  LoginResponseDto,
  LogoutResponseDto,
} from './dto/session-response.dto';
import { AuthErrorFilter } from './filters/auth-error.filter';
import { JwtSessionGuard } from './guards/jwt-session.guard';

@ApiTags('Auth')
@ApiUnauthorizedResponse({
  description: 'Credenciales incorrectas o sesión inválida/vencida.',
})
@ApiInternalServerErrorResponse({
  description: 'Error del servidor, code: SERVER_ERROR.',
})
@UseFilters(AuthErrorFilter)
@Controller('auth')
export class AuthLoginController {
  constructor(private readonly auth: AuthLoginService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesión como comprador o vendedor' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({
    description:
      'Correo o contraseña inválidos; campos adicionales rechazados.',
  })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto, 'user');
  }

  @Post('admin/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesión como administrador' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({
    description:
      'Correo o contraseña inválidos; campos adicionales rechazados.',
  })
  adminLogin(@Body() dto: LoginDto) {
    return this.auth.login(dto, 'admin');
  }

  @Get('me')
  @UseGuards(JwtSessionGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validar la sesión y consultar el usuario y su rol actual',
  })
  @ApiOkResponse({ type: CurrentUserResponseDto })
  me(@CurrentSession() session: AuthenticatedRequest['auth']) {
    return { user: session.user };
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtSessionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revocar la sesión del token enviado' })
  @ApiOkResponse({ type: LogoutResponseDto })
  logout(@CurrentSession() session: AuthenticatedRequest['auth']) {
    return this.auth.logout(session.sessionId);
  }
}
