import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsuariosService } from './usuarios.service';
import { Usuario } from '../entidades/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { extname } from 'path';
import type { Express } from 'express';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  getAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.findOne(+id);
  }

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
  async create(
    @Body() usuarioData: CreateUsuarioDto,
    @UploadedFile() foto?: Express.Multer.File,
  ): Promise<Usuario> {
    console.log('📤 Archivo recibido:', foto);
    console.log('📝 Datos del usuario antes de guardar:', usuarioData);

    if (foto) {
      usuarioData.fotoPerfil = foto.filename;
      console.log('✅ Se asignó fotoPerfil:', usuarioData.fotoPerfil);
    } else {
      console.log('⚠️ No se recibió ninguna imagen');
    }

    const nuevoUsuario = await this.usuariosService.create(usuarioData);
    console.log('🎉 Usuario creado:', nuevoUsuario);
    return nuevoUsuario;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() usuarioData: Partial<Usuario>): Promise<Usuario> {
    return this.usuariosService.update(+id, usuarioData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usuariosService.remove(+id);
  }
}
