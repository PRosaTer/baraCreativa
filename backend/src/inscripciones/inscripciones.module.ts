import { Module } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from '../entidades/inscripcion.entity';
import { Usuario } from '../entidades/usuario.entity';
import { Curso } from '../entidades/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Usuario, Curso])],
  providers: [InscripcionesService],
  controllers: [InscripcionesController],
  exports: [InscripcionesService], 
})
export class InscripcionesModule {}
