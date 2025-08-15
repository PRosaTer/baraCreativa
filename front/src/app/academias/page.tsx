export default function AcademiasPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white font-sans py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Academia CAT */}
        <section className="border border-white rounded-xl p-6 shadow-md bg-[var(--background)]">
          <div className="flex justify-center">
            <img
              src="/formacion-cat.png"
              alt="Academia CAT"
              className="rounded-lg mb-6 object-cover max-w-md w-full"
            />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            🎓 Academia C.A.T. (Creatividad - Aprendizaje - Tecnología)
          </h2>
          <p className="text-lg mb-4 text-gray-200">
            Transforma tu forma de enseñar con metodologías disruptivas y
            gamificadas diseñadas por y para docentes. ¡Conviértete en el profe
            que siempre quisiste tener!
          </p>
          <p className="text-md text-gray-400 italic">
            Dirigida a: Docentes, capacitadores, conferencistas que desean
            aprender nuevas herramientas y metodologías para lograr un impacto
            en sus alumnos.
          </p>
        </section>

        {/* Academia Dynamys */}
        <section className="border border-white rounded-xl p-6 shadow-md bg-[var(--background)]">
          <div className="flex justify-center">
            <img
              src="/Logotipo-Dynamis-blanco.png"
              alt="Academia Dynamys"
              className="rounded-lg mb-6 object-cover max-w-md w-full"
            />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            🚀 Academia Dynamys HN
          </h2>
          <p className="text-lg mb-4 text-gray-200">
            Potencia tu carrera o negocio con programas en innovación,
            competencias digitales, habilidades blandas, marketing digital,
            Ofimática, Recursos Humanos y más. Desde estudiantes hasta CEOs:
            aquí se forjan los líderes del mañana.
          </p>

          <div className="flex justify-center my-6">
            <a
              href="/cursos"
              className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-300 transition"
            >
              👉 Explora Cursos Profesionales
            </a>
          </div>

          <p className="text-md text-yellow-400 text-center font-medium">
            🔥 Bonus diferencial:
            <br />
            Con certificación internacional + comunidad activa de networking.
          </p>
        </section>
      </div>
    </div>
  );
}
