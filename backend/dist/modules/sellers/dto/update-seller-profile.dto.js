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
exports.UpdateSellerProfileDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const trimString = ({ value }) => typeof value === 'string' ? value.trim() : value;
class UpdateSellerProfileDto {
    businessName;
    ownerName;
    businessType;
    description;
    country;
    department;
    city;
    whatsapp;
    hasPhysicalStore;
    hasShipping;
    modality;
    crossContaminationRisk;
    separateUtensils;
    separateArea;
    trainedStaff;
    safetyNotes;
}
exports.UpdateSellerProfileDto = UpdateSellerProfileDto;
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "businessName", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "ownerName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.BusinessType),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "businessType", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(600),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "country", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "department", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "city", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "whatsapp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSellerProfileDto.prototype, "hasPhysicalStore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSellerProfileDto.prototype, "hasShipping", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FoodSafetyModality),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "modality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RiskLevel),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "crossContaminationRisk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSellerProfileDto.prototype, "separateUtensils", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSellerProfileDto.prototype, "separateArea", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSellerProfileDto.prototype, "trainedStaff", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(600),
    __metadata("design:type", String)
], UpdateSellerProfileDto.prototype, "safetyNotes", void 0);
//# sourceMappingURL=update-seller-profile.dto.js.map