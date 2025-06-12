"use client";

import React, { useState } from "react";
import Mensaje from "./Mensaje";
import { X, Minus } from "lucide-react";

interface Props {
  visible: boolean;
  reiniciar: () => void;
  cerrar: () => void;
  minimizar: () => void;
}

const respuestas: { [clave: string]: string } = {
  hola: "Hola, soy Pepito. ¿En qué te puedo ayudar?",
  país: "Dime, ¿en qué país te encuentras?",
};

const VentanaChat: React.FC<Props> = ({
  visible,
  reiniciar,
  cerrar,
  minimizar,
}) => {
  const [conversacion, setConversacion] = useState<
    { texto: string; emisor: "pepito" | "usuario" }[]
  >([]);
  const [entrada, setEntrada] = useState("");

  if (!visible) return null;

  const responder = (mensaje: string) => {
    const texto = mensaje.toLowerCase();
    const clave = Object.keys(respuestas).find((k) => texto.includes(k));

    const respuesta = clave
      ? respuestas[clave]
      : "Perdón, no puedo encontrar una respuesta adecuada. Usa el botón de WhatsApp o reinicia el chat.";

    setConversacion((prev) => [
      ...prev,
      { texto: mensaje, emisor: "usuario" },
      { texto: respuesta, emisor: "pepito" },
    ]);

    const audio = new Audio("/sonidos/NotificacionChatbot.mp4");
    audio.volume = 0.2;
    audio.play();

    setEntrada("");
  };

  return (
    <div className="fixed bottom-20 right-2 w-72 md:w-80 bg-white border border-gray-300 shadow-xl rounded-md flex flex-col z-50 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Pepito</span>
        <div className="flex gap-2">
          <button onClick={minimizar}>
            <Minus size={16} />
          </button>
          <button onClick={cerrar}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col p-3 gap-1 h-64 overflow-y-auto">
        {conversacion.map((msg, i) => (
          <Mensaje key={i} {...msg} />
        ))}
      </div>

      <div className="flex border-t p-2 gap-2 items-center">
        <input
          type="text"
          className="flex-grow border rounded-md p-1 text-sm"
          placeholder="Escribe tu mensaje..."
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && entrada.trim()) {
              responder(entrada);
            }
          }}
        />
        <button
          className="text-blue-600 font-bold text-sm"
          onClick={() => entrada.trim() && responder(entrada)}
        >
          Enviar
        </button>
      </div>

      <div className="text-center py-1">
        <button onClick={reiniciar} className="text-xs text-gray-500 underline">
          Reiniciar chat
        </button>
      </div>
    </div>
  );
};

export default VentanaChat;
