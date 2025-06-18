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
exports.Pago = exports.EstadoPago = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const curso_entity_1 = require("./curso.entity");
var EstadoPago;
(function (EstadoPago) {
    EstadoPago["Exitoso"] = "exitoso";
    EstadoPago["Fallido"] = "fallido";
    EstadoPago["Pendiente"] = "pendiente";
})(EstadoPago || (exports.EstadoPago = EstadoPago = {}));
let Pago = class Pago {
    id;
    usuario;
    curso;
    fechaPago;
    montoPagado;
    medioPago;
    estadoPago;
    codigoTransaccion;
    datosRecibo;
    pagosCuotas;
    descuentos;
};
exports.Pago = Pago;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pago.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.pagos, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Pago.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso, (curso) => curso.pagos, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", curso_entity_1.Curso)
], Pago.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pago.prototype, "fechaPago", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pago.prototype, "montoPagado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pago.prototype, "medioPago", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoPago,
        default: EstadoPago.Pendiente,
    }),
    __metadata("design:type", String)
], Pago.prototype, "estadoPago", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pago.prototype, "codigoTransaccion", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "datosRecibo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "pagosCuotas", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "descuentos", void 0);
exports.Pago = Pago = __decorate([
    (0, typeorm_1.Entity)('pagos')
], Pago);
//# sourceMappingURL=pago.entity.js.map