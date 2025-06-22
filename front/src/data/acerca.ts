export interface MiembroEquipo {
    nombre: string
    rol: string
    descripcion: string
    imagen: string
}

export interface Valor {
    nombre: string
    descripcion: string
    color: string
}

export interface ElementoHistoria {
    año: string
    titulo: string
    descripcion: string
}

export const equipo: MiembroEquipo[] = [
    {
        nombre: 'Víctor Padilla',
        rol: 'Co-Fundador',
        descripcion: 'Líder apasionado por transformar la educación con tecnología.',
        imagen: '/lucia-ejemplo.jpg',
    },
    {
        nombre: 'lucy',
        rol: 'desarrolladora',
        descripcion: 'desarrolla en el área de la investigación y desarrollo de software.',
        imagen: '/lucybu.jpg',
    },
    {
        nombre: 'pedro',
        rol: 'analista de datos',
        descripcion: 'se desarrolla en el área de la investigación y desarrollo de software.',
        imagen: '/pedro-ejemplo.jpg',
    },
]

export const vision: string = 'Para 2030, ser el partner líder en formación digital de Honduras, con tecnología innovadora y expertos con alto impacto educativo y empresarial.'

export const mision: string = 'Crear experiencias de aprendizaje emocionantes y disruptivas mediante el uso de la tecnología para docentes y empresas.'

export const valores: Valor[] = [
    { nombre: 'Pasión', descripcion: 'Creemos en el poder transformador de la enseñanza con corazón.', color: 'red-600' },
    { nombre: 'Innovación', descripcion: 'Rompemos moldes para crear aprendizajes memorables.', color: 'blue-600' },
    { nombre: 'Conexión', descripcion: 'Cultivamos relaciones reales, no transacciones.', color: 'green-600' },
    { nombre: 'Humanidad', descripcion: 'Poner a las personas primero.', color: 'yellow-600' },
    { nombre: 'Integridad', descripcion: 'Hacer lo correcto, siempre.', color: 'purple-600' },
    { nombre: 'Simplicidad', descripcion: 'Digital sin complicaciones.', color: 'orange-600' },
]

export const historia: ElementoHistoria[] = [
    {
        año: 'Julio 2020',
        titulo: 'Fundación y VIRTUAL T',
        descripcion: 'Bara Creativa nace en plena pandemia para brindar herramientas tecnológicas y metodologías ágiles a docentes y empresas. El primer curso, VIRTUAL T, se imparte gratis a 24 alumnos, de los cuales 22 concluyen. La aceptación lleva a más ediciones, alcanzando 600 alumnos y 5 cursos al cierre del año.',
    },
    {
        año: '2021',
        titulo: 'Expansión a Empresas',
        descripcion: 'Aumentamos nuestra oferta formativa a empresas con temas como habilidades blandas, emprendimiento, marketing digital y desarrollo de negocios.',
    },
    {
        año: 'Hoy',
        titulo: 'Crecimiento Continuo',
        descripcion: 'Más de 2,000 alumnos, 25 empresas capacitadas y 9 cursos para docentes y capacitadores. ¡Seguimos creciendo! <span className="italic text-blue-600">Ro. 11:36</span>',
    },
]