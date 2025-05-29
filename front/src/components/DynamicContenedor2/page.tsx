// components/DynamicContenedor2.tsx
"use client";

import dynamic from "next/dynamic";

// Importamos dinámicamente Contenedor_2
const Contenedor_2 = dynamic(() => import("@/components/contenedor_2/page"), {
  loading: () => <p>Cargando contenido pesado...</p>,
  ssr: false, // Ahora esto es válido porque estamos en un Client Component
});

const DynamicContenedor2: React.FC = () => {
  return <Contenedor_2 />;
};

export default DynamicContenedor2;
