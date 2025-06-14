import React from "react";
import BotonEmergente from "./BotonEmergente";

interface Props {
  visible: boolean;
}

const OpcionesAsistencia: React.FC<Props> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="flex flex-col gap-2 mb-2 items-end">
      <BotonEmergente
        texto="¿Necesitas ayuda?"
        enlace="https://wa.me/50433351621?text=Hola!%20Necesito%20asistencia%20sobre%20los%20cursos"
      />
    </div>
  );
};

export default OpcionesAsistencia;
