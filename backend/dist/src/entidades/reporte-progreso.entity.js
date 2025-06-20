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
exports.ReporteProgreso = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const curso_entity_1 = require("./curso.entity");
const equipo_empresa_entity_1 = require("./equipo-empresa.entity");
let ReporteProgreso = class ReporteProgreso {
    id;
    usuario;
    equipo;
    curso;
    porcentajeAvance;
    fechaUltimoAcceso;
    tiempoInvertidoMinutos;
};
exports.ReporteProgreso = ReporteProgreso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReporteProgreso.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, { nullable: true, onDelete: 'CASCADE' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], ReporteProgreso.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => equipo_empresa_entity_1.EquipoEmpresaMiembro, { nullable: true, onDelete: 'CASCADE' }),
    __metadata("design:type", equipo_empresa_entity_1.EquipoEmpresaMiembro)
], ReporteProgreso.prototype, "equipo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, (curso) => curso.reportesProgreso, { onDelete: 'CASCADE' }),
    __metadata("design:type", curso_entity_1.Curso)
], ReporteProgreso.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], ReporteProgreso.prototype, "porcentajeAvance", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReporteProgreso.prototype, "fechaUltimoAcceso", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], ReporteProgreso.prototype, "tiempoInvertidoMinutos", void 0);
exports.ReporteProgreso = ReporteProgreso = __decorate([
    (0, typeorm_1.Entity)('reporte_progreso')
], ReporteProgreso);
//# sourceMappingURL=reporte-progreso.entity.js.map