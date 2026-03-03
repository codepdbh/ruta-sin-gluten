import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { LocationsModule } from './modules/locations/locations.module';
import { MediaModule } from './modules/media/media.module';
import { PlacesModule } from './modules/places/places.module';
import { ProductsModule } from './modules/products/products.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { UsersModule } from './modules/users/users.module';
import { VerificationModule } from './modules/verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    SellersModule,
    LocationsModule,
    ShippingModule,
    ProductsModule,
    MediaModule,
    VerificationModule,
    PlacesModule,
    SuggestionsModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
