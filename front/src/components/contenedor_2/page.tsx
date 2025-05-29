// components/HeavyComponent.jsx
"use client";

import React from "react";
import Image from "next/image";

const HeavyComponent = () => {
  return (
    <div className="mt-4">
      <p>Este es un componente pesado (ejemplo).</p>
      <div className="relative w-32 h-32 mx-auto">
        <Image
          src="/Facebook-Logo-Transparent-PNG.png"
          alt="Contenido pesado"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default HeavyComponent;
