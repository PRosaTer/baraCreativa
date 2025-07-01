'use client';

import React, { useState } from 'react';

interface Props {
  onUploadScormPackage: (file: File) => void;
}

export default function ScormUploader({ onUploadScormPackage }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const archivo = e.target.files[0];
      if (archivo.name.endsWith('.zip')) {
        setFile(archivo);
        setError(null);
        onUploadScormPackage(archivo);
      } else {
        setError('El archivo debe ser un .zip');
        setFile(null);
      }
    }
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Subir archivo SCORM (.zip)</label>
      <input type="file" accept=".zip" onChange={handleChange} />
      {file && <p className="mt-2 text-green-600">{file.name}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
