import Link from "next/link";
import React from "react";

interface PropsEnlaceFormulario {
  texto: string;
  href: string;
  className?: string;
}

const EnlaceFormulario: React.FC<PropsEnlaceFormulario> = ({
  texto,
  href,
  className,
}) => {
  return (
    <Link
      href={href}
      className={`text-yellow-400 font-bold hover:text-red-500 hover:underline transition duration-300 drop-shadow-md ${className}`}
    >
      {texto}
    </Link>
  );
};

export default EnlaceFormulario;
