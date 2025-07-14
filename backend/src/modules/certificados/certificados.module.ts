import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificadosController } from '../../controllers/certificados/certificados.controller';
import { CertificadosService } from '../../services/certificados/certificados.service';
import { Certificado } from '../../entidades/certificado.entity';
import { Usuario } from '../../entidades/usuario.entity';
import { Curso } from '../../entidades/curso.entity';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { Inscripcion } from '../../entidades/inscripcion.entity';

@Module({
  imports: [
    
    TypeOrmModule.forFeature([Certificado, Usuario, Curso, ReporteProgresoEntity, Inscripcion]),
  ],
  controllers: [CertificadosController],
  providers: [CertificadosService],
  exports: [CertificadosService],
})
export class CertificadosModule {}
