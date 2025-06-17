import React from "react";
import { X, Minus } from "lucide-react";

interface Props {
  minimizar: () => void;
  cerrar: () => void;
}

const CabeceraChat: React.FC<Props> = ({ minimizar, cerrar }) => (
  <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
    <span className="font-semibold">Soy Pepito y estoy para ayudarte</span>
    <div className="flex gap-2">
      <button onClick={minimizar}><Minus size={16} /></button>
      <button onClick={cerrar}><X size={16} /></button>
    </div>
  </div>
);

export default CabeceraChat;
