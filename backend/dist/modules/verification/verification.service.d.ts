import { PrismaService } from '../../database/prisma.service';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
export declare class VerificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    submit(userId: string, dto: SubmitVerificationDto): Promise<{
        status: import("@prisma/client").$Enums.VerificationStatus;
        id: string;
        submittedAt: Date;
        sellerProfileId: string;
        videoUrl: string;
        adminNotes: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
}
