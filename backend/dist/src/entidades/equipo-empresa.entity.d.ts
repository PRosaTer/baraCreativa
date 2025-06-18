import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
import { ReporteProgreso } from './reporte-progreso.entity';
export declare class EquipoEmpresaMiembro {
    id: number;
    usuario: Usuario;
    nombreEmpresa: string;
    rolEnEmpresa: string;
    curso?: Curso;
    reportesProgreso: ReporteProgreso[];
}
