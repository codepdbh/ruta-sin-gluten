import { VerificationStatus } from '@prisma/client';
export declare class ReviewVerificationDto {
    status: VerificationStatus;
    notes?: string;
}
