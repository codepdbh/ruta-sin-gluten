import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';

@Injectable()
export class SuggestionsService {
  constructor(private readonly prisma: PrismaService) {}

  createSuggestion(dto: CreateSuggestionDto, userId?: string) {
    return this.prisma.placeSuggestion.create({
      data: {
        userId,
        placeName: dto.placeName,
        typeGuess: dto.typeGuess,
        addressText: dto.addressText,
        reference: dto.reference,
        lat: dto.lat,
        lng: dto.lng,
        comment: dto.comment,
      },
    });
  }
}
