import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';

import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from '../entidades/usuario.entity';
import { UsuarioAutenticado } from '../auth/decoradores/usuario-autenticado.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/usuarios')
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('fotoPerfil', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile() foto: Express.Multer.File,
    @Body() datos: CreateUsuarioDto,
  ): Promise<Usuario> {
    if (foto) {
      datos.fotoPerfil = foto.filename;
    }
    return this.usuariosService.create(datos);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@UsuarioAutenticado() usuario: Usuario): Partial<Usuario> {
    this.logger.log('Usuario autenticado recibido en /api/usuarios/me:', usuario);
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  @Get()
  getAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Usuario> {
    this.logger.log(`ID recibido en GET /api/usuarios/:id -> ${id}`);

    const idNum = Number(id);
    if (isNaN(idNum)) {
      this.logger.error(`ID inválido recibido: ${id}`);
      throw new BadRequestException(`ID inválido: ${id}`);
    }

    const usuario = await this.usuariosService.findOne(idNum);
    if (!usuario) {
      this.logger.warn(`Usuario no encontrado con ID: ${idNum}`);
      throw new BadRequestException(`Usuario con ID ${idNum} no encontrado`);
    }
    return usuario;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('fotoPerfil', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UsuarioAutenticado() usuarioAutenticado: Usuario,
    @Body() usuarioData: UpdateUsuarioDto,
    @UploadedFile() foto?: Express.Multer.File,
  ): Promise<Usuario> {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      this.logger.error(`ID inválido recibido para actualización: ${id}`);
      throw new BadRequestException(`ID inválido: ${id}`);
    }

    if (!usuarioAutenticado.esAdmin && usuarioAutenticado.id !== idNum) {
      throw new ForbiddenException('No tienes permiso para modificar este usuario');
    }

    if (!usuarioAutenticado.esAdmin) {
      if ('esAdmin' in usuarioData && usuarioData.esAdmin !== usuarioAutenticado.esAdmin) {
        this.logger.warn(`Intento no autorizado de modificar permisos por usuario ${usuarioAutenticado.id}`);
        throw new ForbiddenException('No puedes cambiar el permiso de administrador');
      }
      if ('tipoUsuario' in usuarioData && usuarioData.tipoUsuario === 'Admin') {
        this.logger.warn(`Intento no autorizado de asignarse rol Admin por usuario ${usuarioAutenticado.id}`);
        throw new ForbiddenException('No puedes asignarte el rol Admin');
      }
    }

    if (foto) {
      usuarioData.fotoPerfil = foto.filename;
    }

    return this.usuariosService.update(idNum, usuarioData);
  }
}
