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
      className={`text-blue-500 hover:underline transition duration-200 ${className}`}
    >
      {texto}
    </Link>
  );
};

export default EnlaceFormulario;
