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