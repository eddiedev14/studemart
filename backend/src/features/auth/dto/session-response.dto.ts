import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class SessionUserDto {
  @ApiProperty({ example: 'usr-ana' })
  id: string;

  @ApiProperty({ example: 'Ana Pérez' })
  name: string;

  @ApiProperty({ example: 'ana@uao.edu.co' })
  email: string;

  @ApiProperty({ enum: Role, example: Role.Buyer })
  role: Role;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT para Authorization: Bearer <token>' })
  token: string;

  @ApiProperty({ type: SessionUserDto })
  user: SessionUserDto;
}

export class CurrentUserResponseDto {
  @ApiProperty({ type: SessionUserDto })
  user: SessionUserDto;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Sesión cerrada correctamente.' })
  message: string;
}
