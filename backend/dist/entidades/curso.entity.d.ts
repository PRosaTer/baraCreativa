import { Modulo } from './modulo.entity';
import { Inscripcion } from './inscripcion.entity';
import { Badge } from './badge.entity';
import { Certificado } from './certificado.entity';
import { Pago } from './pago.entity';
import { Resena } from './resena.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';
import { ReporteProgreso } from './reporte-progreso.entity';
export declare enum TipoCurso {
    Docentes = "Docentes",
    Empresas = "Empresas"
}
export declare enum ModalidadCurso {
    EnVivo = "en vivo",
    Grabado = "grabado",
    Mixto = "mixto"
}
export declare class Curso {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: TipoCurso;
    categoria: string;
    duracionHoras: number;
    precio: number;
    modalidad: ModalidadCurso;
    fechaLanzamiento: Date;
    imagenCurso: string;
    certificadoDisponible: boolean;
    badgeDisponible: boolean;
    modulos: Modulo[];
    inscripciones: Inscripcion[];
    badges: Badge[];
    certificados: Certificado[];
    pagos: Pago[];
    resenas: Resena[];
    equiposAsignados: EquipoEmpresaMiembro[];
    reportesProgreso: ReporteProgreso[];
}
