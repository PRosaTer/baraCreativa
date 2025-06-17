import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

@Entity('certificados')
export class Certificado {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.certificados, { eager: true, onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.certificados, { eager: true, onDelete: 'CASCADE' })
  curso: Curso;

  @Column({ unique: true })
  codigoUnico: string;

  @CreateDateColumn()
  fechaEmision: Date;

  @Column()
  urlDescarga: string;

  @Column({ default: false })
  verificado: boolean;
}
