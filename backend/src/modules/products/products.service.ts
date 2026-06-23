import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, SellerProfileStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProducts(query: {
    sellerId?: string;
    q?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 12));

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(query.sellerId ? { sellerProfileId: query.sellerId } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      sellerProfile: {
        status: SellerProfileStatus.APPROVED,
        isPublic: true,
      },
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: {
          photos: { orderBy: { sortOrder: 'asc' } },
          sellerProfile: {
            select: {
              id: true,
              businessName: true,
              logoUrl: true,
              businessType: true,
              whatsapp: true,
              country: true,
              city: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        isActive: true,
        sellerProfile: {
          status: SellerProfileStatus.APPROVED,
          isPublic: true,
        },
      },
      include: {
        photos: { orderBy: { sortOrder: 'asc' } },
        sellerProfile: {
          include: {
            mainLocation: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    return product;
  }

  async listOwnProducts(
    userId: string,
    query: {
      page?: number;
      pageSize?: number;
    },
  ) {
    const profile = await this.ensureSellerProfile(userId);
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(80, Math.max(1, query.pageSize ?? 24));
    const where: Prisma.ProductWhereInput = {
      sellerProfileId: profile.id,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: {
          photos: { orderBy: { sortOrder: 'asc' } },
          sellerProfile: {
            select: {
              id: true,
              businessName: true,
              logoUrl: true,
              businessType: true,
              whatsapp: true,
              country: true,
              city: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async createProduct(userId: string, dto: CreateProductDto) {
    const profile = await this.ensureSellerProfile(userId);

    const product = await this.prisma.product.create({
      data: {
        sellerProfileId: profile.id,
        name: dto.name,
        category: dto.category,
        description: dto.description,
        price: dto.price,
        stockQty: dto.stockQty,
        stockUnit: dto.stockUnit,
        glutenType: dto.glutenType,
        isActive: dto.isActive ?? true,
      },
    });

    if (dto.photoUrls?.length) {
      await this.prisma.productPhoto.createMany({
        data: dto.photoUrls.map((fileUrl, index) => ({
          productId: product.id,
          fileUrl,
          sortOrder: index,
        })),
      });
    }

    return this.prisma.product.findUnique({
      where: { id: product.id },
      include: { photos: true },
    });
  }

  async updateProduct(
    userId: string,
    productId: string,
    dto: UpdateProductDto,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { sellerProfile: true },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    if (product.sellerProfile.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description,
        price: dto.price,
        stockQty: dto.stockQty,
        stockUnit: dto.stockUnit,
        glutenType: dto.glutenType,
        isActive: dto.isActive,
      },
    });

    if (dto.photoUrls) {
      await this.prisma.productPhoto.deleteMany({ where: { productId } });
      if (dto.photoUrls.length) {
        await this.prisma.productPhoto.createMany({
          data: dto.photoUrls.map((fileUrl, index) => ({
            productId,
            fileUrl,
            sortOrder: index,
          })),
        });
      }
    }

    return this.prisma.product.findUnique({
      where: { id: productId },
      include: { photos: true },
    });
  }

  async deleteProduct(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { sellerProfile: true },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    if (product.sellerProfile.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.product.delete({ where: { id: productId } });

    return { success: true };
  }

  private async ensureSellerProfile(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil de seller no encontrado.');
    }

    return profile;
  }
}
