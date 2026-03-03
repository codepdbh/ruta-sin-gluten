import { BusinessType, FoodSafetyModality } from '@prisma/client';
export declare class GetPlacesNearbyDto {
    lat: number;
    lng: number;
    radius?: number;
    businessType?: BusinessType;
    verified?: string;
    modality?: FoodSafetyModality;
    shippingAvailable?: string;
}
