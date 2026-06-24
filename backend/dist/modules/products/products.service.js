"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listProducts(query) {
        const page = Math.max(1, query.page ?? 1);
        const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 12));
        const where = {
            isActive: true,
            ...(query.sellerId ? { sellerProfileId: query.sellerId } : {}),
            ...(query.category ? { category: query.category } : {}),
            ...(query.q
                ? {
                    OR: [
                        { name: { contains: query.q, mode: 'insensitive' } },
                        { description: { contains: query.q, mode: 'insensitive' } },
                    ],
                }
                : {}),
            sellerProfile: {
                status: client_1.SellerProfileStatus.APPROVED,
                isPublic: true,
            },
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                include: {
                    photos: { orderBy: { sortOrder: 'asc' } },
                    sellerProfile: {
                        select: {
                            id: true,
                            businessName: true,
                            logoUrl: true,
                            businessType: true,
                            whatsapp: true,
                            country: true,
                            city: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }
    async getProduct(id) {
        const product = await this.prisma.product.findFirst({
            where: {
                id,
                isActive: true,
                sellerProfile: {
                    status: client_1.SellerProfileStatus.APPROVED,
                    isPublic: true,
                },
            },
            include: {
                photos: { orderBy: { sortOrder: 'asc' } },
                sellerProfile: {
                    include: {
                        mainLocation: true,
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Producto no encontrado.');
        }
        return product;
    }
    async listOwnProducts(userId, query) {
        const profile = await this.ensureSellerProfile(userId);
        const page = Math.max(1, query.page ?? 1);
        const pageSize = Math.min(80, Math.max(1, query.pageSize ?? 24));
        const where = {
            sellerProfileId: profile.id,
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                include: {
                    photos: { orderBy: { sortOrder: 'asc' } },
                    sellerProfile: {
                        select: {
                            id: true,
                            businessName: true,
                            logoUrl: true,
                            businessType: true,
                            whatsapp: true,
                            country: true,
                            city: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }
    async createProduct(userId, dto) {
        const profile = await this.ensureSellerProfile(userId);
        const product = await this.prisma.product.create({
            data: {
                sellerProfileId: profile.id,
                name: dto.name,
                category: dto.category,
                description: dto.description,
                price: dto.price,
                stockQty: dto.stockQty,
                stockUnit: dto.stockUnit,
                glutenType: dto.glutenType,
                isActive: dto.isActive ?? true,
            },
        });
        if (dto.photoUrls?.length) {
            await this.prisma.productPhoto.createMany({
                data: dto.photoUrls.map((fileUrl, index) => ({
                    productId: product.id,
                    fileUrl,
                    sortOrder: index,
                })),
            });
        }
        return this.prisma.product.findUnique({
            where: { id: product.id },
            include: { photos: true },
        });
    }
    async updateProduct(userId, productId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { sellerProfile: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Producto no encontrado.');
        }
        if (product.sellerProfile.userId !== userId) {
            throw new common_1.ForbiddenException();
        }
        await this.prisma.product.update({
            where: { id: productId },
            data: {
                name: dto.name,
                category: dto.category,
                description: dto.description,
                price: dto.price,
                stockQty: dto.stockQty,
                stockUnit: dto.stockUnit,
                glutenType: dto.glutenType,
                isActive: dto.isActive,
            },
        });
        if (dto.photoUrls) {
            await this.prisma.productPhoto.deleteMany({ where: { productId } });
            if (dto.photoUrls.length) {
                await this.prisma.productPhoto.createMany({
                    data: dto.photoUrls.map((fileUrl, index) => ({
                        productId,
                        fileUrl,
                        sortOrder: index,
                    })),
                });
            }
        }
        return this.prisma.product.findUnique({
            where: { id: productId },
            include: { photos: true },
        });
    }
    async deleteProduct(userId, productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { sellerProfile: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Producto no encontrado.');
        }
        if (product.sellerProfile.userId !== userId) {
            throw new common_1.ForbiddenException();
        }
        await this.prisma.product.delete({ where: { id: productId } });
        return { success: true };
    }
    async ensureSellerProfile(userId) {
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Perfil de seller no encontrado.');
        }
        return profile;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map