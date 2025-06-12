"use client";

import React, { useState } from "react";
import BotonChat from "./BotonChat";
import VentanaChat from "./VentanaChat";

const Chatbot: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [claveReinicio, setClaveReinicio] = useState(0);

  const reiniciar = () => {
    setClaveReinicio((prev) => prev + 1);
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
        reiniciar={reiniciar}
        cerrar={cerrar}
        minimizar={minimizar}
      />
    </>
  );
};

export default Chatbot;
