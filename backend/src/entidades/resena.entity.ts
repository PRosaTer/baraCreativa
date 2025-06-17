import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

@Entity('resenas')
export class Resena {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.resenas, { eager: true, onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.resenas, { eager: true, onDelete: 'CASCADE' })
  curso: Curso;

  @Column('int')
  puntuacion: number; // 1 a 5

  @Column('text')
  comentario: string;

  @CreateDateColumn()
  fechaResena: Date;
}
