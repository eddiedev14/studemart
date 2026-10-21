import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RegisterEntrepreneurDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  name: string;

  @Transform(trimString)
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  @Matches(/@uao\.edu\.co$/i, {
    message: 'El correo debe pertenecer al dominio @uao.edu.co.',
  })
  @MaxLength(191)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @Transform(trimString)
  @IsString()
  @MinLength(3)
  @MaxLength(191)
  storeName: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  storeDescription: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  storeCategory: string;
}
