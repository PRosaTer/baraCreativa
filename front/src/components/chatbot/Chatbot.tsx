"use client";

import React, { useState, useEffect } from "react";
import BotonChat from "./BotonChat";
import VentanaChat from "./VentanaChat";

const STORAGE_KEY = "pepito_chat_memory";

interface MensajeTipo {
  texto: React.ReactNode;
  emisor: "pepito" | "usuario";
  tipo?: "normal" | "botones";
  opciones?: string[];
}

const Chatbot: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [mensajes, setMensajes] = useState<MensajeTipo[]>([]);
  const [claveReinicio, setClaveReinicio] = useState(0);
  const [registrado] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMensajes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mensajes));
  }, [mensajes]);

  const reiniciar = () => {
    setMensajes([]);
    setClaveReinicio((prev) => prev + 1);
    localStorage.removeItem(STORAGE_KEY);
  };

  const cerrar = () => {
    setVisible(false);
  };

  const minimizar = () => {
    setVisible(false);
  };

  return (
    <>
      {!visible && <BotonChat alHacerClick={() => setVisible(true)} />}
      <VentanaChat
        key={claveReinicio}
        visible={visible}
        mensajes={mensajes}
        setMensajes={setMensajes}
        reiniciar={reiniciar}
        cerrar={cerrar}
        minimizar={minimizar}
        registrado={registrado}
      />
    </>
  );
};

export default Chatbot;
