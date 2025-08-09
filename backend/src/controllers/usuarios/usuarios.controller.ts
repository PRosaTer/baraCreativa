import {
  Controller,
  Get,
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

import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { UpdateUsuarioDto } from '../../dto/crear-editar-usuarios/update-usuario.dto';
import { Usuario } from '../../entidades/usuario.entity';
import { UsuarioAutenticado } from '../../auth/decoradores/usuario-autenticado.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getMe(@UsuarioAutenticado() usuario: Usuario): Partial<Usuario> {
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  @Get()
  getAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Usuario> {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException(`ID inválido: ${id}`);
    }

    const usuario = await this.usuariosService.findOne(idNum);
    if (!usuario) {
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
      throw new BadRequestException(`ID inválido: ${id}`);
    }

    if (!usuarioAutenticado.esAdmin && usuarioAutenticado.id !== idNum) {
      throw new ForbiddenException('No tienes permiso para modificar este usuario');
    }

    if (!usuarioAutenticado.esAdmin) {
      if ('esAdmin' in usuarioData && usuarioData.esAdmin !== usuarioAutenticado.esAdmin) {
        throw new ForbiddenException('No puedes cambiar el permiso de administrador');
      }
      if ('tipoUsuario' in usuarioData && usuarioData.tipoUsuario === 'Admin') {
        throw new ForbiddenException('No puedes asignarte el rol Admin');
      }
    }

    if (foto) {
      usuarioData.fotoPerfil = foto.filename;
    }

    return this.usuariosService.update(idNum, usuarioData);
  }
}
