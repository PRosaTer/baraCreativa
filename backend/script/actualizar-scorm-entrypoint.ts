import { DataSource } from 'typeorm';
import { Curso } from '../src/entidades/curso.entity';
import { ModuloEntity } from '../src/entidades/modulo.entity';
import { BadgeEntity } from '../src/entidades/badge.entity';
import { Carrito } from '../src/entidades/carrito.entity';
import { Certificado } from '../src/entidades/certificado.entity';
import { EquipoEmpresaMiembro } from '../src/entidades/equipo-empresa.entity';
import { Inscripcion } from '../src/entidades/inscripcion.entity';
import { Pago } from '../src/entidades/pago.entity';
import { ReporteProgresoEntity } from '../src/entidades/ReporteProgreso.entity';
import { Resena } from '../src/entidades/resena.entity';
import { Usuario } from '../src/entidades/usuario.entity';
import { ContactoSoporte } from '../src/entidades/contacto-soporte.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

async function main() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Jazmin2511Anahi!!',
    database: 'BaraCreativa',
    entities: [
      Curso,
      ModuloEntity,
      BadgeEntity,
      Carrito,
      Certificado,
      EquipoEmpresaMiembro,
      Inscripcion,
      Pago,
      ReporteProgresoEntity,
      Resena,
      Usuario,
      ContactoSoporte,
    ],
    synchronize: false,
  });

  await dataSource.initialize();
  const cursoRepo = dataSource.getRepository(Curso);

  const cursoId = 78; 
  const curso = await cursoRepo.findOneBy({ id: cursoId });

  if (!curso) {
    console.log(`❌ No se encontró el curso con ID ${cursoId}`);
    await dataSource.destroy();
    return;
  }


  const folderPath = curso.archivoScorm?.split('/proxy.html')[0];
  

  const absoluteFolderPath = path.join(process.cwd(), folderPath || ''); 
  const manifestPath = path.join(absoluteFolderPath, 'imsmanifest.xml');

  if (!fs.existsSync(manifestPath)) {
    console.log(`❌ No se encontró imsmanifest.xml en: ${manifestPath}`);
    await dataSource.destroy();
    return;
  }

  const xmlData = fs.readFileSync(manifestPath, 'utf8');
  const parser = new xml2js.Parser();
  const manifest = await parser.parseStringPromise(xmlData);


  const manifestIdentifier = manifest.manifest.$.identifier;


  const resources = manifest.manifest.resources[0].resource;
  const resourceIdentifier = resources[0].$.identifier;

  const dataParam = `${manifestIdentifier}/${resourceIdentifier}`;
  console.log(`✅ Identificado data: ${dataParam}`);

 
  curso.archivoScorm = `${folderPath}/proxy.html?data=${encodeURIComponent(dataParam)}`;
  await cursoRepo.save(curso);

  console.log(`✅ Curso ID ${cursoId} actualizado correctamente con ruta: ${curso.archivoScorm}`);

  await dataSource.destroy();
}

main().catch(console.error);
