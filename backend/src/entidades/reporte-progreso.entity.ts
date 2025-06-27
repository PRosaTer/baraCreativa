import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Curso } from './curso.entity';

@Entity('reportes_progreso')
export class ReporteProgresoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Curso, (curso) => curso.reportesProgreso, { onDelete: 'CASCADE' })
  curso: Curso;
}