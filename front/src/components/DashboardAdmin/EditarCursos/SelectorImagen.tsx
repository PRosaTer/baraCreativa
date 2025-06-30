import React from 'react';

interface Props {
  imagenCurso?: string | null;
  imagenArchivo: File | null;
  onImagenChange: (file: File | null) => void;
}


export default function SelectorImagen({ imagenCurso, imagenArchivo, onImagenChange }: Props) {
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
          src={`http://localhost:3001/uploads/imagenes-cursos/${imagenCurso}`}
          alt="Imagen actual"
          className="mt-2 w-48 h-auto rounded"
        />
      )}
      {imagenArchivo && <p className="mt-2 text-sm text-green-600">{imagenArchivo.name}</p>}
    </div>
  );
}
