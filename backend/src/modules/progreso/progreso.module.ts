import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgresoService } from '../../services/progreso/Progreso.service'; 
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity } from '../../entidades/modulo.entity';
import { Usuario } from '../../entidades/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReporteProgresoEntity, Curso, ModuloEntity, Usuario]),
  ],
  providers: [ProgresoService],
  exports: [ProgresoService], 
})
export class ProgresoModule {}