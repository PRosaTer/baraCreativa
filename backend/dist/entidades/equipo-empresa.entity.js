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
exports.EquipoEmpresaMiembro = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const curso_entity_1 = require("./curso.entity");
const reporte_progreso_entity_1 = require("./reporte-progreso.entity");
let EquipoEmpresaMiembro = class EquipoEmpresaMiembro {
    id;
    usuario;
    nombreEmpresa;
    rolEnEmpresa;
    curso;
    reportesProgreso;
};
exports.EquipoEmpresaMiembro = EquipoEmpresaMiembro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EquipoEmpresaMiembro.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.equipos, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], EquipoEmpresaMiembro.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EquipoEmpresaMiembro.prototype, "nombreEmpresa", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EquipoEmpresaMiembro.prototype, "rolEnEmpresa", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, (curso) => curso.equiposAsignados, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", curso_entity_1.Curso)
], EquipoEmpresaMiembro.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reporte_progreso_entity_1.ReporteProgreso, (reporte) => reporte.equipo),
    __metadata("design:type", Array)
], EquipoEmpresaMiembro.prototype, "reportesProgreso", void 0);
exports.EquipoEmpresaMiembro = EquipoEmpresaMiembro = __decorate([
    (0, typeorm_1.Entity)('equipo_empresa')
], EquipoEmpresaMiembro);
//# sourceMappingURL=equipo-empresa.entity.js.map