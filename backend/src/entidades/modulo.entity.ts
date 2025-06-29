import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Curso } from './curso.entity';

@Entity('modulos')
export class ModuloEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ nullable: true })
  pdfUrl?: string;

  @ManyToOne(() => Curso, (curso) => curso.modulos, { onDelete: 'CASCADE' })
  curso: Curso;
}