'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import type { OnApproveData } from '@paypal/paypal-js/types/components/buttons';

import { Curso, ClaseItem } from '@/app/types/curso';

export default function ServicioDetalle() {
  const { id: servicioId } = useParams() as { id: string };
  const router = useRouter();

  const [servicio, setServicio] = useState<Curso | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchDatos() {
      try {
      
        const resServicio = await fetch(`http://localhost:3001/api/cursos/${servicioId}`, {
          credentials: 'include',
        });
        if (!resServicio.ok) throw new Error('No se pudo cargar el servicio');
        const dataServicio: Curso = await resServicio.json();

        if (dataServicio.claseItem !== ClaseItem.SERVICIO) {
          throw new Error('El ID proporcionado no corresponde a un servicio.');
        }

        dataServicio.precio = parseFloat(dataServicio.precio as unknown as string);
        dataServicio.fechaInicio = dataServicio.fechaInicio ? new Date(dataServicio.fechaInicio) : null;

        setServicio(dataServicio);

        
        const resUsuario = await fetch('http://localhost:3001/api/usuarios/me', {
          credentials: 'include',
        });
        if (!resUsuario.ok) throw new Error('No se pudo obtener el usuario');
        const usuario = await resUsuario.json();
        setUsuarioId(usuario.id);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar el servicio');
        setLoading(false);
      }
    }
    fetchDatos();
  }, [servicioId]);

  const crearOrden = async (): Promise<string> => {
    if (!usuarioId) throw new Error('Usuario no autenticado');
    if (!servicio) throw new Error('Servicio no cargado');

    const res = await fetch('http://localhost:3001/pagos/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        cursoId: Number(servicioId),
        usuarioId,
        currency_code: 'USD',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error al crear la orden:', errorText);
      throw new Error(`Error al crear la orden: ${errorText}`);
    }

    const data = await res.json();
    return data.orderId;
  };

  const onApprove = async (data: OnApproveData) => {
    try {
      if (!usuarioId) throw new Error('Usuario no autenticado');

      const res = await fetch('http://localhost:3001/pagos/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al capturar el pago');
      }


      router.push(`/servicios/${servicioId}`); 
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  if (loading) return <p className="text-center text-lg mt-8 text-gray-700">Cargando servicio...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <div
      className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700
                   rounded-2xl shadow-xl text-white font-sans max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl
                   mx-auto my-8 md:my-12"
    >
      <h1 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-purple-300 text-center">
        {servicio?.titulo}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 items-start">
        <div className="flex flex-col">
          <div className="mb-6">
            <p className="font-bold text-base sm:text-lg text-green-400 mb-2">
              💲 Precio: ${servicio?.precio}
            </p>
        
            <p className="text-sm sm:text-base mb-1">
              Certificado:{' '}
              {servicio?.certificadoDisponible ? (
                <span className="text-emerald-400">✅ Disponible</span>
              ) : (
                <span className="text-red-400">❌ No disponible</span>
              )}
            </p>
            <p className="text-sm sm:text-base mb-1">
              Badge:{' '}
              {servicio?.badgeDisponible ? (
                <span className="text-emerald-400">✅ Disponible</span>
              ) : (
                <span className="text-red-400">❌ No disponible</span>
              )}
            </p>
            
            {servicio?.claseItem === ClaseItem.CURSO && (
              <>
                <p className="text-sm sm:text-base mb-4">
                  Archivo Scorm:{' '}
                  {servicio?.archivoScorm ? (
                    <span className="text-emerald-400">✅ Disponible</span>
                  ) : (
                    <span className="text-red-400">❌ No disponible</span>
                  )}
                </p>
                <p className="text-sm sm:text-base mb-1">Modalidad: <span className="font-bold">{servicio?.modalidad}</span></p>
                <p className="text-sm sm:text-base mb-4">Horas: <span className="font-bold">{servicio?.duracionHoras}</span></p>
              </>
            )}
            
            <p className="text-sm sm:text-base mb-1">Tipo: <span className="font-bold">{servicio?.tipo}</span></p>
            <p className="text-sm sm:text-base mb-1">Categoría: <span className="font-bold">{servicio?.categoria ?? 'Sin categoría'}</span></p>
            {servicio?.fechaInicio && ( 
                <p className="text-sm sm:text-base mb-4">
                    Fecha de Inicio: <span className="font-bold">{servicio.fechaInicio.toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </p>
            )}
          </div>

          <div className='mt-10'> 
            <h3 className="text-xl sm:text-2xl font-bold text-purple-200 mb-3">Descripción:</h3>
            <div
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg
                          transition-all duration-300 hover:shadow-2xl hover:border-purple-500"
            >
              <p className="m-0 text-lg sm:text-xl font-semibold text-purple-100 mb-5">{servicio?.descripcion}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {servicio?.imagenCurso && typeof servicio.imagenCurso === 'string' && (
            <div className="w-full flex justify-center md:justify-start mb-6">
              <img
                src={servicio.imagenCurso}
                alt={`Imagen de ${servicio.titulo}`}
                className="max-w-full h-auto object-contain rounded-xl shadow-lg md:max-h-96 w-auto"
              />
            </div>
          )}

    
          {servicio?.claseItem === ClaseItem.CURSO && (
            <div> 
              <h3 className="text-xl sm:text-2xl font-bold text-purple-200 mb-3">Módulos:</h3>
              <div
                className="grid grid-cols-1 gap-4 w-full"
              >
                {servicio?.modulos && servicio.modulos.length > 0 ? (
                  servicio.modulos.map((modulo) => (
                    <div
                      key={modulo.id}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg
                                 transition-all duration-300 hover:shadow-2xl hover:border-purple-500"
                    >
                      <h4 className="m-0 text-lg sm:text-xl font-semibold text-purple-100 mb-1">{modulo.titulo}</h4>
                      <p className="m-0 text-sm opacity-80">{modulo.descripcion}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Sin módulos disponibles para este servicio.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
            currency: 'USD',
          }}
        >
          <PayPalButtons
            createOrder={() => crearOrden()}
            onApprove={onApprove}
            onError={(err) => {
              console.error('Error en PayPal:', err);
              setError('Hubo un problema con PayPal');
            }}
            style={{ layout: 'vertical', color: 'blue' }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}
