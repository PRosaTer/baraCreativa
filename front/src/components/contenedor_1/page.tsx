// components/Square.jsx
"use client";

import React from "react";

interface SquareProps {
  children: React.ReactNode;
  bgColor?: string;
}

const Square: React.FC<SquareProps> = ({
  children,
  bgColor = "bg-gray-200",
}) => {
  return (
    <div
      className={`w-full md:w-1/2 h-96 ${bgColor} rounded-lg flex items-center justify-center`}
    >
      {children}
    </div>
  );
};

export default Square;
