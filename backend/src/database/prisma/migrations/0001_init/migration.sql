CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE "Role" AS ENUM ('USER', 'SELLER', 'ADMIN');
CREATE TYPE "BusinessType" AS ENUM ('TIENDA', 'EMPRENDIMIENTO', 'PANADERIA', 'CAFETERIA', 'RESTAURANTE', 'OTRO');
CREATE TYPE "SellerProfileStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PENDING_VERIFICATION', 'OBSERVED', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "GlutenType" AS ENUM ('LIBRE_GLUTEN', 'OPCION_LIBRE_GLUTEN', 'CONSULTAR');
CREATE TYPE "FoodSafetyModality" AS ENUM ('CIEN_PORCIENTO_LIBRE_GLUTEN', 'CON_OPCIONES');
CREATE TYPE "RiskLevel" AS ENUM ('BAJO', 'MEDIO', 'ALTO', 'NO_INFORMADO');
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'OBSERVED');
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CONVERTED');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role "Role" NOT NULL DEFAULT 'USER',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  business_type "BusinessType" NOT NULL,
  description TEXT,
  department TEXT NOT NULL,
  city TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  has_physical_store BOOLEAN NOT NULL DEFAULT FALSE,
  has_shipping BOOLEAN NOT NULL DEFAULT FALSE,
  status "SellerProfileStatus" NOT NULL DEFAULT 'DRAFT',
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE seller_main_location (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_profile_id UUID NOT NULL UNIQUE REFERENCES seller_profiles(id) ON DELETE CASCADE,
  address_text TEXT NOT NULL,
  reference TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  geom geometry(Point, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE seller_delivery_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_profile_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address_text TEXT NOT NULL,
  reference TEXT,
  schedule TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  geom geometry(Point, 4326),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE seller_shipping_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_profile_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  city TEXT,
  delivery_type TEXT NOT NULL,
  cost DOUBLE PRECISION,
  eta_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_profile_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DOUBLE PRECISION NOT NULL,
  stock_qty DOUBLE PRECISION NOT NULL,
  stock_unit TEXT NOT NULL,
  gluten_type "GlutenType" NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE food_safety_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_profile_id UUID NOT NULL UNIQUE REFERENCES seller_profiles(id) ON DELETE CASCADE,
  modality "FoodSafetyModality" NOT NULL,
  cross_contamination_risk "RiskLevel" NOT NULL DEFAULT 'NO_INFORMADO',
  separate_utensils BOOLEAN NOT NULL DEFAULT FALSE,
  separate_area BOOLEAN NOT NULL DEFAULT FALSE,
  trained_staff BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT
);

CREATE TABLE verification_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_profile_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  status "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE place_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  place_name TEXT NOT NULL,
  type_guess TEXT NOT NULL,
  address_text TEXT NOT NULL,
  reference TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  comment TEXT,
  status "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX seller_profiles_status_is_public_idx ON seller_profiles(status, is_public);
CREATE INDEX seller_delivery_points_seller_profile_id_is_active_idx ON seller_delivery_points(seller_profile_id, is_active);
CREATE INDEX seller_shipping_areas_seller_profile_id_idx ON seller_shipping_areas(seller_profile_id);
CREATE INDEX products_seller_profile_id_is_active_idx ON products(seller_profile_id, is_active);
CREATE INDEX product_photos_product_id_idx ON product_photos(product_id);
CREATE INDEX verification_submissions_status_submitted_at_idx ON verification_submissions(status, submitted_at);
CREATE INDEX place_suggestions_status_created_at_idx ON place_suggestions(status, created_at);
CREATE INDEX seller_main_location_geom_idx ON seller_main_location USING GIST (geom);
CREATE INDEX seller_delivery_points_geom_idx ON seller_delivery_points USING GIST (geom);
