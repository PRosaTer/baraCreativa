"use client";

import { NavegacionModulosProps } from '@/app/types/scorm-types';

export default function NavegacionModulos({
    disablePrev,
    disableNext,
    onNavigate
}: NavegacionModulosProps) {
    return (
        <div className="navegacion-modulos">
            <button onClick={() => onNavigate("prev")} disabled={disablePrev}>
                Anterior
            </button>
            <button onClick={() => onNavigate("next")} disabled={disableNext}>
                Siguiente
            </button>
        </div>
    );
}
