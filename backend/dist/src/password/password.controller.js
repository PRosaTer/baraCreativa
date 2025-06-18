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
exports.PasswordController = void 0;
const common_1 = require("@nestjs/common");
const password_service_1 = require("./password.service");
const solicitar_reset_dto_1 = require("./dto/solicitar-reset.dto");
const confirmar_reset_dto_1 = require("./dto/confirmar-reset.dto");
let PasswordController = class PasswordController {
    passwordService;
    constructor(passwordService) {
        this.passwordService = passwordService;
    }
    solicitar(dto) {
        return this.passwordService.solicitarReset(dto);
    }
    confirmar(dto) {
        return this.passwordService.confirmarReset(dto);
    }
};
exports.PasswordController = PasswordController;
__decorate([
    (0, common_1.Post)('solicitar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [solicitar_reset_dto_1.SolicitarResetDto]),
    __metadata("design:returntype", void 0)
], PasswordController.prototype, "solicitar", null);
__decorate([
    (0, common_1.Post)('confirmar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirmar_reset_dto_1.ConfirmarResetDto]),
    __metadata("design:returntype", void 0)
], PasswordController.prototype, "confirmar", null);
exports.PasswordController = PasswordController = __decorate([
    (0, common_1.Controller)('password'),
    __metadata("design:paramtypes", [password_service_1.PasswordService])
], PasswordController);
//# sourceMappingURL=password.controller.js.map