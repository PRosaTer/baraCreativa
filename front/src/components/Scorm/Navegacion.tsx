"use client";

interface NavegacionModulosProps {
  isPrevContentDisabled: boolean;
  isNextContentDisabled: boolean;
  onNavigate: (direction: "prev" | "next") => void;
}

export default function NavegacionModulos({
  isPrevContentDisabled,
  isNextContentDisabled,
  onNavigate
}: NavegacionModulosProps) {
  return (
    <div className="navegacion-modulos">
      <button onClick={() => onNavigate("prev")} disabled={isPrevContentDisabled}>
        Anterior
      </button>
      <button onClick={() => onNavigate("next")} disabled={isNextContentDisabled}>
        Siguiente
      </button>
    </div>
  );
}
