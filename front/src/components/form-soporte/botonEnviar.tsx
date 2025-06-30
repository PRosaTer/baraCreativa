import React from "react";

interface PropsBotonEnviar {
  texto: string;
}

const BotonEnviar: React.FC<PropsBotonEnviar> = ({ texto }) => {
  return (
    <button
      type="submit"
      className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
    >
      {texto}
    </button>
  );
};

export default BotonEnviar;
