import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BusinessType, FoodSafetyModality } from '@prisma/client';

export class GetPlacesNearbyDto {
  @Type(() => Number)
  lat: number;

  @Type(() => Number)
  lng: number;

  @Type(() => Number)
  @IsOptional()
  radius?: number;

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
