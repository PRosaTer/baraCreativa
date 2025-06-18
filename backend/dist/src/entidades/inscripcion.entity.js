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
exports.Inscripcion = exports.EstadoCurso = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const curso_entity_1 = require("./curso.entity");
var EstadoCurso;
(function (EstadoCurso) {
    EstadoCurso["EnProgreso"] = "en progreso";
    EstadoCurso["Completado"] = "completado";
    EstadoCurso["Abandonado"] = "abandonado";
})(EstadoCurso || (exports.EstadoCurso = EstadoCurso = {}));
let Inscripcion = class Inscripcion {
    id;
    usuario;
    curso;
    fechaInscripcion;
    estadoCurso;
    progreso;
    fechaFinalizacion;
};
exports.Inscripcion = Inscripcion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Inscripcion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.inscripciones, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Inscripcion.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, (curso) => curso.inscripciones, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", curso_entity_1.Curso)
], Inscripcion.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Inscripcion.prototype, "fechaInscripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoCurso,
        default: EstadoCurso.EnProgreso,
    }),
    __metadata("design:type", String)
], Inscripcion.prototype, "estadoCurso", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Inscripcion.prototype, "progreso", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Inscripcion.prototype, "fechaFinalizacion", void 0);
exports.Inscripcion = Inscripcion = __decorate([
    (0, typeorm_1.Entity)('inscripciones')
], Inscripcion);
//# sourceMappingURL=inscripcion.entity.js.map