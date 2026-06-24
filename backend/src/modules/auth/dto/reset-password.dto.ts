import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class ResetPasswordDto {
  @Transform(trimString)
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}
