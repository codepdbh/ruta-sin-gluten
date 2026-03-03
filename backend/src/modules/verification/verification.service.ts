import { Injectable, NotFoundException } from '@nestjs/common';
import { SellerProfileStatus, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { SubmitVerificationDto } from './dto/submit-verification.dto';

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(userId: string, dto: SubmitVerificationDto) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Primero debes crear tu perfil de seller.');
    }

    const submission = await this.prisma.verificationSubmission.create({
      data: {
        sellerProfileId: profile.id,
        videoUrl: dto.videoUrl,
        status: VerificationStatus.PENDING,
      },
    });

    await this.prisma.sellerProfile.update({
      where: { id: profile.id },
      data: {
        status: SellerProfileStatus.PENDING_VERIFICATION,
        isPublic: false,
      },
    });

    return submission;
  }
}
