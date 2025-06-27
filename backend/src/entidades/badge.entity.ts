import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Curso } from './curso.entity';

@Entity('badges')
export class BadgeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Curso, (curso) => curso.badges, { nullable: true, onDelete: 'SET NULL' })
  curso: Curso;
}