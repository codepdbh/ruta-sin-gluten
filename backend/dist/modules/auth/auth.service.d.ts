import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
            emailVerifiedAt: Date | null | undefined;
            createdAt: Date;
        };
        emailVerificationSent: boolean | undefined;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
            emailVerifiedAt: Date | null | undefined;
            createdAt: Date;
        };
        emailVerificationSent: boolean | undefined;
    }>;
    confirmEmailVerification(token: string): Promise<{
        message: string;
    }>;
    resendEmailVerification(userId: string): Promise<{
        message: string;
        emailVerificationSent: boolean;
    }>;
    requestPasswordReset(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    me(userId: string): Promise<{
        emailVerified: boolean;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        emailVerifiedAt: Date | null;
        createdAt: Date;
    }>;
    private buildAuthResponse;
    private createAndSendEmailVerification;
    private hashToken;
    private sendBrevoVerificationEmail;
    private sendBrevoPasswordResetEmail;
    private escapeHtml;
    private ensureSellerRegistrationFields;
    private createInitialLocations;
}
