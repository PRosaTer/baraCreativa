import React from "react";

interface Props {
  correo: string;
  setCorreo: (value: string) => void;
  manejarSubmit: (e: React.FormEvent) => void;
  mensaje: string;
  error: string;
}

const FormularioReset: React.FC<Props> = ({
  correo,
  setCorreo,
  manejarSubmit,
  mensaje,
  error,
}) => {
  return (
    <form onSubmit={manejarSubmit} className="space-y-5">
      <div>
        <label className="block text-sm text-gray-200 mb-1">Correo electrónico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          className="w-full px-4 py-2 bg-black/50 text-cyan-200 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 rounded-lg shadow-lg transition transform hover:scale-105"
      >
        Enviar enlace
      </button>
      {mensaje && (
        <p className="mt-4 text-green-400 text-center">{mensaje}</p>
      )}
      {error && (
        <p className="mt-4 text-red-500 text-center">{error}</p>
      )}
    </form>
  );
};

export default FormularioReset;
