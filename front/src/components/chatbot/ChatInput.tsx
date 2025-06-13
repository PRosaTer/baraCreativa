import React from "react";

interface Props {
  entrada: string;
  setEntrada: (valor: string) => void;
  onEnviar: () => void;
}

const ChatInput: React.FC<Props> = ({ entrada, setEntrada, onEnviar }) => (
  <div className="flex border-t p-2 gap-2 items-center">
    <input
      type="text"
      className="flex-grow border rounded-md p-1 text-sm"
      placeholder="Escribe tu mensaje..."
      value={entrada}
      onChange={(e) => setEntrada(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && entrada.trim() && onEnviar()}
    />
    <button
      className="text-blue-600 font-bold text-sm"
      onClick={() => entrada.trim() && onEnviar()}
    >
      Enviar
    </button>
  </div>
);

export default ChatInput;
