import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

@Entity('inscripciones')
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.inscripciones, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, curso => curso.inscripciones, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column({ default: 'Pendiente' }) 
  estado: string; 

  @Column({ default: false })
  cursoCompletado: boolean;

  @CreateDateColumn()
  fechaInscripcion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaFinalizacion: Date | null;
}
