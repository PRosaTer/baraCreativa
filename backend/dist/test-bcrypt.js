"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const passwordPlano = 'Poroto';
const hashEnDB = '$2b$10$WI3KwBlejgalXcDF41I1tO2GLf1.ISCY56lsyObHgJTOUV7UOZcbC';
async function probarPassword(password, hash) {
    const resultado = await bcrypt.compare(password, hash);
    console.log('¿La contraseña coincide?', resultado);
}
probarPassword(passwordPlano, hashEnDB).catch(console.error);
//# sourceMappingURL=test-bcrypt.js.map