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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
let VerificationService = class VerificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submit(userId, dto) {
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Primero debes crear tu perfil de seller.');
        }
        const submission = await this.prisma.verificationSubmission.create({
            data: {
                sellerProfileId: profile.id,
                videoUrl: dto.videoUrl,
                status: client_1.VerificationStatus.PENDING,
            },
        });
        await this.prisma.sellerProfile.update({
            where: { id: profile.id },
            data: {
                status: client_1.SellerProfileStatus.PENDING_VERIFICATION,
                isPublic: false,
            },
        });
        return submission;
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map