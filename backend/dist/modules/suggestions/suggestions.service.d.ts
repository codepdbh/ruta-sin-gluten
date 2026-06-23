import { PrismaService } from '../../database/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
export declare class SuggestionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSuggestion(dto: CreateSuggestionDto, userId?: string): import("@prisma/client").Prisma.Prisma__PlaceSuggestionClient<{
        status: import("@prisma/client").$Enums.SuggestionStatus;
        id: string;
        createdAt: Date;
        userId: string | null;
        addressText: string;
        reference: string | null;
        lat: number | null;
        lng: number | null;
        placeName: string;
        typeGuess: string;
        comment: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
