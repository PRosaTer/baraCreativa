import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
import { ReporteProgreso } from './reporte-progreso.entity';

@Entity('equipo_empresa')
export class EquipoEmpresaMiembro {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.equipos, { eager: true, onDelete: 'CASCADE' })
  usuario: Usuario;

  @Column()
  nombreEmpresa: string;

  @Column()
  rolEnEmpresa: string;

  @ManyToOne(() => Curso, (curso) => curso.equiposAsignados, { nullable: true, onDelete: 'SET NULL' })
  curso?: Curso;

  @OneToMany(() => ReporteProgreso, (reporte) => reporte.equipo)
  reportesProgreso: ReporteProgreso[];
}
