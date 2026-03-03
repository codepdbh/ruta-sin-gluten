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
exports.CreateDeliveryPointDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const trimString = ({ value }) => (typeof value === 'string' ? value.trim() : value);
class CreateDeliveryPointDto {
    name;
    addressText;
    reference;
    schedule;
    lat;
    lng;
}
exports.CreateDeliveryPointDto = CreateDeliveryPointDto;
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryPointDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryPointDto.prototype, "addressText", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryPointDto.prototype, "reference", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryPointDto.prototype, "schedule", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateDeliveryPointDto.prototype, "lat", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateDeliveryPointDto.prototype, "lng", void 0);
//# sourceMappingURL=create-delivery-point.dto.js.map