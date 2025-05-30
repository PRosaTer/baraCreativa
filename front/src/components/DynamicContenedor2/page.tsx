// components/DynamicContenedor2.tsx
"use client";

import dynamic from "next/dynamic";
import Contenedor_1 from "@/components/contenedor_1/page";

const Contenedor_2 = dynamic(() => import("@/components/contenedor_2/page"), {
  loading: () => <p>Cargando contenido pesado...</p>,
  ssr: false,
});

const DynamicContenedor2: React.FC = () => {
  return (
    <Contenedor_1 bgColor="bg-gray-300">
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Capacitaciones Pesadas</h2>
        <p>Contenido pesado cargado dinámicamente.</p>
        <Contenedor_2 />
      </div>
    </Contenedor_1>
  );
};

export default DynamicContenedor2;
