import React from "react";

interface Props {
  texto: React.ReactNode;
  emisor: "pepito" | "usuario";
}

const Mensaje: React.FC<Props> = ({ texto, emisor }) => {
  const esPepito = emisor === "pepito";
  return (
    <div
      className={`p-2 my-1 max-w-[80%] rounded-md text-sm break-words ${
        esPepito
          ? "bg-blue-100 text-blue-900 self-start"
          : "bg-gray-200 text-gray-800 self-end"
      }`}
    >
      {texto}
    </div>
  );
};

export default Mensaje;
