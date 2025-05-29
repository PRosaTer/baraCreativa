import PhotoCarousel from "@/components/slice/page";
import TwoSquares from "@/components/twosquare/page";

export default function Home() {
  return (
    <div className="bg-background">
      <PhotoCarousel />
      {/* Sección existente */}
      <section className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center">
          Bienvenidos a Bara Creativa
        </h1>
        <p className="text-center mt-4">
          Edtech hondureña que ofrece cursos e-learning y presenciales de alto
          impacto.
        </p>
      </section>
      {/* Componente de los dos cuadrados */}
      <TwoSquares />
    </div>
  );
}
