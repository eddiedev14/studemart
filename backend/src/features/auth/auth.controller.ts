import { Body, Controller, Post } from '@nestjs/common';
import { RegisterEntrepreneurDto } from './dto/register-entrepreneur.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('entrepreneur/register')
  registerEntrepreneur(@Body() dto: RegisterEntrepreneurDto) {
    return this.authService.registerEntrepreneur(dto);
  }
}
