// /lib/data.ts

// Interfaz para los cursos
export interface Course {
    id: number;
    title: string;
    image: string;
    description: string;
    details: {
        duration: string;
        content: string;
        instructor: string;
        price: string;
        modules: string[];
    };
}

// Interfaz para los servicios
export interface Service {
    title: string;
    image: string;
    description: string;
}

// Datos de los cursos
export const additionalCourses: Course[] = [
    {
        id: 1,
        title: "FORMACION CAT",
        image: "/formacion-cat.png",
        description: "Aprende Node.js y Express para construir APIs robustas.",
        details: {
            duration: "6 semanas",
            content: "Este curso cubre Node.js, Express, y cómo construir APIs RESTful.",
            instructor: "Juan Pérez",
            price: "$200",
            modules: ["Introducción a Node.js", "Express y Rutas", "APIs RESTful"],
        },
    },
    {
        id: 2,
        title: "DEMENTES VERDES",
        image: "/dementes-verdas.png",
        description: "Domina técnicas de fotografía con cámaras digitales.",
        details: {
            duration: "4 semanas",
            content: "Aprende composición, iluminación y edición fotográfica.",
            instructor: "Ana Gómez",
            price: "$150",
            modules: ["Composición", "Iluminación", "Edición con Lightroom"],
        },
    },
    {
        id: 3,
        title: "GOOGLE DOCS",
        image: "/google-docs.png",
        description: "Herramientas y metodologías para liderar proyectos exitosos.",
        details: {
            duration: "3 semanas",
            content: "Domina Google Docs para colaboración y productividad.",
            instructor: "María López",
            price: "$100",
            modules: ["Documentos compartidos", "Plantillas", "Automatización"],
        },
    },
    {
        id: 4,
        title: "BARA GAMES",
        image: "/BARA-GAMES.png",
        description: "Crea contenido profesional con Adobe Premiere y After Effects.",
        details: {
            duration: "8 semanas",
            content: "Edición de video y efectos visuales avanzados.",
            instructor: "Carlos Ruiz",
            price: "$250",
            modules: ["Introducción a Premiere", "After Effects", "Proyectos finales"],
        },
    },
    {
        id: 5,
        title: "VIRTUAL T",
        image: "/virtual-t.png",
        description: "Explora machine learning y sus aplicaciones prácticas.",
        details: {
            duration: "5 semanas",
            content: "Introducción a machine learning con Python.",
            instructor: "Laura Martínez",
            price: "$180",
            modules: ["Fundamentos de ML", "Python y TensorFlow", "Proyectos prácticos"],
        },
    },
    {
        id: 6,
        title: "ALGOLider",
        image: "/algo-lider.png",
        description: "Crea diseños impactantes con Adobe Photoshop e Illustrator.",
        details: {
            duration: "6 semanas",
            content: "Diseño gráfico avanzado para profesionales.",
            instructor: "Pedro Sánchez",
            price: "$220",
            modules: ["Photoshop básico", "Illustrator avanzado", "Proyectos de diseño"],
        },
    },
    {
        id: 7,
        title: "GOOGLEANDO",
        image: "/googleando.png",
        description: "Optimización de flujos de trabajo con Google Suite.",
        details: {
            duration: "4 semanas",
            content: "Optimización de flujos de trabajo con Google Suite.",
            instructor: "Sofía Ramírez",
            price: "$120",
            modules: ["Google Sheets", "Google Slides", "Colaboración en tiempo real"],
        },
    },
    {
        id: 8,
        title: "SUMA +1 UTILZANDO LINKEDIN",
        image: "/suma+1-utilizando-linkedin.png",
        description: "Estrategias para crecer en LinkedIn.",
        details: {
            duration: "3 semanas",
            content: "Estrategias para crecer en LinkedIn.",
            instructor: "Diego Fernández",
            price: "$90",
            modules: ["Perfil profesional", "Networking", "Contenido estratégico"],
        },
    },
    {
        id: 9,
        title: "FABRICA DE CREATIVOS",
        image: "/fabrica-de-creativos.png",
        description: "Desarrollo de habilidades creativas avanzadas.",
        details: {
            duration: "7 semanas",
            content: "Desarrollo de habilidades creativas avanzadas.",
            instructor: "Clara Morales",
            price: "$230",
            modules: ["Creatividad aplicada", "Diseño visual", "Portafolio profesional"],
        },
    },
    {
        id: 10,
        title: "DISRUPTED",
        image: "/disrupted.png",
        description: "Innovación y disrupción en proyectos creativos.",
        details: {
            duration: "5 semanas",
            content: "Innovación y disrupción en proyectos creativos.",
            instructor: "Marta González",
            price: "$200",
            modules: ["Innovación creativa", "Proyectos disruptivos", "Presentación final"],
        },
    },
];

// Datos de los servicios
export const additionalServices: Service[] = [
    {
        title: "PROYECTOS DE CAPACITACION EMPRESARIAL",
        image: "/foto-servicio.png",
        description: "Programas de formación adaptados a las necesidades de tu empresa.",
    },
    {
        title: "DESARROLLO DE PROYECTOS E LEARNING",
        image: "/desarrollo-de-proyectos-e-learning.png",
        description: "Creación de plataformas y cursos online interactivos.",
    },
    {
        title: "COACHING EDUCATIVO BC",
        image: "/coaching-educativo-bc.png",
        description: "Soluciones para optimizar procesos educativos y de capacitación.",
    },
    {
        title: "DESSARROLLO DE PROYECTOS E LAEARNING BC",
        image: "/desarrollo-de-proyectos-e-learning-bc.png",
        description: "Videos educativos y promocionales de alta calidad.",
    },
    {
        title: "PROYECTO DE CAPACITACION EMPRESARIAL",
        image: "/desarrollo-de-proyectos-e-learning-bc.png",
        description: "Videos educativos y promocionales de alta calidad.",
    },
];