import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { VerificationService } from './verification.service';
export declare class VerificationController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    submit(user: {
        sub: string;
    }, dto: SubmitVerificationDto): Promise<{
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
