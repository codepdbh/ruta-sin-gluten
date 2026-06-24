import { GetPlacesInBoundsDto } from './dto/get-places-in-bounds.dto';
import { GetPlacesNearbyDto } from './dto/get-places-nearby.dto';
import { RatePlaceDto } from './dto/rate-place.dto';
import { PlacesService } from './places.service';
export declare class PlacesController {
    private readonly placesService;
    constructor(placesService: PlacesService);
    getPlacesInBounds(query: GetPlacesInBoundsDto): Promise<{
        id: string;
        businessName: string;
        ownerName: string;
        logoUrl: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType;
        description: string | null;
        country: string;
        department: string;
        city: string;
        whatsapp: string;
        hasShipping: boolean;
        hasPhysicalStore: boolean;
        status: import("@prisma/client").$Enums.SellerProfileStatus;
        isPublic: boolean;
        modality: import("@prisma/client").$Enums.FoodSafetyModality | null;
        crossContaminationRisk: import("@prisma/client").$Enums.RiskLevel | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        ratingAverage: number;
        ratingCount: number;
        location: {
            kind: string;
            lat: number;
            lng: number | null;
            addressText: string;
            reference: string | null;
            schedule?: undefined;
        } | {
            kind: string;
            lat: number | null;
            lng: number | null;
            addressText: string;
            reference: string | null;
            schedule: string | null;
        } | null;
        productsPreview: ({
            photos: {
                id: string;
                productId: string;
                fileUrl: string;
                sortOrder: number;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            sellerProfileId: string;
            isActive: boolean;
            category: string;
            price: number;
            stockQty: number;
            stockUnit: string;
            glutenType: import("@prisma/client").$Enums.GlutenType;
        })[];
        shippingAreasCount: number;
    }[]>;
    getPlacesNearby(query: GetPlacesNearbyDto): Promise<({
        distanceMeters: number;
        id: string;
        businessName: string;
        ownerName: string;
        logoUrl: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType;
        description: string | null;
        country: string;
        department: string;
        city: string;
        whatsapp: string;
        hasShipping: boolean;
        hasPhysicalStore: boolean;
        status: import("@prisma/client").$Enums.SellerProfileStatus;
        isPublic: boolean;
        modality: import("@prisma/client").$Enums.FoodSafetyModality | null;
        crossContaminationRisk: import("@prisma/client").$Enums.RiskLevel | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        ratingAverage: number;
        ratingCount: number;
        location: {
            kind: string;
            lat: number;
            lng: number | null;
            addressText: string;
            reference: string | null;
            schedule?: undefined;
        } | {
            kind: string;
            lat: number | null;
            lng: number | null;
            addressText: string;
            reference: string | null;
            schedule: string | null;
        } | null;
        productsPreview: ({
            photos: {
                id: string;
                productId: string;
                fileUrl: string;
                sortOrder: number;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            sellerProfileId: string;
            isActive: boolean;
            category: string;
            price: number;
            stockQty: number;
            stockUnit: string;
            glutenType: import("@prisma/client").$Enums.GlutenType;
        })[];
        shippingAreasCount: number;
    } | null)[]>;
    getMyPlaceRating(id: string, user: {
        sub: string;
    }): Promise<{
        rating: {
            updatedAt: Date;
            comment: string | null;
            score: number;
        } | null;
    }>;
    ratePlace(id: string, user: {
        sub: string;
    }, dto: RatePlaceDto): Promise<{
        ratingAverage: number;
        ratingCount: number;
        rating: {
            updatedAt: Date;
            comment: string | null;
            score: number;
        };
    }>;
    getPlaceById(id: string): Promise<{
        owner: {
            id: string;
            name: string;
        };
        products: ({
            photos: {
                id: string;
                productId: string;
                fileUrl: string;
                sortOrder: number;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            sellerProfileId: string;
            isActive: boolean;
            category: string;
            price: number;
            stockQty: number;
            stockUnit: string;
            glutenType: import("@prisma/client").$Enums.GlutenType;
        })[];
        deliveryPoints: {
            id: string;
            name: string;
            createdAt: Date;
            sellerProfileId: string;
            addressText: string;
            reference: string | null;
            lat: number | null;
            lng: number | null;
            schedule: string | null;
            isActive: boolean;
        }[];
        shippingAreas: {
            id: string;
            createdAt: Date;
            department: string;
            city: string | null;
            sellerProfileId: string;
            deliveryType: string;
            cost: number | null;
            etaText: string | null;
        }[];
        id: string;
        businessName: string;
        ownerName: string;
        logoUrl: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType;
        description: string | null;
        country: string;
        department: string;
        city: string;
        whatsapp: string;
        hasShipping: boolean;
        hasPhysicalStore: boolean;
        status: import("@prisma/client").$Enums.SellerProfileStatus;
        isPublic: boolean;
        modality: import("@prisma/client").$Enums.FoodSafetyModality | null;
        crossContaminationRisk: import("@prisma/client").$Enums.RiskLevel | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        ratingAverage: number;
        ratingCount: number;
        location: {
            kind: string;
            lat: number;
            lng: number | null;
            addressText: string;
            reference: string | null;
            schedule?: undefined;
        } | {
            kind: string;
            lat: number | null;
            lng: number | null;
            addressText: string;
            reference: string | null;
            schedule: string | null;
        } | null;
        productsPreview: ({
            photos: {
                id: string;
                productId: string;
                fileUrl: string;
                sortOrder: number;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            sellerProfileId: string;
            isActive: boolean;
            category: string;
            price: number;
            stockQty: number;
            stockUnit: string;
            glutenType: import("@prisma/client").$Enums.GlutenType;
        })[];
        shippingAreasCount: number;
    }>;
}
