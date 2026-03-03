"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_delivery_point_dto_1 = require("./dto/create-delivery-point.dto");
const create_main_location_dto_1 = require("./dto/create-main-location.dto");
const create_seller_profile_dto_1 = require("./dto/create-seller-profile.dto");
const create_shipping_area_dto_1 = require("./dto/create-shipping-area.dto");
const update_seller_profile_dto_1 = require("./dto/update-seller-profile.dto");
const sellers_service_1 = require("./sellers.service");
let SellersController = class SellersController {
    sellersService;
    constructor(sellersService) {
        this.sellersService = sellersService;
    }
    me(user) {
        return this.sellersService.getOwnProfile(user.sub);
    }
    createProfile(user, dto) {
        return this.sellersService.createProfile(user.sub, dto);
    }
    updateProfile(user, dto) {
        return this.sellersService.updateProfile(user.sub, dto);
    }
    createMainLocation(user, dto) {
        return this.sellersService.createMainLocation(user.sub, dto);
    }
    createDeliveryPoint(user, dto) {
        return this.sellersService.createDeliveryPoint(user.sub, dto);
    }
    createShippingArea(user, dto) {
        return this.sellersService.createShippingArea(user.sub, dto);
    }
};
exports.SellersController = SellersController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_seller_profile_dto_1.CreateSellerProfileDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_seller_profile_dto_1.UpdateSellerProfileDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('main-location'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_main_location_dto_1.CreateMainLocationDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "createMainLocation", null);
__decorate([
    (0, common_1.Post)('delivery-points'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_delivery_point_dto_1.CreateDeliveryPointDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "createDeliveryPoint", null);
__decorate([
    (0, common_1.Post)('shipping-areas'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_shipping_area_dto_1.CreateShippingAreaDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "createShippingArea", null);
exports.SellersController = SellersController = __decorate([
    (0, swagger_1.ApiTags)('sellers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    (0, common_1.Controller)('sellers'),
    __metadata("design:paramtypes", [sellers_service_1.SellersService])
], SellersController);
//# sourceMappingURL=sellers.controller.js.map