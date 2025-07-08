import { Controller, Get, Param, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { Inscripcion } from '../entidades/inscripcion.entity';

@Controller('inscripciones')
export class InscripcionesController {
  private readonly logger = new Logger(InscripcionesController.name);

  constructor(private readonly inscripcionesService: InscripcionesService) {}

  /**
   * Endpoint para verificar si un usuario está inscrito en un curso y si su estado es 'Completado'.
   * @param usuarioId El ID del usuario.
   * @param cursoId El ID del curso.
   * @returns Un objeto con la propiedad 'isEnrolled' (boolean) y 'estado' (string, si existe la inscripción).
   */
  @Get('check-status/:usuarioId/:cursoId')
  async checkEnrollmentStatus(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('cursoId', ParseIntPipe) cursoId: number,
  ) {
    this.logger.log(`Verificando estado de inscripción para Usuario ID: ${usuarioId}, Curso ID: ${cursoId}`);
    
    const inscripcion = await this.inscripcionesService.findByUserAndCourse(usuarioId, cursoId);

    if (inscripcion) {
      this.logger.log(`Inscripción encontrada: Estado '${inscripcion.estado}' para Usuario ID: ${usuarioId}, Curso ID: ${cursoId}`);
      return { 
        isEnrolled: inscripcion.estado === 'Completado',
        estado: inscripcion.estado,
        inscripcionId: inscripcion.id 
      };
    } else {
      this.logger.log(`No se encontró inscripción para Usuario ID: ${usuarioId}, Curso ID: ${cursoId}`);
      return { isEnrolled: false, estado: null };
    }
  }

  // Puedes añadir más endpoints aquí según necesites (ej. obtener todas las inscripciones de un usuario)
  // @Get(':id')
  // async findOne(@Param('id', ParseIntPipe) id: number): Promise<Inscripcion> {
  //   const inscripcion = await this.inscripcionesService.findOne(id);
  //   if (!inscripcion) {
  //     throw new NotFoundException(`Inscripción con ID ${id} no encontrada.`);
  //   }
  //   return inscripcion;
  // }
}
