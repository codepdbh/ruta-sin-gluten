import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
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

  async reviewVerification(id: string, adminId: string, dto: ReviewVerificationDto) {
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
