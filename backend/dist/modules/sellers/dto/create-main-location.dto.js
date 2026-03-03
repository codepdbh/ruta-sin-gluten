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
exports.CreateMainLocationDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const trimString = ({ value }) => (typeof value === 'string' ? value.trim() : value);
class CreateMainLocationDto {
    addressText;
    reference;
    lat;
    lng;
}
exports.CreateMainLocationDto = CreateMainLocationDto;
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMainLocationDto.prototype, "addressText", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trimString),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMainLocationDto.prototype, "reference", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(({ lat }) => lat !== undefined && lat !== null),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateMainLocationDto.prototype, "lat", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(({ lng }) => lng !== undefined && lng !== null),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateMainLocationDto.prototype, "lng", void 0);
//# sourceMappingURL=create-main-location.dto.js.map