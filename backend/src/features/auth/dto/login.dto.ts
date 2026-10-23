import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'estudiante@uao.edu.co', maxLength: 191 })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  @MaxLength(191)
  email: string;

  @ApiProperty({ format: 'password', maxLength: 72 })
  @IsString({ message: 'La contraseña debe ser un texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @Matches(/\S/, { message: 'La contraseña es obligatoria.' })
  @MaxLength(72, { message: 'La contraseña no puede superar 72 caracteres.' })
  password: string;
}
