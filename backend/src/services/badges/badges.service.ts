import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { Curso } from '../../entidades/curso.entity';

export interface CatBadgeStatus {
  unlocked: boolean;
  message: string;
}

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(ReporteProgresoEntity)
    private readonly reporteProgresoRepository: Repository<ReporteProgresoEntity>,
  ) {}

  private readonly catCourses = [
    'Virtual T',
    'Fábrica de Creativos',
    'DMentes Verdes',
    'DisruptED',
    'ALGO líder',
    'Bara Games',
  ];

  async checkCatBadgeStatus(userId: number): Promise<CatBadgeStatus> {
    if (!userId) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const completedCount = await this.reporteProgresoRepository
      .createQueryBuilder('reporte')
      .innerJoin(Curso, 'curso', 'curso.id = reporte.cursoId')
      .where('reporte.usuarioId = :userId', { userId })
      .andWhere('curso.titulo IN (:...catCourses)', { catCourses: this.catCourses })
      .andWhere('reporte.completado = :completado', { completado: true })
      .getCount();
      
    const unlocked = completedCount === this.catCourses.length;
    const remaining = this.catCourses.length - completedCount;
    const message = unlocked
      ? '¡Felicitaciones! Has completado todos los cursos CAT.'
      : `Te faltan ${remaining} cursos para desbloquear este logro.`;

    return { unlocked, message };
  }
}