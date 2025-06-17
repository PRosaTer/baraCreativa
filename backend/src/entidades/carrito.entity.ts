import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

export enum EstadoCarrito {
  Activo = 'activo',
  Abandonado = 'abandonado',
  Comprado = 'comprado',
}

@Entity('carritos')
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.carritos, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToMany(() => Curso)
  @JoinTable({
    name: 'carrito_cursos',
    joinColumn: { name: 'carrito_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'curso_id', referencedColumnName: 'id' },
  })
  cursos: Curso[];

  @CreateDateColumn()
  fechaCreacion: Date;

  @Column({
    type: 'enum',
    enum: EstadoCarrito,
    default: EstadoCarrito.Activo,
  })
  estado: EstadoCarrito;
}
