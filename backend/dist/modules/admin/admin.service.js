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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                avatarUrl: true,
                emailVerifiedAt: true,
                createdAt: true,
                sellerProfile: {
                    select: {
                        id: true,
                        businessName: true,
                        status: true,
                        isPublic: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 500,
        });
        return users.map((user) => ({
            ...user,
            emailVerified: Boolean(user.emailVerifiedAt),
        }));
    }
    async deleteUser(id, currentAdminId) {
        if (id === currentAdminId) {
            throw new common_1.BadRequestException('No puedes eliminar tu propia cuenta activa.');
        }
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                sellerProfile: {
                    select: {
                        id: true,
                        businessName: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado.');
        }
        if (user.role === client_1.Role.ADMIN) {
            const adminCount = await this.prisma.user.count({
                where: { role: client_1.Role.ADMIN },
            });
            if (adminCount <= 1) {
                throw new common_1.BadRequestException('No puedes eliminar el ultimo administrador del sistema.');
            }
        }
        await this.prisma.user.delete({
            where: { id },
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            businessName: user.sellerProfile?.businessName ?? null,
            deleted: true,
        };
    }
    async getBusinesses() {
        const businesses = await this.prisma.sellerProfile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        emailVerifiedAt: true,
                    },
                },
                mainLocation: true,
                verificationSubmissions: {
                    orderBy: { submittedAt: 'desc' },
                    take: 1,
                },
                _count: {
                    select: {
                        products: true,
                        deliveryPoints: true,
                        verificationSubmissions: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 500,
        });
        return businesses.map((business) => {
            const latestVerification = business.verificationSubmissions[0] ?? null;
            return {
                id: business.id,
                businessName: business.businessName,
                ownerName: business.ownerName,
                businessType: business.businessType,
                country: business.country,
                department: business.department,
                city: business.city,
                whatsapp: business.whatsapp,
                hasPhysicalStore: business.hasPhysicalStore,
                hasShipping: business.hasShipping,
                status: business.status,
                isPublic: business.isPublic,
                createdAt: business.createdAt,
                user: {
                    ...business.user,
                    emailVerified: Boolean(business.user.emailVerifiedAt),
                },
                mainLocation: business.mainLocation,
                counts: {
                    products: business._count.products,
                    deliveryPoints: business._count.deliveryPoints,
                    verificationSubmissions: business._count.verificationSubmissions,
                },
                verification: latestVerification
                    ? {
                        id: latestVerification.id,
                        status: latestVerification.status,
                        videoUrl: latestVerification.videoUrl,
                        submittedAt: latestVerification.submittedAt,
                        reviewedAt: latestVerification.reviewedAt,
                    }
                    : null,
            };
        });
    }
    async deleteBusiness(id) {
        const business = await this.prisma.sellerProfile.findUnique({
            where: { id },
            select: {
                id: true,
                businessName: true,
                userId: true,
                user: {
                    select: {
                        role: true,
                    },
                },
            },
        });
        if (!business) {
            throw new common_1.NotFoundException('Comercio no encontrado.');
        }
        return this.prisma.$transaction(async (transaction) => {
            await transaction.sellerProfile.delete({
                where: { id },
            });
            if (business.user.role === client_1.Role.SELLER) {
                await transaction.user.update({
                    where: { id: business.userId },
                    data: { role: client_1.Role.USER },
                });
            }
            return {
                id: business.id,
                businessName: business.businessName,
                deleted: true,
            };
        });
    }
    getPendingVerifications() {
        return this.prisma.verificationSubmission.findMany({
            where: { status: client_1.VerificationStatus.PENDING },
            include: {
                sellerProfile: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: { submittedAt: 'asc' },
        });
    }
    async reviewVerification(id, adminId, dto) {
        if (dto.status === client_1.VerificationStatus.PENDING) {
            throw new common_1.BadRequestException('Debes aprobar, rechazar u observar.');
        }
        const submission = await this.prisma.verificationSubmission.findUnique({
            where: { id },
            include: { sellerProfile: true },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Solicitud de verificacion no encontrada.');
        }
        const sellerStatus = dto.status === client_1.VerificationStatus.APPROVED
            ? client_1.SellerProfileStatus.APPROVED
            : dto.status === client_1.VerificationStatus.REJECTED
                ? client_1.SellerProfileStatus.REJECTED
                : client_1.SellerProfileStatus.OBSERVED;
        const isPublic = dto.status === client_1.VerificationStatus.APPROVED;
        return this.prisma.$transaction(async (transaction) => {
            const updatedSubmission = await transaction.verificationSubmission.update({
                where: { id },
                data: {
                    status: dto.status,
                    adminNotes: dto.notes,
                    reviewedBy: adminId,
                    reviewedAt: new Date(),
                },
            });
            await transaction.sellerProfile.update({
                where: { id: submission.sellerProfileId },
                data: {
                    status: sellerStatus,
                    isPublic,
                },
            });
            return updatedSubmission;
        });
    }
    getPendingSuggestions() {
        return this.prisma.placeSuggestion.findMany({
            where: { status: client_1.SuggestionStatus.PENDING },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async reviewSuggestion(id, dto) {
        const suggestion = await this.prisma.placeSuggestion.findUnique({
            where: { id },
        });
        if (!suggestion) {
            throw new common_1.NotFoundException('Sugerencia no encontrada.');
        }
        return this.prisma.placeSuggestion.update({
            where: { id },
            data: {
                status: dto.status,
            },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map