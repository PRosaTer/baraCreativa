import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

@Entity('inscripciones')
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.inscripciones, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.inscripciones, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column({ default: 'Pendiente' })
  estado: string;

  @CreateDateColumn()
  creadoEn: Date;
}