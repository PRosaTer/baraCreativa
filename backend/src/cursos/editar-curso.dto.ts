import { PartialType } from '@nestjs/mapped-types';
import { CrearCursoDto } from './crear-curso.dto';

export class EditarCursoDto extends PartialType(CrearCursoDto) {}
