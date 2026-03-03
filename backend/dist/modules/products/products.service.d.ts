import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listProducts(query: {
        sellerId?: string;
        q?: string;
        category?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: ({
            sellerProfile: {
                id: string;
                businessName: string;
                businessType: import("@prisma/client").$Enums.BusinessType;
            };
            photos: {
                id: string;
                productId: string;
                fileUrl: string;
                sortOrder: number;
            }[];
        } & {
            id: string;
            sellerProfileId: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            isActive: boolean;
            category: string;
            price: number;
            stockQty: number;
            stockUnit: string;
            glutenType: import("@prisma/client").$Enums.GlutenType;
        })[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    getProduct(id: string): Promise<{
        sellerProfile: {
            mainLocation: {
                id: string;
                sellerProfileId: string;
                createdAt: Date;
                addressText: string;
                reference: string | null;
                lat: number | null;
                lng: number | null;
            } | null;
        } & {
            status: import("@prisma/client").$Enums.SellerProfileStatus;
            id: string;
            createdAt: Date;
            userId: string;
            businessName: string;
            ownerName: string;
            businessType: import("@prisma/client").$Enums.BusinessType;
            description: string | null;
            department: string;
            city: string;
            whatsapp: string;
            hasPhysicalStore: boolean;
            hasShipping: boolean;
            isPublic: boolean;
            updatedAt: Date;
        };
        photos: {
            id: string;
            productId: string;
            fileUrl: string;
            sortOrder: number;
        }[];
    } & {
        id: string;
        sellerProfileId: string;
        name: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        price: number;
        stockQty: number;
        stockUnit: string;
        glutenType: import("@prisma/client").$Enums.GlutenType;
    }>;
    createProduct(userId: string, dto: CreateProductDto): Promise<({
        photos: {
            id: string;
            productId: string;
            fileUrl: string;
            sortOrder: number;
        }[];
    } & {
        id: string;
        sellerProfileId: string;
        name: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        price: number;
        stockQty: number;
        stockUnit: string;
        glutenType: import("@prisma/client").$Enums.GlutenType;
    }) | null>;
    updateProduct(userId: string, productId: string, dto: UpdateProductDto): Promise<({
        photos: {
            id: string;
            productId: string;
            fileUrl: string;
            sortOrder: number;
        }[];
    } & {
        id: string;
        sellerProfileId: string;
        name: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        price: number;
        stockQty: number;
        stockUnit: string;
        glutenType: import("@prisma/client").$Enums.GlutenType;
    }) | null>;
    deleteProduct(userId: string, productId: string): Promise<{
        success: boolean;
    }>;
    private ensureSellerProfile;
}
