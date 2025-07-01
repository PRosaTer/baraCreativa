import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';
import { Curso } from '../entidades/curso.entity';
import { ModuloEntity } from '../entidades/modulo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, ModuloEntity])
  ],
  controllers: [CursosController],
  providers: [CursosService],

})
export class CursosModule {}