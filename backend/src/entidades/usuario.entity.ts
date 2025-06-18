import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Carrito } from './carrito.entity';
import { Certificado } from './certificado.entity';
import { ContactoSoporte } from './contacto-soporte.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';
import { Inscripcion } from './inscripcion.entity';
import { Pago } from './pago.entity';
import { Resena } from './resena.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCompleto: string;

@Column({ unique: true, name: 'correoelectronico' })
correoElectronico: string;


  @Column()
  password: string;

  @Column({ nullable: true })
  fotoPerfil?: string;

  @Column({ default: false })
  esAdmin: boolean;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @Column({ type: 'varchar', nullable: true })
  tokenRecuperacion: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expiracionTokenRecuperacion: Date | null;


  @OneToMany(() => Carrito, (carrito) => carrito.usuario)
  carritos: Carrito[];

  @OneToMany(() => Certificado, (certificado) => certificado.usuario)
  certificados: Certificado[];

  @OneToMany(() => ContactoSoporte, (contacto) => contacto.usuario)
  contactosSoporte: ContactoSoporte[];

  @OneToMany(() => EquipoEmpresaMiembro, (equipo) => equipo.usuario)
  equipos: EquipoEmpresaMiembro[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.usuario)
  inscripciones: Inscripcion[];

  @OneToMany(() => Pago, (pago) => pago.usuario)
  pagos: Pago[];

  @OneToMany(() => Resena, (resena) => resena.usuario)
  resenas: Resena[];
}
