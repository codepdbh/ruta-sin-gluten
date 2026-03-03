import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

const trimString = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateShippingAreaDto {
  @Transform(trimString)
  @IsString()
  department: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  city?: string;

  @Transform(trimString)
  @IsString()
  deliveryType: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  etaText?: string;
}
