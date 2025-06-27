import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

@Entity('certificados')
export class Certificado {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.certificados, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.certificados, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column()
  nombreCurso: string;

  @Column()
  fechaEmision: Date;

  @CreateDateColumn()
  creadoEn: Date;
}