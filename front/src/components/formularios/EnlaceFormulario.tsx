import Link from "next/link";
import React from "react";

interface PropsEnlaceFormulario {
  texto: string;
  href: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
}

const EnlaceFormulario: React.FC<PropsEnlaceFormulario> = ({
  texto,
  href,
  className,
  onClick,
  target,
  rel,
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      target={target}
      rel={target === "_blank" && !rel ? "noopener noreferrer" : rel}
      className={`text-blue-500 hover:underline transition duration-200 ${className || ''}`}
    >
      {texto}
    </Link>
  );
};

export default EnlaceFormulario;