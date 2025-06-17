import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';

@Entity('reporte_progreso')
export class ReporteProgreso {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'CASCADE' })
  usuario?: Usuario;

  @ManyToOne(() => EquipoEmpresaMiembro, { nullable: true, onDelete: 'CASCADE' })
  equipo?: EquipoEmpresaMiembro;

  @ManyToOne(() => Curso, (curso) => curso.reportesProgreso, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column('int')
  porcentajeAvance: number;

  @CreateDateColumn()
  fechaUltimoAcceso: Date;

  @Column('int')
  tiempoInvertidoMinutos: number;
}
