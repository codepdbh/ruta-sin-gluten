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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlacesNearbyDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class GetPlacesNearbyDto {
    lat;
    lng;
    radius;
    businessType;
    verified;
    modality;
    shippingAvailable;
}
exports.GetPlacesNearbyDto = GetPlacesNearbyDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetPlacesNearbyDto.prototype, "lat", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetPlacesNearbyDto.prototype, "lng", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetPlacesNearbyDto.prototype, "radius", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPlacesNearbyDto.prototype, "businessType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPlacesNearbyDto.prototype, "verified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPlacesNearbyDto.prototype, "modality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPlacesNearbyDto.prototype, "shippingAvailable", void 0);
//# sourceMappingURL=get-places-nearby.dto.js.map