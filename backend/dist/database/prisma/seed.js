"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function seedUser(email, data) {
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
        role: client_1.Role.ADMIN,
        phone: '+59170000001',
        passwordHash,
    });
    const sellerUser = await seedUser('seller@rutasingluten.local', {
        name: 'Seller Demo',
        role: client_1.Role.SELLER,
        phone: '+59170000002',
        passwordHash,
    });
    await seedUser('user@rutasingluten.local', {
        name: 'Usuario Demo',
        role: client_1.Role.USER,
        phone: '+59170000003',
        passwordHash,
    });
    const sellerProfile = await prisma.sellerProfile.upsert({
        where: { userId: sellerUser.id },
        update: {
            businessName: 'Panaderia Sin TACC Demo',
            ownerName: 'Seller Demo',
            businessType: client_1.BusinessType.PANADERIA,
            description: 'Productos artesanales libres de gluten para pruebas iniciales.',
            department: 'La Paz',
            city: 'La Paz',
            whatsapp: '+59170000002',
            hasPhysicalStore: true,
            hasShipping: true,
            status: client_1.SellerProfileStatus.APPROVED,
            isPublic: true,
        },
        create: {
            userId: sellerUser.id,
            businessName: 'Panaderia Sin TACC Demo',
            ownerName: 'Seller Demo',
            businessType: client_1.BusinessType.PANADERIA,
            description: 'Productos artesanales libres de gluten para pruebas iniciales.',
            department: 'La Paz',
            city: 'La Paz',
            whatsapp: '+59170000002',
            hasPhysicalStore: true,
            hasShipping: true,
            status: client_1.SellerProfileStatus.APPROVED,
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
        await prisma.$executeRaw `
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
    const product = existingProduct ??
        (await prisma.product.create({
            data: {
                sellerProfileId: sellerProfile.id,
                name: 'Pan de quinoa',
                category: 'Panificados',
                description: 'Pan libre de gluten de quinoa.',
                price: 18.5,
                stockQty: 25,
                stockUnit: 'unidades',
                glutenType: client_1.GlutenType.LIBRE_GLUTEN,
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
                status: client_1.VerificationStatus.APPROVED,
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
//# sourceMappingURL=seed.js.map