import { IsEnum } from 'class-validator';
import { SuggestionStatus } from '@prisma/client';

export class ReviewSuggestionDto {
  @IsEnum(SuggestionStatus)
  status: SuggestionStatus;
}
