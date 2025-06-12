import React from "react";

interface Props {
  texto: string;
  enlace: string;
}

const BotonEmergente: React.FC<Props> = ({ texto, enlace }) => {
  return (
    <a
      href={enlace}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-500 text-white text-sm md:text-base px-3 py-2 rounded-md shadow-md hover:bg-green-600 transition-all"
    >
      {texto}
    </a>
  );
};

export default BotonEmergente;
