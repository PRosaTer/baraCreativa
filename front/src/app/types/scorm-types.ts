import { Modulo } from '@/app/types/curso';

// Interfaz unificada y centralizada para los módulos de usuario en SCORM
export interface EstadoModuloUsuario extends Modulo {
    tipo: 'scorm' | 'video' | 'pdf' | 'imagen' | 'texto' | null;
    orden: number;
    completado: boolean;
    fechaCompletado: Date | null;
}

// Interfaz para las props del componente de navegación
export interface NavegacionModulosProps {
    onNavigate: (direction: "prev" | "next") => void;
    disablePrev: boolean;
    disableNext: boolean;
}
