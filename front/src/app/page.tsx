import PhotoCarousel from "@/components/slice/page";
import Contenedor_1 from "@/components/contenedor_1/page";
import DynamicContenedor2 from "@/components/DynamicContenedor2/page";
import LogoSlider from "@/components/logoSlider/page";
import ThreeCoursesSection from "@/components/cursos-principales/page";
import ThreeServicesSection from "@/components/servicios-pricipales/page";
import Introduction from "@/components/introduccion/page"; // Asegurate de que esta ruta coincida con la real

export default function Home() {
  return (
    <div className="bg-[var(--background)] font-sans">
      {/* Carrusel de fotos */}
      <PhotoCarousel />
      {/* Sección de texto existente */}
      <section className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center text-[var(--foreground)]">
          Bienvenidos a Bara Creativa
        </h1>
        <p className="text-center mt-4 text-[var(--foreground)]">
          Edtech hondureña que ofrece cursos e-learning y presenciales de alto
          impacto.
        </p>
      </section>
      {/* Sección de los dos contenedores */}
      <section className="container mx-auto py-8 flex flex-col lg:flex-row gap-4 justify-center items-center">
        <Contenedor_1 />
        <DynamicContenedor2 />
      </section>
      {/* Carrusel de marcas */}
      <LogoSlider />
      {/* Sección de tres cursos */}
      <ThreeCoursesSection />
      {/* Sección de tres servicios */}
      <ThreeServicesSection />
      {/* Sección de presentación personal */}
      <Introduction />
    </div>
  );
}
