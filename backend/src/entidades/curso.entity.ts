import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { ModuloEntity } from '../entidades/modulo.entity';
import { BadgeEntity } from '../entidades/badge.entity';
import { Carrito } from '../entidades/carrito.entity';
import { Certificado } from '../entidades/certificado.entity';
import { EquipoEmpresaMiembro } from '../entidades/equipo-empresa.entity';
import { Inscripcion } from '../entidades/inscripcion.entity';
import { Pago } from '../entidades/pago.entity';
import { ReporteProgresoEntity } from '../entidades/reporte-progreso.entity';
import { Resena } from '../entidades/resena.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Título del Curso' })
  titulo: string;

  @Column({ default: 'Descripción del curso por defecto' })
  descripcion: string;

  @Column({ default: 'Docentes' })
  tipo: 'Docentes' | 'Empresas';

  @Column({ default: 'General' })
  categoria: string;

  @Column({ type: 'int', default: 0 })
  duracionHoras: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  precio: number;

  @Column({ default: 'grabado' })
  modalidad: 'en vivo' | 'grabado' | 'mixto';

  @Column({ default: false })
  certificadoDisponible: boolean;

  @Column({ default: false })
  badgeDisponible: boolean;

  @Column({ nullable: true })
  imagenCurso?: string;

  @OneToMany(() => ModuloEntity, (modulo) => modulo.curso, { cascade: true })
  modulos: ModuloEntity[];

  @OneToMany(() => BadgeEntity, (badge) => badge.curso)
  badges: BadgeEntity[];

  @OneToMany(() => Carrito, (carrito) => carrito.curso)
  carritos: Carrito[];

  @OneToMany(() => Certificado, (certificado) => certificado.curso)
  certificados: Certificado[];

  @OneToMany(() => EquipoEmpresaMiembro, (equipo) => equipo.curso)
  equiposAsignados: EquipoEmpresaMiembro[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.curso)
  inscripciones: Inscripcion[];

  @OneToMany(() => Pago, (pago) => pago.curso)
  pagos: Pago[];

  @OneToMany(() => ReporteProgresoEntity, (reporte) => reporte.curso)
  reportesProgreso: ReporteProgresoEntity[];

  @OneToMany(() => Resena, (resena) => resena.curso)
  resenas: Resena[];
}