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
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../entidades/usuario.entity");
const crypto_1 = require("crypto");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
const mail_config_1 = require("../config/mail.config");
let PasswordService = class PasswordService {
    usuariosRepo;
    configService;
    transporter;
    constructor(usuariosRepo, configService) {
        this.usuariosRepo = usuariosRepo;
        this.configService = configService;
        this.transporter = (0, mail_config_1.crearTransportador)(this.configService);
    }
    async solicitarReset(dto) {
        const usuario = await this.usuariosRepo.findOne({
            where: { correoElectronico: dto.correoElectronico },
        });
        if (!usuario) {
            throw new common_1.NotFoundException('No se encontró un usuario con ese correo');
        }
        const token = (0, crypto_1.randomUUID)();
        const expiracion = new Date();
        expiracion.setHours(expiracion.getHours() + 1);
        usuario.tokenRecuperacion = token;
        usuario.expiracionTokenRecuperacion = expiracion;
        await this.usuariosRepo.save(usuario);
        const enlace = `http://localhost:3000/password/restablecer?token=${token}`;
        try {
            await this.transporter.sendMail({
                from: `"Bara Creativa" <${this.configService.get('EMAIL_USER')}>`,
                to: usuario.correoElectronico,
                subject: 'Restablecer contraseña - Bara Creativa',
                html: `
          <p>Hola ${usuario.nombreCompleto},</p>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${enlace}">${enlace}</a>
          <p>Este enlace expirará en 1 hora.</p>
        `,
            });
        }
        catch (error) {
            console.error('Error enviando mail:', error);
            throw new common_1.InternalServerErrorException('No se pudo enviar el correo de recuperación.');
        }
        return {
            mensaje: 'Se ha enviado un correo con el enlace para restablecer tu contraseña.',
        };
    }
    async confirmarReset(dto) {
        const usuario = await this.usuariosRepo.findOne({
            where: { tokenRecuperacion: dto.token },
        });
        if (!usuario) {
            throw new common_1.BadRequestException('Token inválido');
        }
        if (!usuario.expiracionTokenRecuperacion || usuario.expiracionTokenRecuperacion < new Date()) {
            throw new common_1.BadRequestException('Token expirado');
        }
        const hash = await bcrypt.hash(dto.password, 10);
        usuario.password = hash;
        usuario.tokenRecuperacion = null;
        usuario.expiracionTokenRecuperacion = null;
        await this.usuariosRepo.save(usuario);
        return { mensaje: 'Contraseña restablecida con éxito' };
    }
};
exports.PasswordService = PasswordService;
exports.PasswordService = PasswordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], PasswordService);
//# sourceMappingURL=password.service.js.map