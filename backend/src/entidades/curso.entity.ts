import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Modulo } from './modulo.entity';
import { Inscripcion } from './inscripcion.entity';
import { Badge } from './badge.entity';
import { Certificado } from './certificado.entity';
import { Pago } from './pago.entity';
import { Resena } from './resena.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';
import { ReporteProgreso } from './reporte-progreso.entity';

export enum TipoCurso {
  Docentes = 'Docentes',
  Empresas = 'Empresas',
}

export enum ModalidadCurso {
  EnVivo = 'en vivo',
  Grabado = 'grabado',
  Mixto = 'mixto',
}

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column({
    type: 'enum',
    enum: TipoCurso,
  })
  tipo: TipoCurso;

  @Column()
  categoria: string;

  @Column('int')
  duracionHoras: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({
    type: 'enum',
    enum: ModalidadCurso,
  })
  modalidad: ModalidadCurso;

  @CreateDateColumn()
  fechaLanzamiento: Date;

  @Column({ nullable: true })
  imagenCurso: string;

  @Column({ default: false })
  certificadoDisponible: boolean;

  @Column({ default: false })
  badgeDisponible: boolean;


  @OneToMany(() => Modulo, (modulo) => modulo.curso)
  modulos: Modulo[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.curso)
  inscripciones: Inscripcion[];

  @OneToMany(() => Badge, (badge) => badge.curso)
  badges: Badge[];

  @OneToMany(() => Certificado, (certificado) => certificado.curso)
  certificados: Certificado[];

  @OneToMany(() => Pago, (pago) => pago.curso)
  pagos: Pago[];

  @OneToMany(() => Resena, (resena) => resena.curso)
  resenas: Resena[];

  @OneToMany(() => EquipoEmpresaMiembro, (miembro) => miembro.curso)
  equiposAsignados: EquipoEmpresaMiembro[];

  @OneToMany(() => ReporteProgreso, (reporte) => reporte.curso)
  reportesProgreso: ReporteProgreso[];
}
