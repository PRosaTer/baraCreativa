// src/entidades/modulo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Curso } from './curso.entity';

@Entity('modulos')
export class ModuloEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', nullable: true })
  videoUrl?: string | null;

  @Column({ type: 'varchar', nullable: true })
  pdfUrl?: string | null;

  @ManyToOne(() => Curso, (curso) => curso.modulos, { onDelete: 'CASCADE' })
  curso: Curso;
}
