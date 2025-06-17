import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

export enum EstadoCurso {
  EnProgreso = 'en progreso',
  Completado = 'completado',
  Abandonado = 'abandonado',
}

@Entity('inscripciones')
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.inscripciones, { eager: true, onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.inscripciones, { eager: true, onDelete: 'CASCADE' })
  curso: Curso;

  @CreateDateColumn()
  fechaInscripcion: Date;

  @Column({
    type: 'enum',
    enum: EstadoCurso,
    default: EstadoCurso.EnProgreso,
  })
  estadoCurso: EstadoCurso;

  @Column('int', { default: 0 })
  progreso: number;

  @Column({ nullable: true })
  fechaFinalizacion?: Date;
}
