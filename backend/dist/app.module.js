"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const admin_module_1 = require("./modules/admin/admin.module");
const auth_module_1 = require("./modules/auth/auth.module");
const health_module_1 = require("./modules/health/health.module");
const locations_module_1 = require("./modules/locations/locations.module");
const media_module_1 = require("./modules/media/media.module");
const places_module_1 = require("./modules/places/places.module");
const products_module_1 = require("./modules/products/products.module");
const sellers_module_1 = require("./modules/sellers/sellers.module");
const shipping_module_1 = require("./modules/shipping/shipping.module");
const suggestions_module_1 = require("./modules/suggestions/suggestions.module");
const users_module_1 = require("./modules/users/users.module");
const verification_module_1 = require("./modules/verification/verification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            sellers_module_1.SellersModule,
            locations_module_1.LocationsModule,
            shipping_module_1.ShippingModule,
            products_module_1.ProductsModule,
            media_module_1.MediaModule,
            verification_module_1.VerificationModule,
            places_module_1.PlacesModule,
            suggestions_module_1.SuggestionsModule,
            admin_module_1.AdminModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map