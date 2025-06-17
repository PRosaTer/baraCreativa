import React from "react";
import Link from "next/link";

const claseBotonBase =
  "text-white px-4 py-2 rounded font-medium text-sm transition w-full max-w-[240px] text-center";

export const obtenerRespuesta = (mensaje: string): React.ReactNode => {
  const texto = mensaje.toLowerCase();

  if (texto.includes("registro") || texto.includes("registrar")) {
    return (
      <div className="flex flex-col gap-2">
        <span>¿Tenés problemas para registrarte?</span>
        <Link href="/registro">
          <button className={`${claseBotonBase} bg-blue-600 hover:bg-blue-700`}>
            Ir a Registro
          </button>
        </Link>
      </div>
    );
  }

  if (texto.includes("cursos") || texto.includes("servicios")) {
    return (
      <div className="flex flex-col gap-2">
        <span>Ofrecemos varios cursos y servicios. ¿Querés ver los cursos disponibles?</span>
        <Link href="/cursos">
          <button className={`${claseBotonBase} bg-green-600 hover:bg-green-700`}>
            Ver Cursos
          </button>
        </Link>
      </div>
    );
  }

  if (texto.includes("hola")) {
    return (
      <div className="flex flex-col gap-3 mt-2">
        <span>Hola, soy Pepito. ¿En qué te puedo ayudar?</span>
        <Link href="/registro">
          <button className={`${claseBotonBase} bg-blue-600 hover:bg-blue-700`}>
            ¿Tenés problemas para registrarte?
          </button>
        </Link>
        <Link href="/cursos">
          <button className={`${claseBotonBase} bg-green-600 hover:bg-green-700`}>
            Quiero ver los cursos
          </button>
        </Link>
        <Link href="/comunidad">
          <button className={`${claseBotonBase} bg-purple-600 hover:bg-purple-700`}>
            Comunidad
          </button>
        </Link>
        <Link href="/">
          <button className={`${claseBotonBase} bg-red-600 hover:bg-red-700`}>
            Inicio
          </button>
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
