import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { ReporteProgresoService } from '../../services/reporte-progreso/reporte-progreso.service';
import { ReporteProgresoController } from '../../controllers/reporte-progreso/reporte-progreso.controller';
import { Usuario } from '../../entidades/usuario.entity';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity } from '../../entidades/modulo.entity';
import { Inscripcion } from '../../entidades/inscripcion.entity';
import { CertificadosModule } from '../../modules/certificados/certificados.module'; 
import { CursosModule } from '../../modules/cursos/cursos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReporteProgresoEntity, Usuario, Curso, ModuloEntity, Inscripcion]),
    CertificadosModule, 
    CursosModule,
  ],
  controllers: [ReporteProgresoController],
  providers: [ReporteProgresoService],
  exports: [ReporteProgresoService],
})
export class ReporteProgresoModule {}