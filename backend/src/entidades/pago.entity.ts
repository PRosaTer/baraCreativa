import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Curso } from './curso.entity';
import { Usuario } from './usuario.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'varchar', length: 50 })
  metodoPago: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  referenciaPago?: string;

  @Column({ type: 'timestamp', nullable: true })
  fechaConfirmacionPago?: Date;

  @Column({ type: 'varchar', length: 20, default: 'Pendiente' })
  estado: string;  // <-- Nuevo campo para estado del pago

  @ManyToOne(() => Usuario, (usuario) => usuario.pagos, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.pagos, { onDelete: 'CASCADE' })
  curso: Curso;

  @CreateDateColumn()
  fechaPago: Date;
}
