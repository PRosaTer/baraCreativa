import React from 'react';

interface Props {
  imagenCurso?: string | null;
  imagenArchivo: File | null;
  onImagenChange: (file: File | null) => void;
}

export default function SelectorImagen({ imagenCurso, imagenArchivo, onImagenChange }: Props) {
  // Se usa la variable de entorno para la URL de la base
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div>
      <label className="block text-gray-700 mb-1">Cambiar imagen</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onImagenChange(e.target.files[0]);
          } else {
            onImagenChange(null);
          }
        }}
      />
      {imagenCurso && !imagenArchivo && (
        <img
          // Usamos la variable de entorno para construir la URL de la imagen
          src={`${backendBaseUrl}/uploads/imagenes-cursos/${imagenCurso}`}
          alt="Imagen actual"
          className="mt-2 w-48 h-auto rounded"
        />
      )}
      {imagenArchivo && <p className="mt-2 text-sm text-green-600">{imagenArchivo.name}</p>}
    </div>
  );
}
