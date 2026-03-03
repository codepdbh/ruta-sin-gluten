import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

const trimString = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class SubmitVerificationDto {
  @Transform(trimString)
  @IsString()
  @MinLength(4)
  videoUrl: string;
}
