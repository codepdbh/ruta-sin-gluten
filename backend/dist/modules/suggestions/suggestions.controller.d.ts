import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
export declare class SuggestionsController {
    private readonly suggestionsService;
    constructor(suggestionsService: SuggestionsService);
    createSuggestion(dto: CreateSuggestionDto): import("@prisma/client").Prisma.Prisma__PlaceSuggestionClient<{
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
