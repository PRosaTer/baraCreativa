"use client";

import React from "react";
import Link from "next/link";

interface BotonConEfectoProps {
  texto: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function BotonConEfecto({
  texto,
  href,
  onClick,
  className,
}: BotonConEfectoProps) {
  const commonClasses = `
    flex items-center justify-center
    bg-red-600 text-white relative overflow-hidden group z-10
    duration-1000 rounded-[1.25rem]  /* 20px */
    h-auto py-2 sm:py-3
    text-xs sm:text-sm md:text-base lg:text-xl
    w-auto min-w-[6rem] max-w-[12rem]
    px-4
    text-center
    whitespace-normal
  `;

  const allClasses = `${commonClasses} ${className || ""}`;

  const buttonContent = (
    <>
      {/* Círculos animados posicionados relativos y centrados */}
      <span className="absolute bg-yellow-300 w-[9rem] h-[9rem] rounded-full group-hover:scale-100 scale-0 -z-10 left-0 top-0 transform -translate-x-1/2 -translate-y-1/2 group-hover:duration-500 duration-700 origin-center transition-all"></span>
      <span className="absolute bg-yellow-500 w-[9rem] h-[9rem] rounded-full group-hover:scale-100 scale-0 -z-10 left-0 top-0 transform -translate-x-1/2 -translate-y-1/2 group-hover:duration-700 duration-500 origin-center transition-all"></span>
      <span className="absolute bg-red-600 w-[9rem] h-[9rem] rounded-full group-hover:scale-100 scale-0 -z-10 left-0 top-0 transform -translate-x-1/2 -translate-y-1/2 group-hover:duration-700 duration-500 origin-center transition-all"></span>
      {texto}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={allClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={allClasses}>
      {buttonContent}
    </button>
  );
}
