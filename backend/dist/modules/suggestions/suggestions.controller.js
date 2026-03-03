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
exports.SuggestionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const suggestions_service_1 = require("./suggestions.service");
const create_suggestion_dto_1 = require("./dto/create-suggestion.dto");
let SuggestionsController = class SuggestionsController {
    suggestionsService;
    constructor(suggestionsService) {
        this.suggestionsService = suggestionsService;
    }
    createSuggestion(dto) {
        return this.suggestionsService.createSuggestion(dto);
    }
};
exports.SuggestionsController = SuggestionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_suggestion_dto_1.CreateSuggestionDto]),
    __metadata("design:returntype", void 0)
], SuggestionsController.prototype, "createSuggestion", null);
exports.SuggestionsController = SuggestionsController = __decorate([
    (0, swagger_1.ApiTags)('suggestions'),
    (0, common_1.Controller)('suggestions'),
    __metadata("design:paramtypes", [suggestions_service_1.SuggestionsService])
], SuggestionsController);
//# sourceMappingURL=suggestions.controller.js.map