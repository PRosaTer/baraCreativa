import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';
import { Curso } from '../entidades/curso.entity'; 

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

  @Column({ type: 'timestamp' }) 
  fechaEmision: Date;

  @Column()
  rutaArchivo: string;

  @CreateDateColumn()
  creadoEn: Date;
}
