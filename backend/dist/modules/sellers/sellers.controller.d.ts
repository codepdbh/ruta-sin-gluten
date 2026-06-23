import { CreateDeliveryPointDto } from './dto/create-delivery-point.dto';
import { CreateMainLocationDto } from './dto/create-main-location.dto';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { CreateShippingAreaDto } from './dto/create-shipping-area.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { SellersService } from './sellers.service';
export declare class SellersController {
    private readonly sellersService;
    constructor(sellersService: SellersService);
    me(user: {
        sub: string;
    }): Promise<({
        foodSafetyInfo: {
            notes: string | null;
            id: string;
            sellerProfileId: string;
            modality: import("@prisma/client").$Enums.FoodSafetyModality;
            crossContaminationRisk: import("@prisma/client").$Enums.RiskLevel;
            separateUtensils: boolean;
            separateArea: boolean;
            trainedStaff: boolean;
        } | null;
        mainLocation: {
            id: string;
            createdAt: Date;
            sellerProfileId: string;
            addressText: string;
            reference: string | null;
            lat: number | null;
            lng: number | null;
        } | null;
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
        verificationSubmissions: {
            status: import("@prisma/client").$Enums.VerificationStatus;
            id: string;
            submittedAt: Date;
            sellerProfileId: string;
            videoUrl: string;
            adminNotes: string | null;
            reviewedBy: string | null;
            reviewedAt: Date | null;
        }[];
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
    }) | null>;
    createProfile(user: {
        sub: string;
    }, dto: CreateSellerProfileDto): Promise<({
        foodSafetyInfo: {
            notes: string | null;
            id: string;
            sellerProfileId: string;
            modality: import("@prisma/client").$Enums.FoodSafetyModality;
            crossContaminationRisk: import("@prisma/client").$Enums.RiskLevel;
            separateUtensils: boolean;
            separateArea: boolean;
            trainedStaff: boolean;
        } | null;
        mainLocation: {
            id: string;
            createdAt: Date;
            sellerProfileId: string;
            addressText: string;
            reference: string | null;
            lat: number | null;
            lng: number | null;
        } | null;
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
        verificationSubmissions: {
            status: import("@prisma/client").$Enums.VerificationStatus;
            id: string;
            submittedAt: Date;
            sellerProfileId: string;
            videoUrl: string;
            adminNotes: string | null;
            reviewedBy: string | null;
            reviewedAt: Date | null;
        }[];
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
    }) | null>;
    updateProfile(user: {
        sub: string;
    }, dto: UpdateSellerProfileDto): Promise<({
        foodSafetyInfo: {
            notes: string | null;
            id: string;
            sellerProfileId: string;
            modality: import("@prisma/client").$Enums.FoodSafetyModality;
            crossContaminationRisk: import("@prisma/client").$Enums.RiskLevel;
            separateUtensils: boolean;
            separateArea: boolean;
            trainedStaff: boolean;
        } | null;
        mainLocation: {
            id: string;
            createdAt: Date;
            sellerProfileId: string;
            addressText: string;
            reference: string | null;
            lat: number | null;
            lng: number | null;
        } | null;
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
        verificationSubmissions: {
            status: import("@prisma/client").$Enums.VerificationStatus;
            id: string;
            submittedAt: Date;
            sellerProfileId: string;
            videoUrl: string;
            adminNotes: string | null;
            reviewedBy: string | null;
            reviewedAt: Date | null;
        }[];
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
    }) | null>;
    createMainLocation(user: {
        sub: string;
    }, dto: CreateMainLocationDto): Promise<{
        id: string;
        createdAt: Date;
        sellerProfileId: string;
        addressText: string;
        reference: string | null;
        lat: number | null;
        lng: number | null;
    }>;
    createDeliveryPoint(user: {
        sub: string;
    }, dto: CreateDeliveryPointDto): Promise<{
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
    }>;
    deleteDeliveryPoint(user: {
        sub: string;
    }, id: string): Promise<{
        success: boolean;
    }>;
    createShippingArea(user: {
        sub: string;
    }, dto: CreateShippingAreaDto): Promise<{
        id: string;
        createdAt: Date;
        department: string;
        city: string | null;
        sellerProfileId: string;
        deliveryType: string;
        cost: number | null;
        etaText: string | null;
    }>;
}
