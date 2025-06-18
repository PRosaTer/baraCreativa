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
exports.Certificado = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const curso_entity_1 = require("./curso.entity");
let Certificado = class Certificado {
    id;
    usuario;
    curso;
    codigoUnico;
    fechaEmision;
    urlDescarga;
    verificado;
};
exports.Certificado = Certificado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Certificado.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.certificados, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Certificado.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, (curso) => curso.certificados, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", curso_entity_1.Curso)
], Certificado.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Certificado.prototype, "codigoUnico", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Certificado.prototype, "fechaEmision", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Certificado.prototype, "urlDescarga", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Certificado.prototype, "verificado", void 0);
exports.Certificado = Certificado = __decorate([
    (0, typeorm_1.Entity)('certificados')
], Certificado);
//# sourceMappingURL=certificado.entity.js.map