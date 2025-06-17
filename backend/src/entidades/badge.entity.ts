import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Curso } from './curso.entity';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column()
  iconoUrl: string;

  @Column('text')
  criterios: string;

  @ManyToOne(() => Curso, (curso) => curso.badges, { nullable: true, onDelete: 'SET NULL' })
  curso?: Curso;
}
