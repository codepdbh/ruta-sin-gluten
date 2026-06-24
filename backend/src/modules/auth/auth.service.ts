import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessType, Role, SellerProfileStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../../database/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new ConflictException('El correo ya esta registrado.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const role = dto.role === Role.SELLER ? Role.SELLER : Role.USER;

    if (role === Role.SELLER) {
      this.ensureSellerRegistrationFields(dto);
    }

    const { user, sellerProfileId } = await this.prisma.$transaction(
      async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            name: dto.name,
            email,
            passwordHash,
            role,
            phone: dto.phone,
            avatarUrl: dto.avatarUrl,
          },
        });

        let nextSellerProfileId: string | null = null;

        if (role === Role.SELLER) {
          const sellerProfile = await tx.sellerProfile.upsert({
            where: { userId: createdUser.id },
            update: {
              businessName: dto.businessName!,
              ownerName: dto.name,
              logoUrl: dto.logoUrl,
              businessType: dto.businessType ?? BusinessType.OTRO,
              description: dto.description,
              country: dto.country ?? 'Bolivia',
              department: dto.department!,
              city: dto.city!,
              whatsapp: dto.whatsapp ?? dto.phone ?? '',
              hasPhysicalStore: dto.hasPhysicalStore ?? false,
              hasShipping: dto.hasShipping ?? false,
              status: SellerProfileStatus.DRAFT,
            },
            create: {
              userId: createdUser.id,
              businessName: dto.businessName!,
              ownerName: dto.name,
              logoUrl: dto.logoUrl,
              businessType: dto.businessType ?? BusinessType.OTRO,
              description: dto.description,
              country: dto.country ?? 'Bolivia',
              department: dto.department!,
              city: dto.city!,
              whatsapp: dto.whatsapp ?? dto.phone ?? '',
              hasPhysicalStore: dto.hasPhysicalStore ?? false,
              hasShipping: dto.hasShipping ?? false,
              status: SellerProfileStatus.DRAFT,
            },
          });

          nextSellerProfileId = sellerProfile.id;
        }

        return {
          user: createdUser,
          sellerProfileId: nextSellerProfileId,
        };
      },
    );

    if (role === Role.SELLER && sellerProfileId) {
      await this.createInitialLocations(sellerProfileId, dto);
    }

    const emailVerificationSent = await this.createAndSendEmailVerification(
      user.id,
      user.email,
      user.name,
    );
    const refreshedUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });

    return this.buildAuthResponse(refreshedUser, emailVerificationSent);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    return this.buildAuthResponse(user);
  }

  async confirmEmailVerification(token: string) {
    if (!token) {
      throw new BadRequestException('El token de verificacion es obligatorio.');
    }

    const tokenHash = this.hashToken(token);
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException(
        'El enlace de verificacion no es valido o ya expiro.',
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
    });

    return { message: 'Correo verificado correctamente.' };
  }

  async resendEmailVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.emailVerifiedAt) {
      return {
        message: 'Tu correo ya esta verificado.',
        emailVerificationSent: false,
      };
    }

    const emailVerificationSent = await this.createAndSendEmailVerification(
      user.id,
      user.email,
      user.name,
    );

    return {
      message: emailVerificationSent
        ? 'Te enviamos un nuevo correo de verificacion.'
        : 'La verificacion quedo pendiente porque Brevo no esta configurado o no respondio.',
      emailVerificationSent,
    };
  }

  async requestPasswordReset(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    const response = {
      message:
        'Si el correo existe, te enviaremos un enlace para restablecer tu contraseña.',
    };

    if (!user) {
      return response;
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetTokenExpiresAt: expiresAt,
      },
    });

    await this.sendBrevoPasswordResetEmail(user.email, user.name, token);

    return response;
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (!dto.token) {
      throw new BadRequestException('El token de recuperacion es obligatorio.');
    }

    const tokenHash = this.hashToken(dto.token);
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException(
        'El enlace de recuperacion no es valido o ya expiro.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetTokenExpiresAt: null,
      },
    });

    return {
      message: 'Contraseña actualizada. Ya puedes iniciar sesion.',
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      ...user,
      emailVerified: Boolean(user.emailVerifiedAt),
    };
  }

  private buildAuthResponse(
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      avatarUrl: string | null;
      role: Role;
      emailVerifiedAt?: Date | null;
      createdAt: Date;
    },
    emailVerificationSent?: boolean,
  ) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        emailVerified: Boolean(user.emailVerifiedAt),
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
      },
      emailVerificationSent,
    };
  }

  private async createAndSendEmailVerification(
    userId: string,
    email: string,
    name: string,
  ) {
    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationTokenExpiresAt: expiresAt,
      },
    });

    return this.sendBrevoVerificationEmail(email, name, token);
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async sendBrevoVerificationEmail(
    email: string,
    name: string,
    token: string,
  ) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME ?? 'Ruta Sin Gluten';
    const appUrl =
      process.env.PUBLIC_APP_URL ??
      process.env.FRONTEND_URL ??
      'https://rutasingluten.lat';

    if (!apiKey || !senderEmail) {
      this.logger.warn(
        'Brevo no esta configurado. Define BREVO_API_KEY y BREVO_SENDER_EMAIL.',
      );
      return false;
    }

    const verificationUrl = new URL('/verificar-email', appUrl);
    verificationUrl.searchParams.set('token', token);

    const safeName = this.escapeHtml(name);
    const htmlContent = [
      `<p>Hola ${safeName},</p>`,
      '<p>Confirma tu correo para completar tu cuenta en Ruta Sin Gluten.</p>',
      `<p><a href="${verificationUrl.toString()}">Verificar correo</a></p>`,
      '<p>Este enlace vence en 24 horas.</p>',
    ].join('');

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email,
              name,
            },
          ],
          subject: 'Verifica tu correo en Ruta Sin Gluten',
          htmlContent,
          textContent: `Hola ${name}, confirma tu correo en Ruta Sin Gluten: ${verificationUrl.toString()}`,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        this.logger.error(
          `Brevo rechazo el correo de verificacion: ${response.status} ${responseText}`,
        );
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(
        error instanceof Error
          ? `No se pudo enviar correo con Brevo: ${error.message}`
          : 'No se pudo enviar correo con Brevo.',
      );
      return false;
    }
  }

  private async sendBrevoPasswordResetEmail(
    email: string,
    name: string,
    token: string,
  ) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME ?? 'Ruta Sin Gluten';
    const appUrl =
      process.env.PUBLIC_APP_URL ??
      process.env.FRONTEND_URL ??
      'https://rutasingluten.lat';

    if (!apiKey || !senderEmail) {
      this.logger.warn(
        'Brevo no esta configurado. Define BREVO_API_KEY y BREVO_SENDER_EMAIL.',
      );
      return false;
    }

    const resetUrl = new URL('/restablecer-password', appUrl);
    resetUrl.searchParams.set('token', token);

    const safeName = this.escapeHtml(name);
    const htmlContent = [
      `<p>Hola ${safeName},</p>`,
      '<p>Recibimos una solicitud para restablecer tu contraseña en Ruta Sin Gluten.</p>',
      `<p><a href="${resetUrl.toString()}">Crear nueva contraseña</a></p>`,
      '<p>Este enlace vence en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.</p>',
    ].join('');

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email,
              name,
            },
          ],
          subject: 'Restablece tu contraseña en Ruta Sin Gluten',
          htmlContent,
          textContent: `Hola ${name}, crea una nueva contraseña en Ruta Sin Gluten: ${resetUrl.toString()}`,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        this.logger.error(
          `Brevo rechazo el correo de recuperacion: ${response.status} ${responseText}`,
        );
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(
        error instanceof Error
          ? `No se pudo enviar correo de recuperacion con Brevo: ${error.message}`
          : 'No se pudo enviar correo de recuperacion con Brevo.',
      );
      return false;
    }
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private ensureSellerRegistrationFields(dto: RegisterDto) {
    const missing: string[] = [];

    if (!dto.businessName) {
      missing.push('nombre del comercio');
    }

    if (!dto.department) {
      missing.push('departamento');
    }

    if (!dto.city) {
      missing.push('ciudad');
    }

    if (!dto.mainLocation) {
      missing.push('ubicacion principal en el mapa');
    }

    if (!dto.whatsapp && !dto.phone) {
      missing.push('whatsapp o celular');
    }

    if (missing.length) {
      throw new BadRequestException(
        `Faltan campos del comercio: ${missing.join(', ')}.`,
      );
    }
  }

  private async createInitialLocations(
    sellerProfileId: string,
    dto: RegisterDto,
  ) {
    if (dto.mainLocation) {
      const mainLocation = await this.prisma.sellerMainLocation.upsert({
        where: { sellerProfileId },
        update: {
          addressText: dto.mainLocation.addressText,
          reference: dto.mainLocation.reference,
          lat: dto.mainLocation.lat,
          lng: dto.mainLocation.lng,
        },
        create: {
          sellerProfileId,
          addressText: dto.mainLocation.addressText,
          reference: dto.mainLocation.reference,
          lat: dto.mainLocation.lat,
          lng: dto.mainLocation.lng,
        },
      });

      await this.prisma.$executeRawUnsafe(
        'UPDATE seller_main_location SET geom = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3::uuid',
        dto.mainLocation.lng,
        dto.mainLocation.lat,
        mainLocation.id,
      );
    }

    if (dto.deliveryPoints?.length) {
      for (const point of dto.deliveryPoints.slice(0, 6)) {
        const createdPoint = await this.prisma.sellerDeliveryPoint.create({
          data: {
            sellerProfileId,
            name: point.name,
            addressText: point.addressText,
            reference: point.reference,
            schedule: point.schedule,
            lat: point.lat,
            lng: point.lng,
          },
        });

        await this.prisma.$executeRawUnsafe(
          'UPDATE seller_delivery_points SET geom = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3::uuid',
          point.lng,
          point.lat,
          createdPoint.id,
        );
      }
    }
  }
}
