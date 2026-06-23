import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BusinessType, Role } from '@prisma/client';
import { Type } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

class RegisterMainLocationDto {
  @Transform(trimString)
  @IsString()
  addressText: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  reference?: string;

  @Type(() => Number)
  @IsLatitude()
  lat: number;

  @Type(() => Number)
  @IsLongitude()
  lng: number;
}

class RegisterDeliveryPointDto {
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
  @IsLatitude()
  lat: number;

  @Type(() => Number)
  @IsLongitude()
  lng: number;
}

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

  @Transform(trimString)
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  businessName?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsEnum(BusinessType)
  businessType?: BusinessType;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  department?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  country?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  city?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  hasPhysicalStore?: boolean;

  @IsOptional()
  @IsBoolean()
  hasShipping?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterMainLocationDto)
  mainLocation?: RegisterMainLocationDto;

  @IsOptional()
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => RegisterDeliveryPointDto)
  deliveryPoints?: RegisterDeliveryPointDto[];

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
