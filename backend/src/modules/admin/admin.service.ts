import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Role,
  SellerProfileStatus,
  SuggestionStatus,
  VerificationStatus,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ReviewSuggestionDto } from './dto/review-suggestion.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

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

  async deleteUser(id: string, currentAdminId: string) {
    if (id === currentAdminId) {
      throw new BadRequestException('No puedes eliminar tu propia cuenta activa.');
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
      throw new NotFoundException('Usuario no encontrado.');
    }

    if (user.role === Role.ADMIN) {
      const adminCount = await this.prisma.user.count({
        where: { role: Role.ADMIN },
      });

      if (adminCount <= 1) {
        throw new BadRequestException(
          'No puedes eliminar el ultimo administrador del sistema.',
        );
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

  async deleteBusiness(id: string) {
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
      throw new NotFoundException('Comercio no encontrado.');
    }

    return this.prisma.$transaction(async (transaction) => {
      await transaction.sellerProfile.delete({
        where: { id },
      });

      if (business.user.role === Role.SELLER) {
        await transaction.user.update({
          where: { id: business.userId },
          data: { role: Role.USER },
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
      where: { status: VerificationStatus.PENDING },
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

  async reviewVerification(
    id: string,
    adminId: string,
    dto: ReviewVerificationDto,
  ) {
    if (dto.status === VerificationStatus.PENDING) {
      throw new BadRequestException('Debes aprobar, rechazar u observar.');
    }

    const submission = await this.prisma.verificationSubmission.findUnique({
      where: { id },
      include: { sellerProfile: true },
    });

    if (!submission) {
      throw new NotFoundException('Solicitud de verificacion no encontrada.');
    }

    const sellerStatus =
      dto.status === VerificationStatus.APPROVED
        ? SellerProfileStatus.APPROVED
        : dto.status === VerificationStatus.REJECTED
          ? SellerProfileStatus.REJECTED
          : SellerProfileStatus.OBSERVED;

    const isPublic = dto.status === VerificationStatus.APPROVED;

    return this.prisma.$transaction(async (transaction) => {
      const updatedSubmission = await transaction.verificationSubmission.update(
        {
          where: { id },
          data: {
            status: dto.status,
            adminNotes: dto.notes,
            reviewedBy: adminId,
            reviewedAt: new Date(),
          },
        },
      );

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
      where: { status: SuggestionStatus.PENDING },
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

  async reviewSuggestion(id: string, dto: ReviewSuggestionDto) {
    const suggestion = await this.prisma.placeSuggestion.findUnique({
      where: { id },
    });

    if (!suggestion) {
      throw new NotFoundException('Sugerencia no encontrada.');
    }

    return this.prisma.placeSuggestion.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });
  }
}
