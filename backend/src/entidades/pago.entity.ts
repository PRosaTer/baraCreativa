import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';

export enum EstadoPago {
  Exitoso = 'exitoso',
  Fallido = 'fallido',
  Pendiente = 'pendiente',
}

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.pagos, { eager: true, onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.pagos, { eager: true, onDelete: 'CASCADE' })
  curso: Curso;

  @CreateDateColumn()
  fechaPago: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  montoPagado: number;

  @Column()
  medioPago: string;

  @Column({
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.Pendiente,
  })
  estadoPago: EstadoPago;

  @Column()
  codigoTransaccion: string;

  @Column('text', { nullable: true })
  datosRecibo?: string;

  @Column({ nullable: true })
  pagosCuotas?: string;

  @Column({ nullable: true })
  descuentos?: string;
}
