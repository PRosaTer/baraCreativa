import React from "react";

interface PropsBotonEnviar {
  texto: string;
}

const BotonEnviar: React.FC<PropsBotonEnviar> = ({ texto }) => {
  return (
    <button
      type="submit"
      className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300"
    >
      {texto}
    </button>
  );
};

export default BotonEnviar;