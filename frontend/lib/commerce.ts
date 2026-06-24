import { buildAssetUrl } from './api/client';
import type { Product } from './types';

function normalizePhone(value?: string | null) {
  return value?.replace(/\D/g, '') ?? '';
}

export function getProductImageUrl(product: Product) {
  const fileUrl = product.photos?.[0]?.fileUrl;
  return fileUrl ? buildAssetUrl(fileUrl) : null;
}

export function getPurchaseLink(product: Product) {
  const phone = normalizePhone(product.sellerProfile?.whatsapp);

  if (phone) {
    const businessName = product.sellerProfile?.businessName ?? 'tu negocio';
    const message = encodeURIComponent(`Hola, quiero comprar "${product.name}" de ${businessName}.`);
    return `https://wa.me/${phone}?text=${message}`;
  }

  if (product.sellerProfile?.id) {
    return `/places/${product.sellerProfile.id}`;
  }

  return '/places';
}
