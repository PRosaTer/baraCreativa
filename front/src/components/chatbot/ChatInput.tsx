import React, { useState } from "react";

interface Props {
  onEnviar: (texto: string) => void;
}

const ChatInput: React.FC<Props> = ({ onEnviar }) => {
  const [entrada, setEntrada] = useState("");

  const manejarEnviar = () => {
    if (!entrada.trim()) return;
    onEnviar(entrada);
    setEntrada("");
  };

  return (
    <div className="p-2 border-t border-gray-300">
      <input
        type="text"
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        className="w-full border rounded px-2 py-1"
        placeholder="Escribe tu mensaje..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            manejarEnviar();
          }
        }}
      />
      <button onClick={manejarEnviar} className="mt-1 px-3 py-1 bg-blue-500 text-white rounded">
        Enviar
      </button>
    </div>
  );
};

export default ChatInput;
