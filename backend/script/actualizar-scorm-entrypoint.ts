// backend/script/actualizar-scorm-entrypoint.ts
import { DataSource } from 'typeorm';
import { Curso } from '../src/entidades/curso.entity';
import { ModuloEntity } from '../src/entidades/modulo.entity';
import { BadgeEntity } from '../src/entidades/badge.entity';
import { Carrito } from '../src/entidades/carrito.entity';
import { Certificado } from '../src/entidades/certificado.entity';
import { EquipoEmpresaMiembro } from '../src/entidades/equipo-empresa.entity';
import { Inscripcion } from '../src/entidades/inscripcion.entity';
import { Pago } from '../src/entidades/pago.entity';
import { ReporteProgresoEntity } from '../src/entidades/reporte-progreso.entity';
import { Resena } from '../src/entidades/resena.entity';
import { Usuario } from '../src/entidades/usuario.entity';
import { ContactoSoporte } from '../src/entidades/contacto-soporte.entity';

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

  const cursoId = 74; // Cambia si querés otro ID
  const curso = await cursoRepo.findOneBy({ id: cursoId });

  if (curso) {
    curso.archivoScorm = `/uploads/scorm_unzipped_courses/8980814d-2464-474b-badd-892e1af3d0b2/proxy.html`;
    await cursoRepo.save(curso);
    console.log(`✅ Curso ID ${cursoId} actualizado correctamente con proxy.html`);
  } else {
    console.log(`❌ No se encontró el curso con ID ${cursoId}`);
  }

  await dataSource.destroy();
}

main().catch(console.error);
