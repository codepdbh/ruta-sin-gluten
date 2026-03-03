import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BusinessType,
  FoodSafetyModality,
  RiskLevel,
} from '@prisma/client';

const trimString = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class UpdateSellerProfileDto {
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(2)
  businessName?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(2)
  ownerName?: string;

  @IsOptional()
  @IsEnum(BusinessType)
  businessType?: BusinessType;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(600)
  description?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  department?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  city?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsBoolean()
  hasPhysicalStore?: boolean;

  @IsOptional()
  @IsBoolean()
  hasShipping?: boolean;

  @IsOptional()
  @IsEnum(FoodSafetyModality)
  modality?: FoodSafetyModality;

  @IsOptional()
  @IsEnum(RiskLevel)
  crossContaminationRisk?: RiskLevel;

  @IsOptional()
  @IsBoolean()
  separateUtensils?: boolean;

  @IsOptional()
  @IsBoolean()
  separateArea?: boolean;

  @IsOptional()
  @IsBoolean()
  trainedStaff?: boolean;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(600)
  safetyNotes?: string;
}
