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
import { ContactoSoporte } from '../src/entidades/contacto-soporte.entity'; // <-- corregido

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
      ContactoSoporte,
      Certificado,
      EquipoEmpresaMiembro,
      Inscripcion,
      Usuario,
      Pago,
      ReporteProgresoEntity,
      Resena,
    ],
    synchronize: false,
  });

  await dataSource.initialize();

  const cursoRepo = dataSource.getRepository(Curso);

  const cursos = await cursoRepo.find();

  for (const curso of cursos) {
    if (curso.archivoScorm && curso.archivoScorm.endsWith('/')) {
      curso.archivoScorm = curso.archivoScorm.slice(0, -1);
      console.log(`Corrigiendo curso ID ${curso.id}: ${curso.archivoScorm}`);
      await cursoRepo.save(curso);
    }
  }

  await dataSource.destroy();
}

main().catch(console.error);
