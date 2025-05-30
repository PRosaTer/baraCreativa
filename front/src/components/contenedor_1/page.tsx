// components/Contenedor_1.tsx
"use client";

import React from "react";

interface Contenedor1Props {
  children: React.ReactNode;
  bgColor?: string;
}

const Contenedor_1: React.FC<Contenedor1Props> = ({
  children,
  bgColor = "bg-gray-200",
}) => {
  return (
    <div
      className={`w-full md:w-1/2 h-[32rem] ${bgColor} rounded-lg flex items-center justify-center`}
    >
      {children}
    </div>
  );
};

export default Contenedor_1;
