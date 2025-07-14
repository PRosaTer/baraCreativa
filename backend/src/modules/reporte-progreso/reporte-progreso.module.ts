import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { ReporteProgresoService } from '../../services/reporte-progreso/reporte-progreso.service';
import { ReporteProgresoController } from '../../controllers/reporte-progreso/reporte-progreso.controller';
import { Usuario } from '../../entidades/usuario.entity';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity } from '../../entidades/modulo.entity';
import { AuthModule } from '../../modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReporteProgresoEntity, Usuario, Curso, ModuloEntity]),
    AuthModule,
  ],
  providers: [ReporteProgresoService],
  controllers: [ReporteProgresoController],
  exports: [ReporteProgresoService],
})
export class ReporteProgresoModule {}
