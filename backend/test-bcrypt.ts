import * as bcrypt from 'bcrypt';

// La contraseña que querés comprobar (ejemplo: '123456')
const passwordPlano = 'Poroto';

// El hash que tenés guardado en la base (copialo tal cual desde la DB)
const hashEnDB = '$2b$10$WI3KwBlejgalXcDF41I1tO2GLf1.ISCY56lsyObHgJTOUV7UOZcbC'; // reemplaza por tu hash real

async function probarPassword(password: string, hash: string) {
  const resultado = await bcrypt.compare(password, hash);
  console.log('¿La contraseña coincide?', resultado);
}

probarPassword(passwordPlano, hashEnDB).catch(console.error);
