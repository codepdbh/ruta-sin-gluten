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
exports.SellersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
let SellersService = class SellersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOwnProfile(userId) {
        return this.prisma.sellerProfile.findUnique({
            where: { userId },
            include: {
                mainLocation: true,
                deliveryPoints: true,
                shippingAreas: true,
                foodSafetyInfo: true,
                verificationSubmissions: {
                    orderBy: { submittedAt: 'desc' },
                    take: 5,
                },
                products: {
                    include: { photos: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
    async createProfile(userId, dto) {
        const profile = await this.prisma.sellerProfile.upsert({
            where: { userId },
            update: {
                businessName: dto.businessName,
                ownerName: dto.ownerName,
                businessType: dto.businessType,
                description: dto.description,
                country: dto.country,
                department: dto.department,
                city: dto.city,
                whatsapp: dto.whatsapp,
                hasPhysicalStore: dto.hasPhysicalStore,
                hasShipping: dto.hasShipping,
                status: client_1.SellerProfileStatus.SUBMITTED,
            },
            create: {
                userId,
                businessName: dto.businessName,
                ownerName: dto.ownerName,
                businessType: dto.businessType,
                description: dto.description,
                country: dto.country ?? 'Bolivia',
                department: dto.department,
                city: dto.city,
                whatsapp: dto.whatsapp,
                hasPhysicalStore: dto.hasPhysicalStore,
                hasShipping: dto.hasShipping,
                status: client_1.SellerProfileStatus.SUBMITTED,
            },
        });
        await this.upsertFoodSafetyInfo(profile.id, dto);
        return this.getOwnProfile(userId);
    }
    async updateProfile(userId, dto) {
        const profile = await this.ensureProfile(userId);
        await this.prisma.sellerProfile.update({
            where: { id: profile.id },
            data: {
                businessName: dto.businessName,
                ownerName: dto.ownerName,
                businessType: dto.businessType,
                description: dto.description,
                country: dto.country,
                department: dto.department,
                city: dto.city,
                whatsapp: dto.whatsapp,
                hasPhysicalStore: dto.hasPhysicalStore,
                hasShipping: dto.hasShipping,
                status: profile.status === client_1.SellerProfileStatus.APPROVED
                    ? client_1.SellerProfileStatus.APPROVED
                    : client_1.SellerProfileStatus.SUBMITTED,
            },
        });
        await this.upsertFoodSafetyInfo(profile.id, dto);
        return this.getOwnProfile(userId);
    }
    async createMainLocation(userId, dto) {
        const profile = await this.ensureProfile(userId);
        if (profile.hasPhysicalStore &&
            (dto.lat === undefined || dto.lng === undefined)) {
            throw new common_1.BadRequestException('Los comercios con local fisico deben registrar latitud y longitud.');
        }
        const location = await this.prisma.sellerMainLocation.upsert({
            where: { sellerProfileId: profile.id },
            update: {
                addressText: dto.addressText,
                reference: dto.reference,
                lat: dto.lat,
                lng: dto.lng,
            },
            create: {
                sellerProfileId: profile.id,
                addressText: dto.addressText,
                reference: dto.reference,
                lat: dto.lat,
                lng: dto.lng,
            },
        });
        await this.syncMainLocationGeom(location.id, dto.lat, dto.lng);
        return location;
    }
    async createDeliveryPoint(userId, dto) {
        const profile = await this.ensureProfile(userId);
        const deliveryPointsCount = await this.prisma.sellerDeliveryPoint.count({
            where: {
                sellerProfileId: profile.id,
            },
        });
        if (deliveryPointsCount >= 6) {
            throw new common_1.BadRequestException('Solo puedes registrar hasta 6 puntos de entrega o comercio.');
        }
        const point = await this.prisma.sellerDeliveryPoint.create({
            data: {
                sellerProfileId: profile.id,
                name: dto.name,
                addressText: dto.addressText,
                reference: dto.reference,
                schedule: dto.schedule,
                lat: dto.lat,
                lng: dto.lng,
            },
        });
        await this.syncDeliveryPointGeom(point.id, dto.lat, dto.lng);
        return point;
    }
    async createShippingArea(userId, dto) {
        const profile = await this.ensureProfile(userId);
        return this.prisma.sellerShippingArea.create({
            data: {
                sellerProfileId: profile.id,
                department: dto.department,
                city: dto.city,
                deliveryType: dto.deliveryType,
                cost: dto.cost,
                etaText: dto.etaText,
            },
        });
    }
    async deleteDeliveryPoint(userId, pointId) {
        const profile = await this.ensureProfile(userId);
        const point = await this.prisma.sellerDeliveryPoint.findUnique({
            where: { id: pointId },
        });
        if (!point || point.sellerProfileId !== profile.id) {
            throw new common_1.NotFoundException('Punto de entrega no encontrado.');
        }
        const minimumDeletionDate = new Date(point.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);
        if (Date.now() < minimumDeletionDate.getTime()) {
            throw new common_1.BadRequestException('Este punto debe permanecer al menos 2 dias antes de poder borrarse.');
        }
        await this.prisma.sellerDeliveryPoint.delete({
            where: { id: point.id },
        });
        return { success: true };
    }
    async ensureProfile(userId) {
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Primero debes crear tu perfil de comercio.');
        }
        return profile;
    }
    async upsertFoodSafetyInfo(sellerProfileId, dto) {
        if (!dto.modality) {
            return;
        }
        await this.prisma.foodSafetyInfo.upsert({
            where: { sellerProfileId },
            update: {
                modality: dto.modality,
                crossContaminationRisk: dto.crossContaminationRisk,
                separateUtensils: dto.separateUtensils,
                separateArea: dto.separateArea,
                trainedStaff: dto.trainedStaff,
                notes: dto.safetyNotes,
            },
            create: {
                sellerProfileId,
                modality: dto.modality,
                crossContaminationRisk: dto.crossContaminationRisk,
                separateUtensils: dto.separateUtensils ?? false,
                separateArea: dto.separateArea ?? false,
                trainedStaff: dto.trainedStaff ?? false,
                notes: dto.safetyNotes,
            },
        });
    }
    async syncMainLocationGeom(id, lat, lng) {
        await this.prisma.$executeRawUnsafe('UPDATE seller_main_location SET geom = NULL WHERE id = $1::uuid', id);
        if (lat === undefined || lng === undefined) {
            return;
        }
        await this.prisma.$executeRawUnsafe('UPDATE seller_main_location SET geom = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3::uuid', lng, lat, id);
    }
    async syncDeliveryPointGeom(id, lat, lng) {
        await this.prisma.$executeRawUnsafe('UPDATE seller_delivery_points SET geom = NULL WHERE id = $1::uuid', id);
        if (lat === undefined || lng === undefined) {
            return;
        }
        await this.prisma.$executeRawUnsafe('UPDATE seller_delivery_points SET geom = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3::uuid', lng, lat, id);
    }
};
exports.SellersService = SellersService;
exports.SellersService = SellersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SellersService);
//# sourceMappingURL=sellers.service.js.map