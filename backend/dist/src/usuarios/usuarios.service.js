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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../entidades/usuario.entity");
const bcrypt = require("bcrypt");
let UsuariosService = class UsuariosService {
    usuariosRepository;
    constructor(usuariosRepository) {
        this.usuariosRepository = usuariosRepository;
    }
    async encontrarPorId(id) {
        const usuario = await this.usuariosRepository.findOne({ where: { id } });
        return usuario || null;
    }
    async encontrarPorCorreo(correoElectronico) {
        const usuario = await this.usuariosRepository.findOne({ where: { correoElectronico } });
        return usuario || null;
    }
    async findAll() {
        return this.usuariosRepository.find();
    }
    async findOne(id) {
        const usuario = await this.usuariosRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        return usuario;
    }
    async create(usuarioData) {
        if (usuarioData.password) {
            const salt = await bcrypt.genSalt();
            usuarioData.password = await bcrypt.hash(usuarioData.password, salt);
        }
        const nuevoUsuario = this.usuariosRepository.create(usuarioData);
        return this.usuariosRepository.save(nuevoUsuario);
    }
    async update(id, usuarioData) {
        const resultado = await this.usuariosRepository.update(id, usuarioData);
        if (resultado.affected === 0) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        return this.findOne(id);
    }
    async remove(id) {
        const resultado = await this.usuariosRepository.delete(id);
        if (resultado.affected === 0) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map