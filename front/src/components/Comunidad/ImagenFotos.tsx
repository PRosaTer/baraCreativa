import Image from 'next/image';
import { ImagenFoto } from '../../app/types/tipos';

interface Props {
  imagen: ImagenFoto;
}

export const ImagenFotos = ({ imagen }: Props) => {
  const obtenerTamañoImagen = () => {
    if (imagen.isMain) return "clamp(250px, 45vw, 450px)";
    return "clamp(150px, 35vw, 350px)";
  };

  return (
    <div
      className={`absolute ${imagen.classPosition} ${imagen.rotate} transition-all duration-700`}
      style={{
        width: obtenerTamañoImagen(),
        aspectRatio: "1 / 1",
        maxWidth: '85%',
        zIndex: imagen.zIndex,
        transform: imagen.centerTransform ? "translate(-50%, -50%)" : undefined,
      }}
    >
      <Image
        src={imagen.src}
        alt={imagen.alt}
        fill
        className="object-cover rounded-xl shadow-xl"
        priority={imagen.isMain}
        sizes="(max-width: 480px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 35vw"
        quality={80}
      />
    </div>
  );
};