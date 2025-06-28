import React from "react";

interface Props {
  mensaje: string;
}

const ErrorNoAutorizado: React.FC<Props> = ({ mensaje }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50 p-4">
      <div className="max-w-md w-full bg-white border border-yellow-400 text-yellow-800 rounded-lg shadow-md p-6 text-center font-semibold select-none">
        {mensaje}
        <p className="mt-2 text-sm text-yellow-700">
          Serás redirigido a la página de inicio de sesión en breve...
        </p>
      </div>
    </div>
  );
};

export default ErrorNoAutorizado;
