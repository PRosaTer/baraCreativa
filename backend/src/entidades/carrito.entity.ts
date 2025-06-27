import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

@Entity('carritos')
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.carritos, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.carritos, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column()
  producto: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ default: 1 })
  cantidad: number;

  @CreateDateColumn()
  creadoEn: Date;
}