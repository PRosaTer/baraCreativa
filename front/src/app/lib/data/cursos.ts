import { Curso } from '@/app/types/curso';

export async function getCursoById(id: string): Promise<Curso | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/cursos/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Error al obtener el curso ${id}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener el curso con ID ${id}:`, error);
    return null;
  }
}