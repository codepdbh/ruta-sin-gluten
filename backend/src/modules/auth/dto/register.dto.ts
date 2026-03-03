import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

const trimString = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class RegisterDto {
  @Transform(trimString)
  @IsString()
  @MinLength(2)
  name: string;

  @Transform(trimString)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
