'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Certificado {
  id: number;
  nombreCurso: string;
  fechaEmision: string;
  rutaArchivo: string;
  curso: {
    id: number;
    titulo: string;
  };
}

export default function CertificadosUsuario() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Se usa la variable de entorno para la URL de la base
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchCertificados = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendBaseUrl}/api/certificados/mis-certificados`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al cargar los certificados: ${errorText}`);
      }

      const data: Certificado[] = await res.json();
      setCertificados(data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar los certificados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificados();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-600 text-xl font-semibold py-20">
        Cargando certificados...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 text-xl font-semibold py-20">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Mis Certificados</h2>
      {certificados.length === 0 ? (
        <div className="text-center text-gray-600 text-xl font-semibold py-20">
          Aún no tienes certificados disponibles. ¡Completa cursos para obtenerlos!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificados.map((certificado) => (
            <div
              key={certificado.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{certificado.nombreCurso}</h3>
              <p className="text-gray-600 text-sm mb-4">
                Emitido el: {format(new Date(certificado.fechaEmision), 'dd MMMM yyyy', { locale: es })}
              </p>
              <Link
                // Usamos la variable de entorno para construir la URL del certificado
                href={`${backendBaseUrl}/certificados/${certificado.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Ver Certificado
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
