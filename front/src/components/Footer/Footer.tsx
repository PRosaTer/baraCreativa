"use client";

import { SeccionLink } from "./SeccionLink";
import { RedesSociales } from "./RedesSociales";
import { PopupInformativo } from "./PopupInformativo";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white w-full max-w-auto h-[274px] mx-auto px-8 py-6 flex flex-col justify-between">
      <div className="flex flex-wrap justify-between gap-6">
        <div className="flex flex-col gap-2">
          <SeccionLink texto="Cursos" href="/cursos" />
          <SeccionLink texto="Comunidad" href="/comunidad" />
          <SeccionLink texto="Sobre nosotros" href="/nosotros" />
          <PopupInformativo
            titulo="¿Qué es EdTech?"
            url="https://observatorio.tec.mx/que-es-edtech-video/" // No me tengo que olvidar de agregar el link cuando Victor me lo pase
          />
          <PopupInformativo
            titulo="Beneficios de estudiar en una edtech"
            url="https://dplnews.com/como-edtech-ayudan-a-mejorar-empleabilidad-en-america-latina/" // No me tengo que olvidar de agregar el link cuando Victor me lo pase
          />
        </div>

        <RedesSociales />
      </div>

      <p className="text-sm text-gray-400 text-center mt-4">
        © {new Date().getFullYear()} Bara Creativa. Todos los derechos reservados.
      </p>
    </footer>
  );
}
