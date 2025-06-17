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
exports.Carrito = exports.EstadoCarrito = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const curso_entity_1 = require("./curso.entity");
var EstadoCarrito;
(function (EstadoCarrito) {
    EstadoCarrito["Activo"] = "activo";
    EstadoCarrito["Abandonado"] = "abandonado";
    EstadoCarrito["Comprado"] = "comprado";
})(EstadoCarrito || (exports.EstadoCarrito = EstadoCarrito = {}));
let Carrito = class Carrito {
    id;
    usuario;
    cursos;
    fechaCreacion;
    estado;
};
exports.Carrito = Carrito;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Carrito.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.carritos, { onDelete: 'CASCADE' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Carrito.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => curso_entity_1.Curso),
    (0, typeorm_1.JoinTable)({
        name: 'carrito_cursos',
        joinColumn: { name: 'carrito_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'curso_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Carrito.prototype, "cursos", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Carrito.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoCarrito,
        default: EstadoCarrito.Activo,
    }),
    __metadata("design:type", String)
], Carrito.prototype, "estado", void 0);
exports.Carrito = Carrito = __decorate([
    (0, typeorm_1.Entity)('carritos')
], Carrito);
//# sourceMappingURL=carrito.entity.js.map