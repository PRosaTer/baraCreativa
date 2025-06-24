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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';

import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from '../entidades/usuario.entity';
import { UsuarioAutenticado } from '../auth/decoradores/usuario-autenticado.decorator.ts';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
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

  @Get()
  getAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.findOne(+id);
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
    if (!usuarioAutenticado.esAdmin && usuarioAutenticado.id !== +id) {
      throw new ForbiddenException('No tienes permiso para modificar este usuario');
    }

    if (!usuarioAutenticado.esAdmin) {
      if ('tipoUsuario' in usuarioData || 'esAdmin' in usuarioData) {
        throw new ForbiddenException('No puedes cambiar el rol o permisos de usuario');
      }
    }

    if (foto) {
      usuarioData.fotoPerfil = foto.filename;
    }

    return this.usuariosService.update(+id, usuarioData);
  }
}
