import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class RatePlaceDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}
