import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';
import { Pago } from './pago.entity';
import { Carrito } from './carrito.entity';
import { ContactoSoporte } from './contacto-soporte.entity';
import { Resena } from './resena.entity';
import { Certificado } from './certificado.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';

export enum TipoUsuario {
  Alumno = 'Alumno',
  Empresa = 'Empresa',
  Admin = 'Admin',
}

export enum EstadoCuenta {
  Activo = 'activo',
  Inactivo = 'inactivo',
  Bloqueado = 'bloqueado',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCompleto: string;

  @Column({ unique: true })
  correoElectronico: string;

  @Column()
  contraseña: string;

  @Column({ nullable: true })
  telefono?: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    default: TipoUsuario.Alumno,
  })
  tipoUsuario: TipoUsuario;

  @Column({ nullable: true })
  nombreEmpresa?: string;

  @CreateDateColumn()
  fechaRegistro: Date;

  @Column({ nullable: true })
  fotoPerfil?: string;

  @UpdateDateColumn()
  ultimaSesion: Date;

  @Column({
    type: 'enum',
    enum: EstadoCuenta,
    default: EstadoCuenta.Activo,
  })
  estadoCuenta: EstadoCuenta;


  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.usuario)
  inscripciones: Inscripcion[];

  @OneToMany(() => Pago, (pago) => pago.usuario)
  pagos: Pago[];

  @OneToMany(() => Carrito, (carrito) => carrito.usuario)
  carritos: Carrito[];

  @OneToMany(() => ContactoSoporte, (contacto) => contacto.usuario)
  contactosSoporte: ContactoSoporte[];

  @OneToMany(() => Resena, (resena) => resena.usuario)
  resenas: Resena[];

  @OneToMany(() => Certificado, (certificado) => certificado.usuario)
  certificados: Certificado[];

  @OneToMany(() => EquipoEmpresaMiembro, (miembro) => miembro.usuario)
  equipos: EquipoEmpresaMiembro[];
}
