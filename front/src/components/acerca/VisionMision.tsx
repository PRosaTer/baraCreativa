interface VisionMisionProps {
  vision: string;
  mision: string;
}

export default function VisionMision({ vision, mision }: VisionMisionProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Nuestra Esencia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visión */}
          <div className="tarjeta-voltear h-64">
            <div className="tarjeta-voltear-interior">
              <div className="tarjeta-voltear-frente bg-blue-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-center">
                <h3 className="text-2xl font-semibold">Nuestra Visión</h3>
              </div>
              <div className="tarjeta-voltear-reverso bg-blue-100 text-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
                <p className="text-center">{vision}</p>
              </div>
            </div>
          </div>
          {/* Misión */}
          <div className="tarjeta-voltear h-64">
            <div className="tarjeta-voltear-interior">
              <div className="tarjeta-voltear-frente bg-orange-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-center">
                <h3 className="text-2xl font-semibold">Nuestra Misión</h3>
              </div>
              <div className="tarjeta-voltear-reverso bg-orange-100 text-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
                <p className="text-center">{mision}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .tarjeta-voltear {
          perspective: 1000px;
        }
        .tarjeta-voltear-interior {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .tarjeta-voltear:hover .tarjeta-voltear-interior {
          transform: rotateY(180deg);
        }
        .tarjeta-voltear-frente,
        .tarjeta-voltear-reverso {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .tarjeta-voltear-reverso {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
}
