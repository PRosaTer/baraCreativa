import { Curso } from '@/app/types/curso';

export async function getCursoById(id: string): Promise<Curso | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Error al obtener el curso ${id}: ${res.statusText}`);
    }

    const data: Curso = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error al obtener el curso con ID ${id}:`, error.message);
    } else {
      console.error(`Error desconocido al obtener el curso con ID ${id}`);
    }
    return null;
  }
}
