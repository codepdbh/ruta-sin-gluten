import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VerificationStatus } from '@prisma/client';

const trimString = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class ReviewVerificationDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  notes?: string;
}
