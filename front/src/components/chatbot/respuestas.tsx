const saludoRespuestas = [
  "hola",
  "ola",
  "buenas",
];

const respuestas: { [clave: string]: string } = {};

saludoRespuestas.forEach((saludo) => {
  respuestas[saludo] = "Hola, soy Pepito. ¿En qué te puedo ayudar?";
});

export default respuestas;
