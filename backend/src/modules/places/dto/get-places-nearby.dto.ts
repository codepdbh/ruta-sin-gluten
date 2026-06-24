import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BusinessType, FoodSafetyModality } from '@prisma/client';

export class GetPlacesNearbyDto {
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  lng: number;

  @Type(() => Number)
  @IsNumber()
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
