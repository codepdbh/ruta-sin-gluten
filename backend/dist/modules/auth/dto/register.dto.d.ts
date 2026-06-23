import { BusinessType, Role } from '@prisma/client';
declare class RegisterMainLocationDto {
    addressText: string;
    reference?: string;
    lat: number;
    lng: number;
}
declare class RegisterDeliveryPointDto {
    name: string;
    addressText: string;
    reference?: string;
    schedule?: string;
    lat: number;
    lng: number;
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    avatarUrl?: string;
    businessName?: string;
    logoUrl?: string;
    businessType?: BusinessType;
    department?: string;
    country?: string;
    city?: string;
    whatsapp?: string;
    description?: string;
    hasPhysicalStore?: boolean;
    hasShipping?: boolean;
    mainLocation?: RegisterMainLocationDto;
    deliveryPoints?: RegisterDeliveryPointDto[];
    role?: Role;
}
export {};
