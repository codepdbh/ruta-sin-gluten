import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BusinessType, FoodSafetyModality } from '@prisma/client';

export class GetPlacesInBoundsDto {
  @Type(() => Number)
  @IsNumber()
  minLat: number;

  @Type(() => Number)
  @IsNumber()
  minLng: number;

  @Type(() => Number)
  @IsNumber()
  maxLat: number;

  @Type(() => Number)
  @IsNumber()
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
