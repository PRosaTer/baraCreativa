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
        <Contenedor_1 />
        
        <DynamicContenedor2 />
      </section>
    </div>
  );
}
