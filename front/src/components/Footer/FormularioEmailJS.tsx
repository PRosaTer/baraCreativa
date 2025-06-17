"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_m5edo6y";
const TEMPLATE_ID = "template_zzi9x7c";
const USER_ID = "7KJdN14KWUfAS4dn9";

export const FormularioEmailJS = ({ cerrar }: { cerrar: () => void }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState(false);

  const enviarEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(false);

    const templateParams = {
      from_name: nombre,
      from_email: email,
      whatsapp,
      message: mensaje,
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
      .then(() => {
        setExito(true);
        setEnviando(false);
        setNombre("");
        setEmail("");
        setWhatsapp("");
        setMensaje("");
      })
      .catch(() => {
        setError(true);
        setEnviando(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl mb-4">Enviar mensaje</h2>
        {exito && <p className="mb-2 text-green-600">Mensaje enviado con éxito!</p>}
        {error && <p className="mb-2 text-red-600">Error al enviar, intente de nuevo.</p>}
        <form onSubmit={enviarEmail} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="border p-2 rounded text-black"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded text-black"
          />
          <input
            type="tel"
            placeholder="Número de WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
            className="border p-2 rounded text-black"
          />
          <textarea
            placeholder="Mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            className="border p-2 rounded resize-none text-black"
            rows={4}
          />
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={enviando}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
            <button
              type="button"
              onClick={cerrar}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
