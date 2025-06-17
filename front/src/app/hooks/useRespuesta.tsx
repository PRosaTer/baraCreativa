import React from "react";
import Link from "next/link";

const claseBotonBase =
  "block text-white px-4 py-2 rounded font-medium text-sm transition w-full max-w-[240px] text-center";

export const obtenerRespuesta = (mensaje: unknown): React.ReactNode => {
  const texto =
    typeof mensaje === "string" ? mensaje.toLowerCase() : String(mensaje).toLowerCase();

  if (texto.includes("registro") || texto.includes("registrar")) {
    return (
      <div className="flex flex-col gap-2">
        <span>¿Tenés problemas para registrarte?</span>
        <Link href="/registro" passHref>
          <p className={`${claseBotonBase} bg-blue-600 hover:bg-blue-700 cursor-pointer`}>
            Ir a Registro
          </p>
        </Link>
      </div>
    );
  }

  if (texto.includes("cursos") || texto.includes("servicios")) {
    return (
      <div className="flex flex-col gap-2">
        <span>
          Ofrecemos varios cursos y servicios. ¿Querés ver los cursos disponibles?
        </span>
        <Link href="/cursos" passHref>
          <p className={`${claseBotonBase} bg-green-600 hover:bg-green-700 cursor-pointer`}>
            Ver Cursos
          </p>
        </Link>
      </div>
    );
  }

  if (texto.includes("hola")) {
    return (
      <div className="flex flex-col gap-3 mt-2">
        <span>Hola, soy Pepito. ¿En qué te puedo ayudar?</span>

        <Link href="/registro" passHref>
          <p className={`${claseBotonBase} bg-blue-600 hover:bg-blue-700 cursor-pointer`}>
            ¿Tenés problemas para registrarte?
          </p>
        </Link>

        <Link href="/cursos" passHref>
          <p className={`${claseBotonBase} bg-green-600 hover:bg-green-700 cursor-pointer`}>
            Quiero ver los cursos
          </p>
        </Link>

        <Link href="/comunidad" passHref>
          <p className={`${claseBotonBase} bg-purple-600 hover:bg-purple-700 cursor-pointer`}>
            Comunidad
          </p>
        </Link>

        <Link href="/" passHref>
          <p className={`${claseBotonBase} bg-red-600 hover:bg-red-700 cursor-pointer`}>
            Inicio
          </p>
        </Link>

        <a
          href="https://wa.me/50433351621"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-600 underline mt-2 text-center"
        >
          Contactar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span>Perdón, no puedo encontrar una respuesta adecuada.</span>
      <a
        href="https://wa.me/50433351621"
        className="text-sm text-green-600 underline text-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        Comunicate con nosotros
      </a>
      <span className="text-xs text-gray-500 text-center">O reiniciá el chat.</span>
    </div>
  );
};
