"use client";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const FondoParticulas = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    init && (
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          id="tsparticles"
          options={{
            fullScreen: { enable: false },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "repulse" },
              },
              modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
              },
            },
            particles: {
              color: { value: "#000000" },
              links: {
                color: "#f5f5f5",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "bottom",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 0.5,
                straight: false,
              },
              number: {
                density: { enable: true },
                value: 80,
              },
              opacity: { value: 0.5 },
              shape: { type: "polygon" },
              size: { value: { min: 1, max: 5 } },
            },
            detectRetina: true,
          }}
        />
      </div>
    )
  );
};

export default FondoParticulas;
