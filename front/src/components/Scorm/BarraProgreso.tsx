interface BarraProgresoProps {
  progreso: number;
}

export default function BarraProgreso({ progreso }: BarraProgresoProps){
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
      <div
        className="bg-green-500 h-4 rounded-full text-right pr-2 text-xs text-white"
        style={{ width: `${progreso}%`, transition: 'width 0.3s ease-in-out' }}
      >
        {progreso}%
      </div>
    </div>
  );
};
