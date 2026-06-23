import { PrismaService } from '../../database/prisma.service';
import { ReviewSuggestionDto } from './dto/review-suggestion.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUsers(): Promise<{
        emailVerified: boolean;
        sellerProfile: {
            status: import("@prisma/client").$Enums.SellerProfileStatus;
            id: string;
            businessName: string;
            isPublic: boolean;
        } | null;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        emailVerifiedAt: Date | null;
        createdAt: Date;
    }[]>;
    deleteUser(id: string, currentAdminId: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        businessName: string | null;
        deleted: boolean;
    }>;
    getBusinesses(): Promise<{
        id: string;
        businessName: string;
        ownerName: string;
        businessType: import("@prisma/client").$Enums.BusinessType;
        country: string;
        department: string;
        city: string;
        whatsapp: string;
        hasPhysicalStore: boolean;
        hasShipping: boolean;
        status: import("@prisma/client").$Enums.SellerProfileStatus;
        isPublic: boolean;
        createdAt: Date;
        user: {
            emailVerified: boolean;
            id: string;
            name: string;
            email: string;
            phone: string | null;
            emailVerifiedAt: Date | null;
        };
        mainLocation: {
            id: string;
            createdAt: Date;
            sellerProfileId: string;
            addressText: string;
            reference: string | null;
            lat: number | null;
            lng: number | null;
        } | null;
        counts: {
            products: number;
            deliveryPoints: number;
            verificationSubmissions: number;
        };
        verification: {
            id: string;
            status: import("@prisma/client").$Enums.VerificationStatus;
            videoUrl: string;
            submittedAt: Date;
            reviewedAt: Date | null;
        } | null;
    }[]>;
    deleteBusiness(id: string): Promise<{
        id: string;
        businessName: string;
        deleted: boolean;
    }>;
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
            logoUrl: string | null;
            businessType: import("@prisma/client").$Enums.BusinessType;
            description: string | null;
            country: string;
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
        submittedAt: Date;
        sellerProfileId: string;
        videoUrl: string;
        adminNotes: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    })[]>;
    reviewVerification(id: string, adminId: string, dto: ReviewVerificationDto): Promise<{
        status: import("@prisma/client").$Enums.VerificationStatus;
        id: string;
        submittedAt: Date;
        sellerProfileId: string;
        videoUrl: string;
        adminNotes: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
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
        addressText: string;
        reference: string | null;
        lat: number | null;
        lng: number | null;
        placeName: string;
        typeGuess: string;
        comment: string | null;
    })[]>;
    reviewSuggestion(id: string, dto: ReviewSuggestionDto): Promise<{
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
    }>;
}
