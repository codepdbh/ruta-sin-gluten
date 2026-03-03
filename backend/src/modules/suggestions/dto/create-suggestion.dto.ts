import { Transform, Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsOptional, IsString, MaxLength } from 'class-validator';

const trimString = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateSuggestionDto {
  @Transform(trimString)
  @IsString()
  placeName: string;

  @Transform(trimString)
  @IsString()
  typeGuess: string;

  @Transform(trimString)
  @IsString()
  addressText: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  reference?: string;

  @Type(() => Number)
  @IsOptional()
  @IsLatitude()
  lat?: number;

  @Type(() => Number)
  @IsOptional()
  @IsLongitude()
  lng?: number;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(600)
  comment?: string;
}
