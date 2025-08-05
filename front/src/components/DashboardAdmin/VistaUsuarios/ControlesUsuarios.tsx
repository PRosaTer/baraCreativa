"use client";

import React from "react";


interface FiltrosUsuariosProps {
  filtro: "todos" | "conectados" | "desconectados";
  setFiltro: React.Dispatch<React.SetStateAction<"todos" | "conectados" | "desconectados">>;
  cantidadTotal: number;
  cantidadConectados: number;
  cantidadDesconectados: number;
}


interface BarraBusquedaUsuariosProps {
  valor: string;
  onCambio: React.Dispatch<React.SetStateAction<string>>;
}


interface Props {
  filtro: "todos" | "conectados" | "desconectados";
  setFiltro: React.Dispatch<React.SetStateAction<"todos" | "conectados" | "desconectados">>;
  busqueda: string;
  setBusqueda: React.Dispatch<React.SetStateAction<string>>;
  cantidadTotal: number;
  cantidadConectados: number;
  cantidadDesconectados: number;
  FiltrosUsuarios: React.FC<FiltrosUsuariosProps>;
  BarraBusquedaUsuarios: React.FC<BarraBusquedaUsuariosProps>;
}

export default function ControlesUsuarios({
  filtro,
  setFiltro,
  busqueda,
  setBusqueda,
  cantidadTotal,
  cantidadConectados,
  cantidadDesconectados,
  FiltrosUsuarios,
  BarraBusquedaUsuarios,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 my-4">
      <div className="flex items-center gap-2 flex-wrap">
        <FiltrosUsuarios
          filtro={filtro}
          setFiltro={setFiltro}
          cantidadTotal={cantidadTotal}
          cantidadConectados={cantidadConectados}
          cantidadDesconectados={cantidadDesconectados}
        />
        <div className="w-60">
          <BarraBusquedaUsuarios valor={busqueda} onCambio={setBusqueda} />
        </div>
      </div>
    </div>
  );
}