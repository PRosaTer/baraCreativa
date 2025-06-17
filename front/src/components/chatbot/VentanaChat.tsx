"use client";

import React, { useEffect, useRef } from "react";
import Mensaje from "./Mensaje";
import ChatInput from "./ChatInput";
import CabeceraChat from "./CabeceraChat";
import { obtenerRespuesta } from "../../app/hooks/useRespuesta";

interface MensajeTipo {
  texto: React.ReactNode;
  emisor: "pepito" | "usuario";
}

interface Props {
  visible: boolean;
  mensajes: MensajeTipo[];
  setMensajes: React.Dispatch<React.SetStateAction<MensajeTipo[]>>;
  reiniciar: () => void;
  cerrar: () => void;
  minimizar: () => void;
  registrado: boolean;
}

const VentanaChat: React.FC<Props> = ({
  visible,
  mensajes,
  setMensajes,
  reiniciar,
  cerrar,
  minimizar,
}) => {
  const mensajesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  if (!visible) return null;

  const responder = (entrada: string) => {
    if (!entrada.trim()) return;

    const respuesta = obtenerRespuesta(entrada);
    console.log("Respuesta de Pepito:", respuesta);

    setMensajes((prev) => [
      ...prev,
      { texto: entrada, emisor: "usuario" },
      { texto: respuesta, emisor: "pepito" },
    ]);

    const audio = new Audio("/sonidos/NotificacionChatbot.mp4");
    audio.volume = 0.2;
    audio.play();
  };

  return (
    <div
      className="
        fixed
        right-2
        w-72 md:w-80
        max-h-[80vh] min-h-[450px]
        bg-white border border-gray-300 shadow-xl rounded-md
        flex flex-col
        z-50 overflow-hidden

        bottom-4      /* móviles */
        md:bottom-10  /* notebooks */
        xl:bottom-4  /* monitores grandes */
      "
    >
      <CabeceraChat minimizar={minimizar} cerrar={cerrar} />
      <div
        ref={mensajesRef}
        className="flex flex-col p-3 gap-1 flex-1 overflow-y-auto"
      >
        {mensajes.map((msg, i) => (
          <Mensaje key={i} texto={msg.texto} emisor={msg.emisor} />
        ))}
      </div>
      <ChatInput onEnviar={responder} />
      <div className="text-center py-1">
        <button onClick={reiniciar} className="text-xs text-gray-500 underline">
          Reiniciar chat
        </button>
      </div>
    </div>
  );
};

export default VentanaChat;
