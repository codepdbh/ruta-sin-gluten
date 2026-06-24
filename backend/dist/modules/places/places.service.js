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
exports.PlacesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
let PlacesService = class PlacesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlacesInBounds(query) {
        const sellers = await this.fetchVisibleSellers(query);
        const ratingStats = await this.getRatingStats(sellers.map((seller) => seller.id));
        return sellers
            .map((seller) => this.mapSellerSummary(seller, ratingStats.get(seller.id)))
            .filter((seller) => {
            if (seller.location?.lat == null || seller.location?.lng == null) {
                return false;
            }
            return (seller.location.lat >= query.minLat &&
                seller.location.lat <= query.maxLat &&
                seller.location.lng >= query.minLng &&
                seller.location.lng <= query.maxLng);
        });
    }
    async getPlacesNearby(query) {
        const sellers = await this.fetchVisibleSellers(query);
        const ratingStats = await this.getRatingStats(sellers.map((seller) => seller.id));
        const radius = query.radius ?? 2000;
        return sellers
            .map((seller) => {
            const summary = this.mapSellerSummary(seller, ratingStats.get(seller.id));
            if (summary.location?.lat == null || summary.location?.lng == null) {
                return null;
            }
            const distanceMeters = this.haversineDistance(query.lat, query.lng, summary.location.lat, summary.location.lng);
            if (distanceMeters > radius) {
                return null;
            }
            return {
                ...summary,
                distanceMeters: Math.round(distanceMeters),
            };
        })
            .filter(Boolean)
            .sort((a, b) => (a?.distanceMeters ?? 0) - (b?.distanceMeters ?? 0));
    }
    async getPlaceById(id) {
        const seller = await this.prisma.sellerProfile.findFirst({
            where: {
                id,
                status: client_1.SellerProfileStatus.APPROVED,
                isPublic: true,
            },
            include: {
                mainLocation: true,
                deliveryPoints: {
                    where: { isActive: true },
                    orderBy: { createdAt: 'asc' },
                },
                shippingAreas: true,
                foodSafetyInfo: true,
                products: {
                    where: { isActive: true },
                    include: {
                        photos: { orderBy: { sortOrder: 'asc' } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                verificationSubmissions: {
                    orderBy: { submittedAt: 'desc' },
                    take: 1,
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!seller) {
            throw new common_1.NotFoundException('Comercio no encontrado.');
        }
        const ratingStats = await this.getRatingStats([seller.id]);
        return {
            ...this.mapSellerSummary(seller, ratingStats.get(seller.id)),
            owner: seller.user,
            products: seller.products,
            deliveryPoints: seller.deliveryPoints,
            shippingAreas: seller.shippingAreas,
        };
    }
    async getMyPlaceRating(id, userId) {
        await this.ensureVisibleSeller(id);
        const rating = await this.prisma.placeRating.findUnique({
            where: {
                sellerProfileId_userId: {
                    sellerProfileId: id,
                    userId,
                },
            },
            select: {
                score: true,
                comment: true,
                updatedAt: true,
            },
        });
        return { rating };
    }
    async ratePlace(id, userId, dto) {
        const seller = await this.ensureVisibleSeller(id);
        if (seller.userId === userId) {
            throw new common_1.BadRequestException('No puedes puntuar tu propio comercio.');
        }
        const rating = await this.prisma.placeRating.upsert({
            where: {
                sellerProfileId_userId: {
                    sellerProfileId: id,
                    userId,
                },
            },
            update: {
                score: dto.score,
                comment: dto.comment || null,
            },
            create: {
                sellerProfileId: id,
                userId,
                score: dto.score,
                comment: dto.comment || null,
            },
            select: {
                score: true,
                comment: true,
                updatedAt: true,
            },
        });
        const ratingStats = await this.getRatingStats([id]);
        return {
            rating,
            ...(ratingStats.get(id) ?? { ratingAverage: dto.score, ratingCount: 1 }),
        };
    }
    fetchVisibleSellers(filters) {
        const where = {
            status: client_1.SellerProfileStatus.APPROVED,
            isPublic: true,
            ...(filters.businessType
                ? { businessType: filters.businessType }
                : {}),
            ...(filters.modality
                ? {
                    foodSafetyInfo: {
                        is: {
                            modality: filters.modality,
                        },
                    },
                }
                : {}),
            ...(filters.shippingAvailable === 'true' ? { hasShipping: true } : {}),
        };
        return this.prisma.sellerProfile.findMany({
            where,
            include: {
                mainLocation: true,
                deliveryPoints: {
                    where: { isActive: true },
                    orderBy: { createdAt: 'asc' },
                },
                foodSafetyInfo: true,
                verificationSubmissions: {
                    orderBy: { submittedAt: 'desc' },
                    take: 1,
                },
                products: {
                    where: { isActive: true },
                    include: { photos: true },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                },
                shippingAreas: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
    mapSellerSummary(seller, ratingStats) {
        const point = this.pickPrimaryPoint(seller);
        const latestVerification = seller.verificationSubmissions[0];
        return {
            id: seller.id,
            businessName: seller.businessName,
            ownerName: seller.ownerName,
            logoUrl: seller.logoUrl,
            businessType: seller.businessType,
            description: seller.description,
            country: seller.country,
            department: seller.department,
            city: seller.city,
            whatsapp: seller.whatsapp,
            hasShipping: seller.hasShipping,
            hasPhysicalStore: seller.hasPhysicalStore,
            status: seller.status,
            isPublic: seller.isPublic,
            modality: seller.foodSafetyInfo?.modality ?? null,
            crossContaminationRisk: seller.foodSafetyInfo?.crossContaminationRisk ?? null,
            verificationStatus: latestVerification?.status ?? 'APPROVED',
            ratingAverage: ratingStats?.ratingAverage ?? 0,
            ratingCount: ratingStats?.ratingCount ?? 0,
            location: point,
            productsPreview: seller.products,
            shippingAreasCount: seller.shippingAreas.length,
        };
    }
    async ensureVisibleSeller(id) {
        const seller = await this.prisma.sellerProfile.findFirst({
            where: {
                id,
                status: client_1.SellerProfileStatus.APPROVED,
                isPublic: true,
            },
            select: {
                id: true,
                userId: true,
            },
        });
        if (!seller) {
            throw new common_1.NotFoundException('Comercio no encontrado.');
        }
        return seller;
    }
    async getRatingStats(sellerProfileIds) {
        const stats = new Map();
        const uniqueIds = Array.from(new Set(sellerProfileIds));
        if (!uniqueIds.length) {
            return stats;
        }
        const grouped = await this.prisma.placeRating.groupBy({
            by: ['sellerProfileId'],
            where: {
                sellerProfileId: { in: uniqueIds },
            },
            _avg: { score: true },
            _count: { score: true },
        });
        grouped.forEach((item) => {
            const average = item._avg.score ?? 0;
            stats.set(item.sellerProfileId, {
                ratingAverage: Math.round(average * 10) / 10,
                ratingCount: item._count.score,
            });
        });
        return stats;
    }
    pickPrimaryPoint(seller) {
        if (seller.mainLocation?.lat !== null &&
            seller.mainLocation?.lat !== undefined) {
            return {
                kind: 'MAIN',
                lat: seller.mainLocation.lat,
                lng: seller.mainLocation.lng,
                addressText: seller.mainLocation.addressText,
                reference: seller.mainLocation.reference,
            };
        }
        const deliveryPoint = seller.deliveryPoints.find((point) => point.lat !== null &&
            point.lat !== undefined &&
            point.lng !== null &&
            point.lng !== undefined);
        if (!deliveryPoint) {
            return null;
        }
        return {
            kind: 'DELIVERY',
            lat: deliveryPoint.lat,
            lng: deliveryPoint.lng,
            addressText: deliveryPoint.addressText,
            reference: deliveryPoint.reference,
            schedule: deliveryPoint.schedule,
        };
    }
    haversineDistance(lat1, lng1, lat2, lng2) {
        const earthRadius = 6_371_000;
        const toRadians = (value) => (value * Math.PI) / 180;
        const dLat = toRadians(lat2 - lat1);
        const dLng = toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
};
exports.PlacesService = PlacesService;
exports.PlacesService = PlacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlacesService);
//# sourceMappingURL=places.service.js.map