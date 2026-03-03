import { PrismaService } from '../../database/prisma.service';
import { ReviewSuggestionDto } from './dto/review-suggestion.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPendingVerifications(): import("@prisma/client").Prisma.PrismaPromise<({
        sellerProfile: {
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            status: import("@prisma/client").$Enums.SellerProfileStatus;
            id: string;
            createdAt: Date;
            userId: string;
            businessName: string;
            ownerName: string;
            businessType: import("@prisma/client").$Enums.BusinessType;
            description: string | null;
            department: string;
            city: string;
            whatsapp: string;
            hasPhysicalStore: boolean;
            hasShipping: boolean;
            isPublic: boolean;
            updatedAt: Date;
        };
    } & {
        status: import("@prisma/client").$Enums.VerificationStatus;
        id: string;
        sellerProfileId: string;
        videoUrl: string;
        adminNotes: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        submittedAt: Date;
    })[]>;
    reviewVerification(id: string, adminId: string, dto: ReviewVerificationDto): Promise<{
        status: import("@prisma/client").$Enums.VerificationStatus;
        id: string;
        sellerProfileId: string;
        videoUrl: string;
        adminNotes: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        submittedAt: Date;
    }>;
    getPendingSuggestions(): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.SuggestionStatus;
        id: string;
        createdAt: Date;
        userId: string | null;
        placeName: string;
        typeGuess: string;
        addressText: string;
        reference: string | null;
        lat: number | null;
        lng: number | null;
        comment: string | null;
    })[]>;
    reviewSuggestion(id: string, dto: ReviewSuggestionDto): Promise<{
        status: import("@prisma/client").$Enums.SuggestionStatus;
        id: string;
        createdAt: Date;
        userId: string | null;
        placeName: string;
        typeGuess: string;
        addressText: string;
        reference: string | null;
        lat: number | null;
        lng: number | null;
        comment: string | null;
    }>;
}
