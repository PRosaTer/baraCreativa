// components/tarjetas/cursos/page.tsx
// Este componente se ejecutará en el cliente si utilizas 'use client',
// pero al recibir los datos como prop de un Server Component, la carga inicial es rápida.
"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Importa Image si lo estás usando
import { Curso } from '@/app/types/curso'; // Importa la interfaz Curso

interface CardsListProps {
  cursos: Curso[];
}

export default function CardsList({ cursos }: CardsListProps) {
  if (!cursos || cursos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
      {cursos.map((curso) => {
        const urlImagen = curso.imagenCurso
          ? `http://localhost:3001/uploads/${curso.imagenCurso}`
          : 'https://placehold.co/400x200/cccccc/333333?text=Sin+Imagen';
        return (
          <Link href={`/cursos/${curso.id}`} key={curso.id} className="block">
            <div className="border rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              {curso.imagenCurso ? (
              <img
                  src={urlImagen}
                  alt={curso.titulo}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-[var(--primary)] line-clamp-2">{curso.titulo}</h3>
                <p className="text-gray-700 text-sm flex-grow line-clamp-3">{curso.descripcion}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}