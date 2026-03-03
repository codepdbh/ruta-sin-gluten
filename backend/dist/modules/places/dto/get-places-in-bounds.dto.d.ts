import { BusinessType, FoodSafetyModality } from '@prisma/client';
export declare class GetPlacesInBoundsDto {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
    businessType?: BusinessType;
    verified?: string;
    modality?: FoodSafetyModality;
    shippingAvailable?: string;
}
