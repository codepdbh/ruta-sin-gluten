import { Transform, Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';

const trimString = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateDeliveryPointDto {
  @Transform(trimString)
  @IsString()
  name: string;

  @Transform(trimString)
  @IsString()
  addressText: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  reference?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  schedule?: string;

  @Type(() => Number)
  @IsOptional()
  @IsLatitude()
  lat?: number;

  @Type(() => Number)
  @IsOptional()
  @IsLongitude()
  lng?: number;
}
