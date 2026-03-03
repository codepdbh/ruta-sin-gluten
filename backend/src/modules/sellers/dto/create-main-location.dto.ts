import { Transform, Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsOptional, IsString, ValidateIf } from 'class-validator';

const trimString = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateMainLocationDto {
  @Transform(trimString)
  @IsString()
  addressText: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  reference?: string;

  @ValidateIf(({ lat }) => lat !== undefined && lat !== null)
  @Type(() => Number)
  @IsLatitude()
  lat?: number;

  @ValidateIf(({ lng }) => lng !== undefined && lng !== null)
  @Type(() => Number)
  @IsLongitude()
  lng?: number;
}
