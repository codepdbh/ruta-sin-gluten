import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    requestPasswordReset(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    resendEmailVerification(user: {
        sub: string;
    }): Promise<{
        message: string;
        emailVerificationSent: boolean;
    }>;
    me(user: {
        sub: string;
    }): Promise<{
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
}
