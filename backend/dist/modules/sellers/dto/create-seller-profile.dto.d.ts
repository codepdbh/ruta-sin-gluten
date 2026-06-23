import { BusinessType, FoodSafetyModality, RiskLevel } from '@prisma/client';
export declare class CreateSellerProfileDto {
    businessName: string;
    ownerName: string;
    businessType: BusinessType;
    description?: string;
    country?: string;
    department: string;
    city: string;
    whatsapp: string;
    hasPhysicalStore: boolean;
    hasShipping: boolean;
    modality?: FoodSafetyModality;
    crossContaminationRisk?: RiskLevel;
    separateUtensils?: boolean;
    separateArea?: boolean;
    trainedStaff?: boolean;
    safetyNotes?: string;
}
