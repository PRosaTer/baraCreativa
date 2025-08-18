'use client';

interface Props {
  fotoPerfil?: string | null;
  nombre?: string;
}

export default function FotoPerfil({ fotoPerfil, nombre }: Props) {
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = fotoPerfil ? `${backendBaseUrl}/uploads/perfiles/${fotoPerfil}` : null;

  if (!url) return null;

  return (
    <div className="mb-4 flex justify-center">
      <img
        src={url}
        alt={`Foto de perfil de ${nombre ?? 'usuario'}`}
        className="w-24 h-24 rounded-full object-cover border border-gray-300"
      />
    </div>
  );
}