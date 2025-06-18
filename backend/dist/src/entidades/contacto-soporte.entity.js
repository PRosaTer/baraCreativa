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
exports.ContactoSoporte = exports.EstadoCaso = exports.TipoConsulta = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
var TipoConsulta;
(function (TipoConsulta) {
    TipoConsulta["Tecnica"] = "t\u00E9cnica";
    TipoConsulta["Administrativa"] = "administrativa";
    TipoConsulta["Academica"] = "acad\u00E9mica";
})(TipoConsulta || (exports.TipoConsulta = TipoConsulta = {}));
var EstadoCaso;
(function (EstadoCaso) {
    EstadoCaso["Pendiente"] = "pendiente";
    EstadoCaso["EnRevision"] = "en revisi\u00F3n";
    EstadoCaso["Cerrado"] = "cerrado";
})(EstadoCaso || (exports.EstadoCaso = EstadoCaso = {}));
let ContactoSoporte = class ContactoSoporte {
    id;
    usuario;
    fechaMensaje;
    tipoConsulta;
    mensaje;
    estadoCaso;
};
exports.ContactoSoporte = ContactoSoporte;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContactoSoporte.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.contactosSoporte, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], ContactoSoporte.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContactoSoporte.prototype, "fechaMensaje", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoConsulta,
    }),
    __metadata("design:type", String)
], ContactoSoporte.prototype, "tipoConsulta", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ContactoSoporte.prototype, "mensaje", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoCaso,
        default: EstadoCaso.Pendiente,
    }),
    __metadata("design:type", String)
], ContactoSoporte.prototype, "estadoCaso", void 0);
exports.ContactoSoporte = ContactoSoporte = __decorate([
    (0, typeorm_1.Entity)('contacto_soporte')
], ContactoSoporte);
//# sourceMappingURL=contacto-soporte.entity.js.map