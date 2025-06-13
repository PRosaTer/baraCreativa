import React from "react";

export const obtenerRespuesta = (mensaje: string): React.ReactNode => {
  const texto = mensaje.toLowerCase();

  const keywordsServicios = [
    "servicios",
    "servicio",
    "que ofrecen",
    "qué ofrecen",
    "ofrecen servicios",
    "que ofrecen ustedes",
    "qué ofrecen ustedes",
    "qué ofrecen acá",
    "que ofrecen acá",
  ];

  if (texto.includes("hola") && keywordsServicios.some((k) => texto.includes(k))) {
    return (
      <>
        Hola, soy Pepito y ofrecemos{" "}
        <a
          href="/cursos"
          className="text-blue-600 underline hover:text-blue-800"
          rel="noopener noreferrer"
        >
          servicios
        </a>{" "}
        y{" "}
        <a
          href="/cursos"
          className="text-blue-600 underline hover:text-blue-800"
          rel="noopener noreferrer"
        >
          cursos
        </a>
        .
      </>
    );
  }

  if (texto.includes("hola")) {
    return "Hola, soy Pepito. ¿En qué te puedo ayudar?";
  }

  if (keywordsServicios.some((k) => texto.includes(k))) {
    return (
      <>
        Ofrecemos{" "}
        <a
          href="/cursos"
          className="text-blue-600 underline hover:text-blue-800"
          rel="noopener noreferrer"
        >
          servicios
        </a>{" "}
        y{" "}
        <a
          href="/cursos"
          className="text-blue-600 underline hover:text-blue-800"
          rel="noopener noreferrer"
        >
          cursos
        </a>
        .
      </>
    );
  }

  return (
    <>
      Perdón, no puedo encontrar una respuesta adecuada.{" "}
      <a
        href="https://wa.me/50433351621"
        className="text-green-600 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Usa el botón de WhatsApp
      </a>{" "}
      o reinicia el chat.
    </>
  );
};
