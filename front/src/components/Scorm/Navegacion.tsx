interface NavegacionProps {
  onNavigate: (direccion: 'prev' | 'next') => void;
  disablePrev: boolean;
  disableNext: boolean;
}

export default function Navegacion({ onNavigate, disablePrev, disableNext }: NavegacionProps) {
  return (
    <div className="flex justify-between gap-4 mt-6">
      <button
        onClick={() => onNavigate('prev')}
        disabled={disablePrev}
        className="px-6 py-3 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <button
        onClick={() => onNavigate('next')}
        disabled={disableNext}
        className="px-6 py-3 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
