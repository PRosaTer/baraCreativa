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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const usuarios_service_1 = require("../../usuarios/usuarios.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    usuariosService;
    constructor(configService, usuariosService) {
        const jwtSecret = configService.get('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET no está definido en las variables de entorno');
        }
        const options = {
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
            passReqToCallback: false,
        };
        super(options);
        this.configService = configService;
        this.usuariosService = usuariosService;
    }
    async validate(payload) {
        const usuario = await this.usuariosService.encontrarPorId(payload.sub);
        if (!usuario) {
            throw new common_1.UnauthorizedException('Token inválido o usuario no encontrado.');
        }
        return {
            id: usuario.id,
            nombreCompleto: usuario.nombreCompleto,
            correoElectronico: usuario.correoElectronico,
            telefono: usuario.telefono,
            tipoUsuario: usuario.tipoUsuario,
            nombreEmpresa: usuario.nombreEmpresa,
            fotoPerfil: usuario.fotoPerfil,
            estadoCuenta: usuario.estadoCuenta,
            esAdmin: usuario.esAdmin,
            creadoEn: usuario.creadoEn,
            actualizadoEn: usuario.actualizadoEn,
            ultimaSesion: usuario.ultimaSesion,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        usuarios_service_1.UsuariosService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map