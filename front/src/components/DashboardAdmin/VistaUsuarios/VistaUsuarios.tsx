"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import useUsuarios from "../../../app/hooks/VistaUsuariosAdmin/useUsuarios";
import ControlesUsuarios from "./ControlesUsuarios";
import EncabezadoUsuarios from "../EncabezadoUsuarios";
import TablaUsuarios from "../TablaUsuarios";
import ModalEditarUsuarioWrapper from "./ModalEditarUsuarioWrapper";
import FiltrosUsuarios from "../FiltrosUsuarios";
import BarraBusquedaUsuarios from "../BarraBusquedaUsuarios";
import InlineToast from "@/components/DashboardUsuario/InlineToast";
import { Usuario } from "@/types/auth";

export default function VistaUsuarios() {
  const { usuarios, actualizarUsuarioEnLista } = useUsuarios();
  const { usuario } = useAuth();

  const [filtro, setFiltro] = useState<"todos" | "conectados" | "desconectados">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string>("");

  const cantidadTotal = usuarios.length;
  const cantidadConectados = usuarios.filter((u) => u.estaConectado).length;
  const cantidadDesconectados = usuarios.filter((u) => !u.estaConectado).length;

  const usuariosFiltrados = usuarios
    .filter((u) =>
      filtro === "conectados" ? u.estaConectado : filtro === "desconectados" ? !u.estaConectado : true
    )
    .filter(
      (u) =>
        u.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correoElectronico.toLowerCase().includes(busqueda.toLowerCase())
    );

  const cerrarEditor = () => setUsuarioEditando(null);


  const manejarExitoEdicion = (mensaje: string) => {
    setMensajeExito(mensaje);
    cerrarEditor();
  };

  return (
    <div className="p-4 flex-1 overflow-auto relative">
      <EncabezadoUsuarios nombreUsuario={usuario?.nombreCompleto || "Usuario"} />

      <ControlesUsuarios
        filtro={filtro}
        setFiltro={setFiltro}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        cantidadTotal={cantidadTotal}
        cantidadConectados={cantidadConectados}
        cantidadDesconectados={cantidadDesconectados}
        FiltrosUsuarios={FiltrosUsuarios}
        BarraBusquedaUsuarios={BarraBusquedaUsuarios}
      />

      <TablaUsuarios usuarios={usuariosFiltrados} onEditar={setUsuarioEditando} />

      <ModalEditarUsuarioWrapper
        usuarioEditando={usuarioEditando}
        cerrarEditor={cerrarEditor}
        actualizarUsuarioEnLista={actualizarUsuarioEnLista}
        onExitoEdicion={manejarExitoEdicion}
      />

      {mensajeExito && (
        <InlineToast
          mensaje={mensajeExito}
          onClose={() => setMensajeExito("")}
          posicion="abajo" 
        />
      )}

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
        `}
      </style>
    </div>
  );
}
