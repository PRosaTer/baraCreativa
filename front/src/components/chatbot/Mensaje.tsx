import React from "react";

interface Props {
  texto: React.ReactNode;
  emisor: string;
}

const Mensaje: React.FC<Props> = ({ texto, emisor }) => {
  const estilos =
    emisor === "usuario"
      ? "bg-blue-100 text-right self-end"
      : "bg-gray-100 text-left self-start";

  return (
    <div className={`p-2 my-1 rounded max-w-[90%] ${estilos}`}>
      {texto}
    </div>
  );
};

export default Mensaje;
