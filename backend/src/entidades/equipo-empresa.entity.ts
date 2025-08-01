import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

@Entity('equipo_empresa')
export class EquipoEmpresaMiembro {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.equipos, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.equiposAsignados, { nullable: true, onDelete: 'SET NULL' })
  curso: Curso;

  @Column()
  nombreEquipo: string;

  @Column()
  rol: string;

  @CreateDateColumn()
  creadoEn: Date;
}