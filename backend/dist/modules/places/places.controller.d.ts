import { GetPlacesInBoundsDto } from './dto/get-places-in-bounds.dto';
import { GetPlacesNearbyDto } from './dto/get-places-nearby.dto';
import { PlacesService } from './places.service';
export declare class PlacesController {
    private readonly placesService;
    constructor(placesService: PlacesService);
    getPlacesInBounds(query: GetPlacesInBoundsDto): Promise<{
        id: string;
        businessName: string;
        ownerName: string;
        businessType: import("@prisma/client").$Enums.BusinessType;
        description: string | null;
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
            sellerProfileId: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
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
        businessType: import("@prisma/client").$Enums.BusinessType;
        description: string | null;
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
            sellerProfileId: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            isActive: boolean;
            category: string;
            price: number;
            stockQty: number;
            stockUnit: string;
            glutenType: import("@prisma/client").$Enums.GlutenType;
        })[];
        shippingAreasCount: number;
    } | null)[]>;
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
            sellerProfileId: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            isActive: boolean;
            category: string;
            price: number;
            stockQty: number;
            stockUnit: string;
            glutenType: import("@prisma/client").$Enums.GlutenType;
        })[];
        deliveryPoints: {
            id: string;
            sellerProfileId: string;
            name: string;
            createdAt: Date;
            addressText: string;
            reference: string | null;
            lat: number | null;
            lng: number | null;
            isActive: boolean;
            schedule: string | null;
        }[];
        shippingAreas: {
            id: string;
            sellerProfileId: string;
            createdAt: Date;
            department: string;
            city: string | null;
            deliveryType: string;
            cost: number | null;
            etaText: string | null;
        }[];
        id: string;
        businessName: string;
        ownerName: string;
        businessType: import("@prisma/client").$Enums.BusinessType;
        description: string | null;
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
            sellerProfileId: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
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
