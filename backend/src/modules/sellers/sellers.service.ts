import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role, SellerProfileStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeliveryPointDto } from './dto/create-delivery-point.dto';
import { CreateMainLocationDto } from './dto/create-main-location.dto';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { CreateShippingAreaDto } from './dto/create-shipping-area.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';

@Injectable()
export class SellersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOwnProfile(userId: string) {
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

  async createProfile(userId: string, dto: CreateSellerProfileDto) {
    const profile = await this.prisma.sellerProfile.upsert({
      where: { userId },
      update: {
        businessName: dto.businessName,
        ownerName: dto.ownerName,
        businessType: dto.businessType,
        description: dto.description,
        department: dto.department,
        city: dto.city,
        whatsapp: dto.whatsapp,
        hasPhysicalStore: dto.hasPhysicalStore,
        hasShipping: dto.hasShipping,
        status: SellerProfileStatus.SUBMITTED,
      },
      create: {
        userId,
        businessName: dto.businessName,
        ownerName: dto.ownerName,
        businessType: dto.businessType,
        description: dto.description,
        department: dto.department,
        city: dto.city,
        whatsapp: dto.whatsapp,
        hasPhysicalStore: dto.hasPhysicalStore,
        hasShipping: dto.hasShipping,
        status: SellerProfileStatus.SUBMITTED,
      },
    });

    await this.upsertFoodSafetyInfo(profile.id, dto);

    return this.getOwnProfile(userId);
  }

  async updateProfile(userId: string, dto: UpdateSellerProfileDto) {
    const profile = await this.ensureProfile(userId);

    await this.prisma.sellerProfile.update({
      where: { id: profile.id },
      data: {
        businessName: dto.businessName,
        ownerName: dto.ownerName,
        businessType: dto.businessType,
        description: dto.description,
        department: dto.department,
        city: dto.city,
        whatsapp: dto.whatsapp,
        hasPhysicalStore: dto.hasPhysicalStore,
        hasShipping: dto.hasShipping,
        status:
          profile.status === SellerProfileStatus.APPROVED
            ? SellerProfileStatus.APPROVED
            : SellerProfileStatus.SUBMITTED,
      },
    });

    await this.upsertFoodSafetyInfo(profile.id, dto);

    return this.getOwnProfile(userId);
  }

  async createMainLocation(userId: string, dto: CreateMainLocationDto) {
    const profile = await this.ensureProfile(userId);

    if (profile.hasPhysicalStore && (dto.lat === undefined || dto.lng === undefined)) {
      throw new BadRequestException('Los comercios con local fisico deben registrar latitud y longitud.');
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

  async createDeliveryPoint(userId: string, dto: CreateDeliveryPointDto) {
    const profile = await this.ensureProfile(userId);

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

  async createShippingArea(userId: string, dto: CreateShippingAreaDto) {
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

  private async ensureProfile(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new NotFoundException('Primero debes crear tu perfil de comercio.');
    }

    return profile;
  }

  private async upsertFoodSafetyInfo(
    sellerProfileId: string,
    dto: Partial<CreateSellerProfileDto> | Partial<UpdateSellerProfileDto>,
  ) {
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

  private async syncMainLocationGeom(id: string, lat?: number, lng?: number) {
    await this.prisma.$executeRawUnsafe('UPDATE seller_main_location SET geom = NULL WHERE id = $1::uuid', id);

    if (lat === undefined || lng === undefined) {
      return;
    }

    await this.prisma.$executeRawUnsafe(
      'UPDATE seller_main_location SET geom = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3::uuid',
      lng,
      lat,
      id,
    );
  }

  private async syncDeliveryPointGeom(id: string, lat?: number, lng?: number) {
    await this.prisma.$executeRawUnsafe('UPDATE seller_delivery_points SET geom = NULL WHERE id = $1::uuid', id);

    if (lat === undefined || lng === undefined) {
      return;
    }

    await this.prisma.$executeRawUnsafe(
      'UPDATE seller_delivery_points SET geom = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3::uuid',
      lng,
      lat,
      id,
    );
  }
}
