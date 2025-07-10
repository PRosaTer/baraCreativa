import { Usuario } from '../inscripciones/usuario.entity'; // Ajusta la ruta según tu estructura

declare module 'express' {
  interface Request {
    user?: Usuario; 
  }
}
