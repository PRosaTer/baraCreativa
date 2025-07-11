import React from "react";

interface PropsBotonEnviar {
  texto: string;
}

const BotonEnviar: React.FC<PropsBotonEnviar> = ({ texto }) => {
  return (
    <button
      type="submit"
      className="w-full bg-red-900 text-yellow-300 px-4 py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 hover:text-black focus:outline-none focus:ring-4 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300 hover:scale-110"
    >
      {texto}
    </button>
  );
};

export default BotonEnviar;
