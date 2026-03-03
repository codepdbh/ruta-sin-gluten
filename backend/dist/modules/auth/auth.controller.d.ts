import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        };
    }>;
    me(user: {
        sub: string;
    }): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        name: string;
        email: string;
        phone: string | null;
        createdAt: Date;
    }>;
}
