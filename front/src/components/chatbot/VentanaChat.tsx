"use client";

import React, { useState, useEffect, useRef } from "react";
import Mensaje from "./Mensaje";
import ChatInput from "./ChatInput";
import CabeceraChat from "./CabeceraChat";
import { obtenerRespuesta } from "../../app/hooks/useRespuesta";

interface Props {
  visible: boolean;
  reiniciar: () => void;
  cerrar: () => void;
  minimizar: () => void;
}

const VentanaChat: React.FC<Props> = ({
  visible,
  reiniciar,
  cerrar,
  minimizar,
}) => {
  const [conversacion, setConversacion] = useState<
    { texto: React.ReactNode; emisor: "pepito" | "usuario" }[]
  >([]);
  const [entrada, setEntrada] = useState("");

  const mensajesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [conversacion]);

  if (!visible) return null;

  const responder = () => {
    if (!entrada.trim()) return;

    const respuesta = obtenerRespuesta(entrada);

    setConversacion((prev) => [
      ...prev,
      { texto: entrada, emisor: "usuario" },
      { texto: respuesta, emisor: "pepito" },
    ]);

    const audio = new Audio("/sonidos/NotificacionChatbot.mp4");
    audio.volume = 0.2;
    audio.play();

    setEntrada("");
  };

  return (
    <div className="fixed bottom-20 right-2 w-72 md:w-80 bg-white border border-gray-300 shadow-xl rounded-md flex flex-col z-50 overflow-hidden">
      <CabeceraChat minimizar={minimizar} cerrar={cerrar} />
      <div
        ref={mensajesRef}
        className="flex flex-col p-3 gap-1 h-64 overflow-y-auto"
      >
        {conversacion.map((msg, i) => (
          <Mensaje key={i} texto={msg.texto} emisor={msg.emisor} />
        ))}
      </div>
      <ChatInput entrada={entrada} setEntrada={setEntrada} onEnviar={responder} />
      <div className="text-center py-1">
        <button onClick={reiniciar} className="text-xs text-gray-500 underline">
          Reiniciar chat
        </button>
      </div>
    </div>
  );
};

export default VentanaChat;
