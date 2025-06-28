"use client";

interface Props {
  fotoPerfil?: string | null;
  nombre?: string;
}

export default function FotoPerfil({ fotoPerfil, nombre }: Props) {
  if (!fotoPerfil) return null;

  return (
    <div className="mb-4 flex justify-center">
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/perfiles/${fotoPerfil}`}
        alt={`Foto de perfil de ${nombre ?? "usuario"}`}
        className="w-24 h-24 rounded-full object-cover border border-gray-300"
      />
    </div>
  );
}
