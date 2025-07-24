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
          src="/home-4.png"
          priority
          width={800}
          height={800}
          alt="Avatar"
        />
        <div className="flex flex-col justify-center max-w-md">
          <h1 className="mb-5 text-2xl leading-tight text-center md:text-left md:text-4xl md:mb-10">
            Si puedes pensarlo, <br />
            <TypeAnimation
              sequence={[
                "puedes programarlo",
                1000,
                "puedes optimizarlo",
                1000,
                "puedes implementarlo",
                1000,
                "puedes desarrollarlo",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="font-bold text-secondary"
            />
          </h1>

          <p className="mx-auto mb-2 text-xl md:text-xl md:mx-0 md:mb-8">
            Hola! Un placer conocerte, mi nombre es pablo, Soy desarrollador web
            FullStack. Tengo experiencia en tecnologias como React. Nextjs.
            Node.js. Express. Javascript. Typescript, Tailwind y Bootstrap.
            Busco constantemente mejorar mis habilidades y estar a la vanguardia
            de las tendencias tecnológicas.
          </p>

          <div className="flex items-center justify-center gap-3 md:justify-start md:gap-10">
            <a
              href="/nosotros"
              className="px-3 py-2 my-2 transition-all border-2 cursor-pointer text-md w-fit rounded-xl hover:shadow-xl hover:shadow-white/50"
            >
              Nosotros
            </a>
            <a
              href="/contacto"
              className="px-3 py-2 my-5 transition-all border-2 cursor-pointer text-md w-fit text-secondary border-secondary rounded-xl hover:shadow-xl hover:shadow-secondary"
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
