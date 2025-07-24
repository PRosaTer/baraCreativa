interface MensajeFinalProps {
  mostrar: boolean;
}

export default function MensajeFinal({ mostrar } : MensajeFinalProps){
  if (!mostrar) return null;

  return (
    <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
      Felicidades por completar el curso, ya tenes disponible el certificado en tu perfil
    </div>
  );
};
