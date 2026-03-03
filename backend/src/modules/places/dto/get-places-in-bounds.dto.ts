import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BusinessType, FoodSafetyModality } from '@prisma/client';

export class GetPlacesInBoundsDto {
  @Type(() => Number)
  minLat: number;

  @Type(() => Number)
  minLng: number;

  @Type(() => Number)
  maxLat: number;

  @Type(() => Number)
  maxLng: number;

  @IsOptional()
  @IsString()
  businessType?: BusinessType;

  @IsOptional()
  @IsString()
  verified?: string;

  @IsOptional()
  @IsString()
  modality?: FoodSafetyModality;

  @IsOptional()
  @IsString()
  shippingAvailable?: string;
}
