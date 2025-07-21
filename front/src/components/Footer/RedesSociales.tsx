import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Music4,
  Mail,
} from "lucide-react";
import { FormularioEmailJS } from "./FormularioEmailJS";

const redes = [
  {
    nombre: "Facebook",
    icono: Facebook,
    link: "https://facebook.com/baracreativahn",
  },
  {
    nombre: "Instagram",
    icono: Instagram,
    link: "https://instagram.com/baracreativa_hn",
  },
  {
    nombre: "LinkedIn",
    icono: Linkedin,
    link: "https://linkedin.com/company/gprhonduras/?viewAsMember=true",
  },
  {
    nombre: "YouTube",
    icono: Youtube,
    link: "https://www.youtube.com/@baracreativahn8789",
  },
  {
    nombre: "Spotify",
    icono: Music4,
    link: "https://open.spotify.com/show/71q6aMyU8OUTdBcwFmEogC",
  },
];

export const RedesSociales = () => {
  const [mostrarForm, setMostrarForm] = useState(false);

  return (
    <>
      <div className="flex gap-4 items-center">
        {redes.map(({ nombre, icono: Icon, link }) => (
          <a
            key={nombre}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={nombre}
            className="cursor-pointer text-white hover:text-blue-600 transition"
          >
            <Icon size={32} />
          </a>
        ))}

        <button
          onClick={() => setMostrarForm(true)}
          aria-label="Enviar email"
          className="text-white hover:text-red-500 transition"
        >
          <Mail size={32} />
        </button>
      </div>

      {mostrarForm && (
        <FormularioEmailJS cerrar={() => setMostrarForm(false)} />
      )}
    </>
  );
};
