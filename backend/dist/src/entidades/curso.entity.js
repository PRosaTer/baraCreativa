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
exports.Curso = exports.ModalidadCurso = exports.TipoCurso = void 0;
const typeorm_1 = require("typeorm");
const modulo_entity_1 = require("./modulo.entity");
const inscripcion_entity_1 = require("./inscripcion.entity");
const badge_entity_1 = require("./badge.entity");
const certificado_entity_1 = require("./certificado.entity");
const pago_entity_1 = require("./pago.entity");
const resena_entity_1 = require("./resena.entity");
const equipo_empresa_entity_1 = require("./equipo-empresa.entity");
const reporte_progreso_entity_1 = require("./reporte-progreso.entity");
var TipoCurso;
(function (TipoCurso) {
    TipoCurso["Docentes"] = "Docentes";
    TipoCurso["Empresas"] = "Empresas";
})(TipoCurso || (exports.TipoCurso = TipoCurso = {}));
var ModalidadCurso;
(function (ModalidadCurso) {
    ModalidadCurso["EnVivo"] = "en vivo";
    ModalidadCurso["Grabado"] = "grabado";
    ModalidadCurso["Mixto"] = "mixto";
})(ModalidadCurso || (exports.ModalidadCurso = ModalidadCurso = {}));
let Curso = class Curso {
    id;
    titulo;
    descripcion;
    tipo;
    categoria;
    duracionHoras;
    precio;
    modalidad;
    fechaLanzamiento;
    imagenCurso;
    certificadoDisponible;
    badgeDisponible;
    modulos;
    inscripciones;
    badges;
    certificados;
    pagos;
    resenas;
    equiposAsignados;
    reportesProgreso;
};
exports.Curso = Curso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Curso.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Curso.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Curso.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoCurso,
    }),
    __metadata("design:type", String)
], Curso.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Curso.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Curso.prototype, "duracionHoras", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Curso.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ModalidadCurso,
    }),
    __metadata("design:type", String)
], Curso.prototype, "modalidad", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Curso.prototype, "fechaLanzamiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Curso.prototype, "imagenCurso", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Curso.prototype, "certificadoDisponible", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Curso.prototype, "badgeDisponible", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => modulo_entity_1.Modulo, (modulo) => modulo.curso),
    __metadata("design:type", Array)
], Curso.prototype, "modulos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inscripcion_entity_1.Inscripcion, (inscripcion) => inscripcion.curso),
    __metadata("design:type", Array)
], Curso.prototype, "inscripciones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => badge_entity_1.Badge, (badge) => badge.curso),
    __metadata("design:type", Array)
], Curso.prototype, "badges", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => certificado_entity_1.Certificado, (certificado) => certificado.curso),
    __metadata("design:type", Array)
], Curso.prototype, "certificados", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pago_entity_1.Pago, (pago) => pago.curso),
    __metadata("design:type", Array)
], Curso.prototype, "pagos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => resena_entity_1.Resena, (resena) => resena.curso),
    __metadata("design:type", Array)
], Curso.prototype, "resenas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => equipo_empresa_entity_1.EquipoEmpresaMiembro, (miembro) => miembro.curso),
    __metadata("design:type", Array)
], Curso.prototype, "equiposAsignados", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reporte_progreso_entity_1.ReporteProgreso, (reporte) => reporte.curso),
    __metadata("design:type", Array)
], Curso.prototype, "reportesProgreso", void 0);
exports.Curso = Curso = __decorate([
    (0, typeorm_1.Entity)('cursos')
], Curso);
//# sourceMappingURL=curso.entity.js.map