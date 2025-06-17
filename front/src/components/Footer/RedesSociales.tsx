import React, { useState } from "react";
import Image from "next/image";
import { FormularioEmailJS } from "./FormularioEmailJS";

const redes = [
  { nombre: "Facebook", icono: "/Facebook.logo.png", link: "https://facebook.com/baracreativahn" },
  { nombre: "Instagram", icono: "/instagram.logo.png", link: "https://instagram.com/baracreativa_hn" },
  { nombre: "LinkedIn", icono: "/linkedin.logo.png", link: "https://linkedin.com/company/gprhonduras/?viewAsMember=true" },
  { nombre: "YouTube", icono: "/youtube.logo.png", link: "https://www.youtube.com/@baracreativahn8789" },
  { nombre: "Spotify", icono: "/spotify.logo.png", link: "https://open.spotify.com/show/71q6aMyU8OUTdBcwFmEogC" },

];

export const RedesSociales = () => {
  const [mostrarForm, setMostrarForm] = useState(false);

  return (
    <>
      <div className="flex gap-4 items-center">
        {redes.map(({ nombre, icono, link }) => (
          <a
            key={nombre}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <Image src={icono} alt={`${nombre} logo`} width={50} height={50} />
          </a>
        ))}

        <button onClick={() => setMostrarForm(true)} aria-label="Enviar email">
          <Image
            src="/gmail.logo.png"
            alt="Gmail logo"
            width={50}
            height={50}
            className="cursor-pointer"
          />
        </button>
      </div>

      {mostrarForm && <FormularioEmailJS cerrar={() => setMostrarForm(false)} />}
    </>
  );
};
