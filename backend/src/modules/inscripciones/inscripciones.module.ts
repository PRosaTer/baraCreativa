import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionesService } from '../../services/inscripciones/inscripciones.service';
import { InscripcionesController } from '../../controllers/inscripciones/inscripciones.controller'; // Asume que tienes un controlador para inscripciones
import { Inscripcion } from '../../entidades/inscripcion.entity';
import { Usuario } from '../../entidades/usuario.entity';
import { Curso } from '../../entidades/curso.entity';
import { CertificadosModule } from '../certificados/certificados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inscripcion, Usuario, Curso]),
    CertificadosModule, 
  ],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
  exports: [InscripcionesService], 
})
export class InscripcionesModule {}
