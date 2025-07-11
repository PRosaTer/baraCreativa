import { TipoUsuario } from '../entidades/usuario.entity';
import { TransactionDetails } from '../interfaces/transaction-details.interface';

export interface PurchaseNotificationData {
  userName: string;
  userEmail: string;
  courseTitle: string;
  paymentAmount: number;
  orderId: string;
  transactionDetails: TransactionDetails;
  tipoUsuario: TipoUsuario;
  cursosComprados: string[];
  totalComprados: number;
  porcentajeComprados: number;
  startDate?: string;
}