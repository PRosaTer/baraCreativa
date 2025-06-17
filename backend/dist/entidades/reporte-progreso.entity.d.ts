import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';
export declare class ReporteProgreso {
    id: number;
    usuario?: Usuario;
    equipo?: EquipoEmpresaMiembro;
    curso: Curso;
    porcentajeAvance: number;
    fechaUltimoAcceso: Date;
    tiempoInvertidoMinutos: number;
}
