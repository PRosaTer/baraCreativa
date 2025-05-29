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
        {/* Contenedor 1: Contenido ligero */}
        <Contenedor_1 bgColor="bg-gray-200">
          <div className="text-center p-4">
            <h2 className="text-2xl font-bold mb-4">Cursos E-Learning</h2>
            <p>
              Explora nuestros cursos en línea diseñados para tu crecimiento.
            </p>
            <ul className="mt-4 space-y-2">
              <li>Curso de Desarrollo Web</li>
              <li>Curso de Marketing Digital</li>
              <li>Curso de Diseño Gráfico</li>
            </ul>
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
