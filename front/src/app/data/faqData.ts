export interface FAQItem {
  question: string;
  keywords: string[];
  answer: string;
  redirectTo?: string;
  buttonText?: string; 
}

export const faqData: FAQItem[] = [
  {
    question: "¿Qué servicios o cursos ofrece Bara Creativa HN?",
    keywords: ["servicios", "cursos", "ofrece", "formacion", "capacitacion"],
    answer: `Nos especializamos en dos segmentos principales:
Para docentes: Cursos en creatividad educativa, liderazgo pedagógico, herramientas tecnológicas y aplicación de IA en el aula.
Áreas de formación profesional: Capacitación en innovación digital, transformación digital, RRHH 4.0, Marketing Digital y ventas estratégicas, Habilidades Blandas.
¡Todo con enfoque práctico y adaptado al contexto latinoamericano!`,
    redirectTo: "/cursos",
    buttonText: "Ver Cursos",
  },
  {
    question: "¿Los cursos son gratuitos o de pago?",
    keywords: ["gratis", "pago", "precio", "costo"],
    answer: `Eventos gratuitos: Realizamos webinars y talleres ocasionales sin costo (¡síguenos en redes para anunciarlos!).
Cursos gratis: En temporadas específicas (ej. inicio de año o back-to-school) lanzamos cursos gratuitos con contenido de valor.
Cursos premium: De pago, con certificación, mentoría y material descargable.`,
    redirectTo: "/cursos",
    buttonText: "Ver Cursos", 
  },
  {
    question: "¿Cómo me inscribo en un curso?",
    keywords: ["inscribir", "inscripcion", "registrar", "registro"],
    answer: `Regístrate en nuestra web.
Selecciona si es un curso para docentes o para áreas profesionales.
Completa el pago y recibirás acceso por correo. ¿Necesitas ayuda? ¡Escríbenos!`,
    redirectTo: "/registro",
    buttonText: "Registrarme",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    keywords: ["pago", "pagos", "metodos", "aceptan", "tarjeta", "paypal", "transferencia"],
    answer: `Aceptamos transferencias bancarias, tarjetas de crédito/débito (Visa, MasterCard) y PayPal.`,
  },
  {
    question: "¿Otorgan certificados?",
    keywords: ["certificado", "certificados", "aval", "certificacion"],
    answer: `¡Sí! Los cursos premium incluyen certificados digitales avalados por Bara Creativa HN. Pregunta también por nuestros certificados avalados internacionalmente.`,
    redirectTo: "/cursos",
    buttonText: "Ver Cursos",
  },
  {
    question: "¿Recibiré un certificado válido para mi carrera docente/profesional?",
    keywords: ["valido", "carrera", "docente", "profesional", "escalafon", "reconocido"],
    answer: `Docentes: Certificado con horas de capacitación (válido para escalafón, según reglamentos locales en cada país).
Profesionales: Certificado digital con habilidades técnicas reconocidas en el mercado.`,
    redirectTo: "/cursos",
    buttonText: "Ver Cursos",
  },
  {
    question: "¿Los cursos tienen horarios fijos?",
    keywords: ["horarios", "fijos", "ritmo", "autodidacta", "vivo"],
    answer: `La mayoría son autodidactas (a tu ritmo), pero algunos talleres incluyen sesiones en vivo con horarios anunciados.`,
  },
  {
    question: "¿Puedo acceder desde mi móvil?",
    keywords: ["movil", "celular", "tablet", "smartphone", "acceso"],
    answer: `¡Claro! Nuestra plataforma es compatible con computadoras, tablets y smartphones.`,
  },
  {
    question: "¿Tienen descuentos?",
    keywords: ["descuentos", "ofertas", "promociones", "discapacidad", "adultos mayores", "grupos"],
    answer: `Sí:
25% para estudiantes con discapacidad y adultos mayores (60 años en adelante).
20% en grupos de 5 personas en adelante. Los grupos no necesariamente tienen que laborar en la misma institución.`,
    redirectTo: "/cursos",
    buttonText: "Ver Cursos",
  },
  {
    question: "¿Qué pasa si no termino mi curso?",
    keywords: ["terminar", "finalizar", "extension", "ilimitado"],
    answer: `Tienes acceso ilimitado, pero si necesitas extensión, contáctanos.`,
  },
  {
    question: "¿Ofrecen cursos para empresas?",
    keywords: ["empresas", "corporativos", "negocios", "planes"],
    answer: `¡Sí! Ofrecemos planes corporativos con precios especiales. Escríbenos a hola@baracreativahn.com.`,
  },
  {
    question: "¿Quiénes son los instructores?",
    keywords: ["instructores", "profesores", "quienes", "equipo"],
    answer: `Profesionales hondureños e internacionales con experiencia en educación y empresarial.`,
  },
  {
    question: "¿Puedo descargar el material?",
    keywords: ["descargar", "material", "recursos", "contenido"],
    answer: `Algunos recursos son descargables (se indican en la descripción del curso).`,
  },
  {
    question: "¿Tienen garantía de reembolso?",
    keywords: ["reembolso", "garantia", "devolucion"],
    answer: `No manejamos reembolsos. Si no podés ingresar o participar de un curso en vivo, podés participar en los siguientes o cuando se adapte a tu tiempo.`,
  },
  {
    question: "¿Cómo contacto al soporte?",
    keywords: ["contacto", "soporte", "ayuda", "whatsapp", "escribir"],
    answer: `Escríbenos a soporte@baracreativahn.com o WhatsApp +504 33351621. Respuesta en máximo 24 horas.`,
  },
  {
    question: "¿Los cursos son solo para hondureños?",
    keywords: ["hondureños", "nacionalidad", "latinoamerica", "paises"],
    answer: `¡No! Aunque somos de Honduras, aceptamos estudiantes de toda Latinoamérica.`,
  },
  {
    question: "¿Tienen bolsa de empleo?",
    keywords: ["empleo", "trabajo", "bolsa"],
    answer: `Por el momento no, pero estamos trabajando en ello.`,
  },
  {
    question: "¿Puedo regalar un curso?",
    keywords: ["regalar", "regalo", "curso"],
    answer: `¡Claro! Compra el curso y envíanos el correo del beneficiario.`,
  },
  {
    question: "¿Cómo actualizan el contenido?",
    keywords: ["actualizan", "actualizar", "contenido", "nuevo"],
    answer: `Revisamos y actualizamos el material cada 6 meses para mantenerlo relevante.`,
  },
  {
    question: "¿Tienen comunidad de estudiantes?",
    keywords: ["comunidad", "estudiantes", "grupo", "telegram"],
    answer: `Sí, únete a nuestro grupo de Telegram para networking y soporte.`,
    redirectTo: "https://t.me/TuGrupoDeTelegram", // aca tenemos que poner el grupo
    buttonText: "Unirme a la Comunidad",
  },
  {
    question: "¿Qué los diferencia de otras EdTech?",
    keywords: ["diferencia", "distingue", "edtech", "enfoque"],
    answer: `Enfoque local: Cursos para docentes y profesionales con casos prácticos latinos. Metodologías disruptivas, sencillas de aplicar.
Educación disruptiva: Combinamos pedagogía innovadora + habilidades digitales.`,
    redirectTo: "/nosotros",
    buttonText: "Sobre Nosotros",
  },
  {
    question: "¿Tienen cursos avalados por la Secretaría de Educación de Honduras?",
    keywords: ["avalados", "secretaria", "educacion", "honduras", "oficial"],
    answer: `Estamos en proceso de certificación oficial. Por ahora, nuestros certificados son válidos para horas de capacitación docente.`,
    redirectTo: "/cursos",
    buttonText: "Ver Cursos",
  },
  {
    question: "¿Cómo me registro?",
    keywords: ["registro", "registrarme", "registrarse", "registración"],
    answer: "Regístrate para acceder a todos los cursos y beneficios:",
    redirectTo: "/registro",
    buttonText: "Registrarme",
  },
  {
    question: "¿Cómo inicio sesión?",
    keywords: ["login", "iniciar sesion", "loguearme", "loguearse"],
    answer: "Inicia sesión en tu cuenta:",
    redirectTo: "/login",
    buttonText: "Iniciar Sesión",
  },
];