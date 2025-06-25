import React from 'react';

interface Props {
  nombreUsuario: string;
}

const EncabezadoUsuarios: React.FC<Props> = ({ nombreUsuario }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-black">Usuarios Registrados</h2>
      <div
        className="text-xl font-semibold bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent select-none"
        style={{
          backgroundSize: '200% auto',
          animation: 'gradientShift 3s linear infinite',
        }}
      >
        Buenas, {nombreUsuario}
      </div>
    </div>
  );
};

export default EncabezadoUsuarios;
