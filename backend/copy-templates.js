const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  fs.mkdirSync(to, { recursive: true });

  for (const element of fs.readdirSync(from)) {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);

    if (fs.lstatSync(fromPath).isFile()) {
      fs.copyFileSync(fromPath, toPath);
    } else {
      copyFolderSync(fromPath, toPath);
    }
  }
}

const srcTemplatesPath = path.join(__dirname, 'src', 'mail', 'templates');
const distTemplatesPath = path.join(__dirname, 'dist', 'src', 'mail', 'templates');

console.log(`Copiando plantillas de ${srcTemplatesPath} a ${distTemplatesPath}...`);
copyFolderSync(srcTemplatesPath, distTemplatesPath);
console.log('✅ Plantillas copiadas correctamente.');
