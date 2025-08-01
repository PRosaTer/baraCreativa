import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgesService } from '../../services/badges/badges.service';
import { BadgesController } from '../../controllers/badges/badges.controller';
import { Curso } from '../../entidades/curso.entity';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { Usuario } from '../../entidades/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReporteProgresoEntity, Curso, Usuario]),
  ],
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}