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
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const carrito_entity_1 = require("./carrito.entity");
const certificado_entity_1 = require("./certificado.entity");
const contacto_soporte_entity_1 = require("./contacto-soporte.entity");
const equipo_empresa_entity_1 = require("./equipo-empresa.entity");
const inscripcion_entity_1 = require("./inscripcion.entity");
const pago_entity_1 = require("./pago.entity");
const resena_entity_1 = require("./resena.entity");
let Usuario = class Usuario {
    id;
    nombreCompleto;
    correoElectronico;
    password;
    fotoPerfil;
    esAdmin;
    creadoEn;
    actualizadoEn;
    tokenRecuperacion;
    expiracionTokenRecuperacion;
    carritos;
    certificados;
    contactosSoporte;
    equipos;
    inscripciones;
    pagos;
    resenas;
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "nombreCompleto", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, name: 'correoelectronico' }),
    __metadata("design:type", String)
], Usuario.prototype, "correoElectronico", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "fotoPerfil", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "esAdmin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Usuario.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Usuario.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "tokenRecuperacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "expiracionTokenRecuperacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => carrito_entity_1.Carrito, (carrito) => carrito.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "carritos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => certificado_entity_1.Certificado, (certificado) => certificado.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "certificados", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contacto_soporte_entity_1.ContactoSoporte, (contacto) => contacto.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "contactosSoporte", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => equipo_empresa_entity_1.EquipoEmpresaMiembro, (equipo) => equipo.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "equipos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inscripcion_entity_1.Inscripcion, (inscripcion) => inscripcion.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "inscripciones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pago_entity_1.Pago, (pago) => pago.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "pagos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => resena_entity_1.Resena, (resena) => resena.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "resenas", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)('usuarios')
], Usuario);
//# sourceMappingURL=usuario.entity.js.map