import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ModuloEntity } from './modulo.entity';
import { BadgeEntity } from './badge.entity';
import { Carrito } from './carrito.entity';
import { Certificado } from './certificado.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';
import { Inscripcion } from './inscripcion.entity';
import { Pago } from './pago.entity';
import { ReporteProgresoEntity } from './reporte-progreso.entity';
import { Resena } from './resena.entity';

// Definimos un enumerado (enum) para diferenciar el tipo de ítem
export enum ClaseItem {
  CURSO = 'curso',
  SERVICIO = 'servicio',
}

@Entity('cursos') // La tabla en la base de datos sigue siendo 'cursos'
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Título del Curso' })
  titulo: string;

  @Column({ default: 'Descripción del curso por defecto' })
  descripcion: string;

  // Nueva columna para diferenciar entre "curso" y "servicio"
  // Por defecto, se asume que es un curso si no se especifica.
  @Column({ type: 'enum', enum: ClaseItem, default: ClaseItem.CURSO })
  claseItem: ClaseItem;

  @Column({ default: 'Docentes' })
  tipo: 'Docentes' | 'Empresas';

  @Column({ default: 'General' })
  categoria: string;

  @Column({ type: 'int', default: 0 })
  duracionHoras: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  precio: number;

  @Column({ default: 'grabado' })
  modalidad: 'en vivo' | 'grabado' | 'mixto';

  @Column({ default: false })
  certificadoDisponible: boolean;

  @Column({ default: false })
  badgeDisponible: boolean;

  @Column({ nullable: true })
  imagenCurso?: string;

  @Column({ nullable: true })
  archivoScorm?: string;

  @Column({ nullable: true })
  videoCurso?: string;

  @Column({ nullable: true })
  pdfCurso?: string;

  // Propiedad para la fecha de inicio del curso, opcional ya que los servicios no la tendrían
  @Column({ type: 'date', nullable: true })
  fechaInicio?: Date; // Lo hacemos opcional con '?' y 'nullable: true'

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