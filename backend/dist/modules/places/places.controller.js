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
exports.PlacesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const get_places_in_bounds_dto_1 = require("./dto/get-places-in-bounds.dto");
const get_places_nearby_dto_1 = require("./dto/get-places-nearby.dto");
const rate_place_dto_1 = require("./dto/rate-place.dto");
const places_service_1 = require("./places.service");
let PlacesController = class PlacesController {
    placesService;
    constructor(placesService) {
        this.placesService = placesService;
    }
    getPlacesInBounds(query) {
        return this.placesService.getPlacesInBounds(query);
    }
    getPlacesNearby(query) {
        return this.placesService.getPlacesNearby(query);
    }
    getMyPlaceRating(id, user) {
        return this.placesService.getMyPlaceRating(id, user.sub);
    }
    ratePlace(id, user, dto) {
        return this.placesService.ratePlace(id, user.sub, dto);
    }
    getPlaceById(id) {
        return this.placesService.getPlaceById(id);
    }
};
exports.PlacesController = PlacesController;
__decorate([
    (0, common_1.Get)('in-bounds'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_places_in_bounds_dto_1.GetPlacesInBoundsDto]),
    __metadata("design:returntype", void 0)
], PlacesController.prototype, "getPlacesInBounds", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_places_nearby_dto_1.GetPlacesNearbyDto]),
    __metadata("design:returntype", void 0)
], PlacesController.prototype, "getPlacesNearby", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/rating/me'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PlacesController.prototype, "getMyPlaceRating", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/rating'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, rate_place_dto_1.RatePlaceDto]),
    __metadata("design:returntype", void 0)
], PlacesController.prototype, "ratePlace", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlacesController.prototype, "getPlaceById", null);
exports.PlacesController = PlacesController = __decorate([
    (0, swagger_1.ApiTags)('places'),
    (0, common_1.Controller)('places'),
    __metadata("design:paramtypes", [places_service_1.PlacesService])
], PlacesController);
//# sourceMappingURL=places.controller.js.map