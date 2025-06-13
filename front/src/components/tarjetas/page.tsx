import React from "react";
import Image from "next/image";

interface CardProps {
  title: string;
  image: string;
  description: string;
  buttonText?: string; // Opcional, para agregar un botón en el futuro
  onButtonClick?: () => void; // Opcional, para manejar el click del botón
}

const Card: React.FC<CardProps> = ({
  title,
  image,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <Image
        src={image}
        alt={title}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        {buttonText && onButtonClick && (
          <button
            className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
