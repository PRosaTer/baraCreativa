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
exports.CreateUsuarioDto = void 0;
const class_validator_1 = require("class-validator");
const usuario_entity_1 = require("../../entidades/usuario.entity");
class CreateUsuarioDto {
    nombreCompleto;
    correoElectronico;
    password;
    telefono;
    tipoUsuario;
    nombreEmpresa;
    fotoPerfil;
    estadoCuenta;
}
exports.CreateUsuarioDto = CreateUsuarioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre completo es obligatorio' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nombreCompleto", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico debe ser válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo electrónico es obligatorio' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "correoElectronico", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(usuario_entity_1.TipoUsuario, { message: 'Tipo de usuario inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de usuario es obligatorio' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "tipoUsuario", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nombreEmpresa", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "fotoPerfil", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(usuario_entity_1.EstadoCuenta, { message: 'Estado de cuenta inválido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "estadoCuenta", void 0);
//# sourceMappingURL=create-usuario.dto.js.map