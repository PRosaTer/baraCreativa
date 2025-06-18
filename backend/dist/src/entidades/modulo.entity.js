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
exports.Modulo = void 0;
const typeorm_1 = require("typeorm");
const curso_entity_1 = require("./curso.entity");
let Modulo = class Modulo {
    id;
    titulo;
    descripcion;
    orden;
    videoUrl;
    curso;
};
exports.Modulo = Modulo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Modulo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Modulo.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Modulo.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Modulo.prototype, "orden", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Modulo.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, (curso) => curso.modulos, { onDelete: 'CASCADE' }),
    __metadata("design:type", curso_entity_1.Curso)
], Modulo.prototype, "curso", void 0);
exports.Modulo = Modulo = __decorate([
    (0, typeorm_1.Entity)('modulos')
], Modulo);
//# sourceMappingURL=modulo.entity.js.map