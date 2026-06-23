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
                logoUrl: string | null;
                businessType: import("@prisma/client").$Enums.BusinessType;
                country: string;
                city: string;
                whatsapp: string;
            };
            photos: {
                id: string;
                productId: string;
                fileUrl: string;
                sortOrder: number;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            sellerProfileId: string;
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
                createdAt: Date;
                sellerProfileId: string;
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
            logoUrl: string | null;
            businessType: import("@prisma/client").$Enums.BusinessType;
            description: string | null;
            country: string;
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
        name: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        sellerProfileId: string;
        isActive: boolean;
        category: string;
        price: number;
        stockQty: number;
        stockUnit: string;
        glutenType: import("@prisma/client").$Enums.GlutenType;
    }>;
    listOwnProducts(userId: string, query: {
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: ({
            sellerProfile: {
                id: string;
                businessName: string;
                logoUrl: string | null;
                businessType: import("@prisma/client").$Enums.BusinessType;
                country: string;
                city: string;
                whatsapp: string;
            };
            photos: {
                id: string;
                productId: string;
                fileUrl: string;
                sortOrder: number;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
            sellerProfileId: string;
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
    createProduct(userId: string, dto: CreateProductDto): Promise<({
        photos: {
            id: string;
            productId: string;
            fileUrl: string;
            sortOrder: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        sellerProfileId: string;
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
        name: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        sellerProfileId: string;
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
