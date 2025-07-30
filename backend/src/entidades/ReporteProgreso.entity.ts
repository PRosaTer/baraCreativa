import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm'; // Añadir JoinColumn
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
import { ModuloEntity } from './modulo.entity';

@Entity('reportes_progreso')
@Unique(['usuario', 'modulo'])
export class ReporteProgresoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  curso: Curso;

  @ManyToOne(() => ModuloEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduloId' })
  modulo: ModuloEntity;

  @Column({ default: false })
  completado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fechaCompletado: Date | null;
}
