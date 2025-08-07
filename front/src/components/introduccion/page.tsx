"use client";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import FondoParticulas from "@/components/fondoParticulas/page";

const Introduction = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Fondo animado */}
      <FondoParticulas />

      <div className="relative z-10 grid items-center h-full p-6 py-20 md:py-0 md:grid-cols-2">
        <Image
          src="/Victor-animado-transparente.png"
          priority
          width={800}
          height={800}
          alt="Avatar"
        />
        <div className="flex flex-col justify-center max-w-md">
          <h1 className="mb-5 text-2xl leading-tight text-center md:text-left md:text-4xl md:mb-10">
            Si puedes imaginarlo, <br />
            <TypeAnimation
              sequence={[
                "puedes aprenderlo",
                1000,
                "puedes enseñarlo",
                1000,
                "puedes crearlo con nosotros",
                1000,
                "puedes transformarlo en conocimiento",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="font-bold text-yellow-400"
            />
          </h1>

          <p className="mx-auto mb-2 text-xl md:text-xl md:mx-0 md:mb-8">
            ¡Hola! Un placer conocerte, mi nombre es Víctor y soy el fundador de
            Bara Creativa, una academia digital enfocada en transformar la
            educación a través de la tecnología. Combinamos herramientas como la
            gamificación, la inteligencia artificial y el diseño interactivo
            para crear experiencias de aprendizaje innovadoras, dinámicas y
            accesibles. Buscamos constantemente mejorar nuestras metodologías
            para mantenernos a la vanguardia y brindar una educación más
            atractiva, inclusiva y efectiva para todos.
          </p>

          <div className="flex items-center justify-center gap-3 md:justify-start md:gap-10">
            <a
              href="https://www.linkedin.com/in/victorpadillarodriguez/"
              className="px-4 py-2 my-2 w-fit rounded-xl text-yellow-400 border-2 border-yellow-400 text-md font-semibold
               transition-all duration-300 ease-in-out
               hover:bg-yellow-400 hover:text-black
               hover:scale-110 hover:shadow-yellow-400 hover:shadow-[0_0_20px_5px_rgba(253,224,71,0.6)]
               hover:rotate-1 active:scale-95"
            >
              Más sobre mí
            </a>

            <a
              href="/contacto"
              className="px-4 py-2 my-5 w-fit rounded-xl text-yellow-400 border-2 border-yellow-400 text-md font-semibold
               transition-all duration-300 ease-in-out
               hover:bg-yellow-400 hover:text-black
               hover:scale-110 hover:shadow-yellow-400 hover:shadow-[0_0_20px_5px_rgba(253,224,71,0.6)]
               hover:-rotate-1 active:scale-95"
            >
              Contacta con nosotros
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
