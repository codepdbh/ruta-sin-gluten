export type PlaceSummary = {
  id: string;
  businessName: string;
  ownerName: string;
  logoUrl?: string | null;
  businessType: string;
  description?: string | null;
  country: string;
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
  ratingAverage: number;
  ratingCount: number;
  location: {
    kind: "MAIN" | "DELIVERY";
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
  sellerProfile?: {
    id: string;
    businessName: string;
    businessType?: string;
    whatsapp?: string | null;
    logoUrl?: string | null;
    country?: string | null;
    city?: string | null;
    mainLocation?: {
      addressText: string;
      reference?: string | null;
    } | null;
  };
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

export type PlaceRating = {
  score: number;
  comment?: string | null;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role: string;
    emailVerified: boolean;
    emailVerifiedAt?: string | null;
    createdAt: string;
  };
  emailVerificationSent?: boolean;
};

export type SellerProfile = {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  logoUrl?: string | null;
  businessType: string;
  description?: string | null;
  country: string;
  department: string;
  city: string;
  whatsapp: string;
  hasPhysicalStore: boolean;
  hasShipping: boolean;
  status: string;
  isPublic: boolean;
  mainLocation?: {
    id: string;
    addressText: string;
    reference?: string | null;
    lat?: number | null;
    lng?: number | null;
    createdAt: string;
  } | null;
  deliveryPoints: Array<{
    id: string;
    name: string;
    addressText: string;
    reference?: string | null;
    schedule?: string | null;
    lat?: number | null;
    lng?: number | null;
    isActive: boolean;
    createdAt: string;
  }>;
  shippingAreas: Array<{
    id: string;
    department: string;
    city?: string | null;
    deliveryType: string;
    cost?: number | null;
    etaText?: string | null;
    createdAt?: string;
  }>;
  products: Product[];
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

export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  avatarUrl?: string | null;
  emailVerifiedAt?: string | null;
  emailVerified: boolean;
  createdAt: string;
  sellerProfile?: {
    id: string;
    businessName: string;
    status: string;
    isPublic: boolean;
  } | null;
};

export type AdminBusinessItem = {
  id: string;
  businessName: string;
  ownerName: string;
  businessType: string;
  country: string;
  department: string;
  city: string;
  whatsapp: string;
  hasPhysicalStore: boolean;
  hasShipping: boolean;
  status: string;
  isPublic: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    emailVerifiedAt?: string | null;
    emailVerified: boolean;
  };
  mainLocation?: {
    addressText: string;
    reference?: string | null;
    lat?: number | null;
    lng?: number | null;
  } | null;
  counts: {
    products: number;
    deliveryPoints: number;
    verificationSubmissions: number;
  };
  verification?: {
    id: string;
    status: string;
    videoUrl: string;
    submittedAt: string;
    reviewedAt?: string | null;
  } | null;
};
