import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { GlutenType } from '@prisma/client';

const trimString = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class UpdateProductDto {
  @Transform(trimString)
  @IsOptional()
  @IsString()
  name?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  category?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQty?: number;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  stockUnit?: string;

  @IsOptional()
  @IsEnum(GlutenType)
  glutenType?: GlutenType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];
}
