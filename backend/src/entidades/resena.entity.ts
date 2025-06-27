import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

@Entity('resenas')
export class Resena {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.resenas, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.resenas, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column({ type: 'int', default: 5 })
  puntaje: number;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @CreateDateColumn()
  creadoEn: Date;
}