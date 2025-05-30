// app/page.tsx
import PhotoCarousel from "@/components/slice/page";
import Contenedor_1 from "@/components/contenedor_1/page";
import DynamicContenedor2 from "@/components/DynamicContenedor2/page";

export default function Home() {
  return (
    <div className="bg-background">
      {/* Carrusel */}
      <PhotoCarousel />
      {/* Sección de texto existente */}
      <section className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center">
          Bienvenidos a Bara Creativa
        </h1>
        <p className="text-center mt-4">
          Edtech hondureña que ofrece cursos e-learning y presenciales de alto
          impacto.
        </p>
      </section>
      {/* Sección de los dos contenedores */}
      <section className="container mx-auto py-8 flex flex-col md:flex-row gap-4">
        {/* Contenedor 1: Contenido ligero, ahora más innovador */}
        <Contenedor_1 bgColor="bg-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
              ¿Por qué elegirnos?
            </h2>
            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tarjeta 1 */}
              <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
                <span className="text-2xl">🎮</span>
                <div>
                  <h3 className="font-semibold text-blue-600">
                    Capacitaciones que no aburren
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cursos interactivos donde cada lección se siente como un
                    desafío superado.
                  </p>
                </div>
              </div>
              {/* Tarjeta 2 */}
              <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-semibold text-blue-600">
                    Resultados medibles
                  </h3>
                  <p className="text-sm text-gray-600">
                    Analizamos datos en tiempo real para ajustar el aprendizaje
                    a tus necesidades.
                  </p>
                </div>
              </div>
              {/* Tarjeta 3 */}
              <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
                <span className="text-2xl">🖥️</span>
                <div>
                  <h3 className="font-semibold text-blue-600">
                    Tecnología accesible
                  </h3>
                  <p className="text-sm text-gray-600">
                    Plataforma intuitiva que reduce la curva de aprendizaje para
                    docentes y empresas.
                  </p>
                </div>
              </div>
              {/* Tarjeta 4 */}
              <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-semibold text-blue-600">
                    Productividad inmediata
                  </h3>
                  <p className="text-sm text-gray-600">
                    Microlecciones aplicables desde el primer día, optimizando
                    tiempo y recursos.
                  </p>
                </div>
              </div>
              {/* Tarjeta 5 */}
              <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow sm:col-span-2">
                <span className="text-2xl">🌟</span>
                <div>
                  <h3 className="font-semibold text-blue-600">
                    Bienestar educativo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Dinámicas que reducen el estrés y motivan a equipos y
                    profesores.
                  </p>
                </div>
              </div>
            </div>
            {/* Frase final destacada */}
            <div className="mt-6 bg-blue-100 text-blue-800 rounded-lg py-3 px-4 text-center italic font-medium">
              En Bara Creativa no solo aprendes: jugás, creces y transformas tu
              realidad.
            </div>
          </div>
        </Contenedor_1>
        {/* Contenedor 2: Contenido pesado */}
        <Contenedor_1 bgColor="bg-gray-300">
          <div className="text-center p-4">
            <h2 className="text-2xl font-bold mb-4">Capacitaciones Pesadas</h2>
            <p>Contenido pesado cargado dinámicamente.</p>
            <DynamicContenedor2 />
          </div>
        </Contenedor_1>
      </section>
    </div>
  );
}
