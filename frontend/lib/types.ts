export type PlaceSummary = {
  id: string;
  businessName: string;
  ownerName: string;
  businessType: string;
  description?: string | null;
  department: string;
  city: string;
  whatsapp: string;
  hasShipping: boolean;
  hasPhysicalStore: boolean;
  status: string;
  isPublic: boolean;
  modality?: string | null;
  crossContaminationRisk?: string | null;
  verificationStatus: string;
  location: {
    kind: 'MAIN' | 'DELIVERY';
    lat: number;
    lng: number;
    addressText: string;
    reference?: string | null;
    schedule?: string | null;
  } | null;
  productsPreview: Product[];
  shippingAreasCount: number;
  distanceMeters?: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  price: number;
  stockQty: number;
  stockUnit: string;
  glutenType: string;
  isActive: boolean;
  photos?: Array<{
    id: string;
    fileUrl: string;
    sortOrder: number;
  }>;
};

export type PlaceDetail = PlaceSummary & {
  owner?: {
    id: string;
    name: string;
  };
  products: Product[];
  deliveryPoints: Array<{
    id: string;
    name: string;
    addressText: string;
    reference?: string | null;
    schedule?: string | null;
    lat?: number | null;
    lng?: number | null;
  }>;
  shippingAreas: Array<{
    id: string;
    department: string;
    city?: string | null;
    deliveryType: string;
    cost?: number | null;
    etaText?: string | null;
  }>;
};

export type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: string;
    createdAt: string;
  };
};

export type VerificationItem = {
  id: string;
  videoUrl: string;
  status: string;
  adminNotes?: string | null;
  submittedAt: string;
  sellerProfile: {
    id: string;
    businessName: string;
    ownerName: string;
    businessType: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

export type SuggestionItem = {
  id: string;
  placeName: string;
  typeGuess: string;
  addressText: string;
  reference?: string | null;
  lat?: number | null;
  lng?: number | null;
  comment?: string | null;
  status: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
};
