import {
  BusinessType,
  GlutenType,
  PrismaClient,
  Role,
  SellerProfileStatus,
  VerificationStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUser(email: string, data: { name: string; role: Role; phone: string; passwordHash: string }) {
  return prisma.user.upsert({
    where: { email },
    update: {
      name: data.name,
      role: data.role,
      phone: data.phone,
    },
    create: {
      email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      passwordHash: data.passwordHash,
    },
  });
}

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await seedUser('admin@rutasingluten.local', {
    name: 'Admin RutaSinGluten',
    role: Role.ADMIN,
    phone: '+59170000001',
    passwordHash,
  });

  const sellerUser = await seedUser('seller@rutasingluten.local', {
    name: 'Seller Demo',
    role: Role.SELLER,
    phone: '+59170000002',
    passwordHash,
  });

  await seedUser('user@rutasingluten.local', {
    name: 'Usuario Demo',
    role: Role.USER,
    phone: '+59170000003',
    passwordHash,
  });

  const sellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: sellerUser.id },
    update: {
      businessName: 'Panaderia Sin TACC Demo',
      ownerName: 'Seller Demo',
      businessType: BusinessType.PANADERIA,
      description: 'Productos artesanales libres de gluten para pruebas iniciales.',
      department: 'La Paz',
      city: 'La Paz',
      whatsapp: '+59170000002',
      hasPhysicalStore: true,
      hasShipping: true,
      status: SellerProfileStatus.APPROVED,
      isPublic: true,
    },
    create: {
      userId: sellerUser.id,
      businessName: 'Panaderia Sin TACC Demo',
      ownerName: 'Seller Demo',
      businessType: BusinessType.PANADERIA,
      description: 'Productos artesanales libres de gluten para pruebas iniciales.',
      department: 'La Paz',
      city: 'La Paz',
      whatsapp: '+59170000002',
      hasPhysicalStore: true,
      hasShipping: true,
      status: SellerProfileStatus.APPROVED,
      isPublic: true,
    },
  });

  const mainLocation = await prisma.sellerMainLocation.upsert({
    where: { sellerProfileId: sellerProfile.id },
    update: {
      addressText: 'Av. 16 de Julio 1234',
      reference: 'Frente a la plaza principal',
      lat: -16.500113,
      lng: -68.131226,
    },
    create: {
      sellerProfileId: sellerProfile.id,
      addressText: 'Av. 16 de Julio 1234',
      reference: 'Frente a la plaza principal',
      lat: -16.500113,
      lng: -68.131226,
    },
  });

  if (mainLocation.lat !== null && mainLocation.lng !== null) {
    await prisma.$executeRaw`
      UPDATE seller_main_location
      SET geom = ST_SetSRID(ST_MakePoint(${mainLocation.lng}, ${mainLocation.lat}), 4326)
      WHERE id = ${mainLocation.id}::uuid
    `;
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      sellerProfileId: sellerProfile.id,
      name: 'Pan de quinoa',
    },
  });

  const product =
    existingProduct ??
    (await prisma.product.create({
      data: {
        sellerProfileId: sellerProfile.id,
        name: 'Pan de quinoa',
        category: 'Panificados',
        description: 'Pan libre de gluten de quinoa.',
        price: 18.5,
        stockQty: 25,
        stockUnit: 'unidades',
        glutenType: GlutenType.LIBRE_GLUTEN,
        isActive: true,
      },
    }));

  const existingPhoto = await prisma.productPhoto.findFirst({
    where: {
      productId: product.id,
      fileUrl: '/uploads/demo-product.jpg',
    },
  });

  if (!existingPhoto) {
    await prisma.productPhoto.create({
      data: {
        productId: product.id,
        fileUrl: '/uploads/demo-product.jpg',
        sortOrder: 0,
      },
    });
  }

  const existingVerification = await prisma.verificationSubmission.findFirst({
    where: { sellerProfileId: sellerProfile.id },
  });

  if (!existingVerification) {
    await prisma.verificationSubmission.create({
      data: {
        sellerProfileId: sellerProfile.id,
        videoUrl: '/uploads/demo-verification.mp4',
        status: VerificationStatus.APPROVED,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        adminNotes: 'Comercio aprobado en seed.',
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
