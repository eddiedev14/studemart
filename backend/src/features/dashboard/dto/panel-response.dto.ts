import { ApiProperty } from '@nestjs/swagger';
import { SessionUserDto } from '../../auth/dto/session-response.dto';

export class PanelResponseDto {
  @ApiProperty({ example: 'Panel del comprador' })
  title: string;

  @ApiProperty({ example: 'Bienvenido/a, Ana Pérez.' })
  message: string;

  @ApiProperty({ type: SessionUserDto })
  user: SessionUserDto;
}
