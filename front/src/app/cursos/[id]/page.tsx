'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Curso, Modulo } from '@/app/types/curso';
import {
  PayPalScriptProvider,
  PayPalButtons,
} from '@paypal/react-paypal-js';
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js';



interface HasMessage {
  message: string;
}


function isHasMessage(error: unknown): error is HasMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string' 
  );
}

export default function CursoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [curso, setCurso] = useState<Curso | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pagado, setPagado] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);


  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; 

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb", 
    currency: "USD",
    intent: "capture" as const,
  };


  const [usuarioId, setUsuarioId] = useState<number | null>(null); 
  const [cargandoUsuario, setCargandoUsuario] = useState(true); 


  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        
   
        setUsuarioId(1);
      } catch (err) {
        console.error("Error al obtener el ID del usuario logeado:", err);
        setUsuarioId(null);
      } finally {
        setCargandoUsuario(false); 
      }
    };

    fetchLoggedInUserId();
  }, []);

  useEffect(() => {
    if (!id || usuarioId === null) return;

    async function fetchCurso() {
      try {
        setCargando(true);
        const res = await fetch(`${apiUrl}/api/cursos/${id}`);
        if (!res.ok) throw new Error('Error al cargar curso');
        const data: Curso = await res.json();
        setCurso(data);
        setError('');
      } catch (err) {
        setError('No se pudo cargar el curso');
        console.error('Error fetching course:', err);
      } finally {
        setCargando(false);
      }
    }
    fetchCurso();
  }, [id, apiUrl, usuarioId]);

  /**
   * Función para crear la orden de PayPal.
   * Llama a tu backend para generar la orden.
   * @param data Datos de la orden (no se usan directamente aquí, el backend los genera).
   * @param actions Acciones proporcionadas por el SDK de PayPal.
   * @returns Una promesa que resuelve con el ID de la orden de PayPal.
   */
  const handleCreateOrder = async (data: CreateOrderData, actions: CreateOrderActions) => {
    if (!curso || !curso.precio || usuarioId === null) {
      setPaypalError("Curso, precio o ID de usuario no disponible para crear la orden de PayPal.");
      return Promise.reject("Curso, precio o ID de usuario no disponible");
    }

    const precioParaPaypal = typeof curso.precio === 'string' ? parseFloat(curso.precio) : curso.precio;

    try {
      const response = await fetch(`${apiUrl}/pagos/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monto: precioParaPaypal,
          currency_code: initialOptions.currency,
          cursoId: curso.id,
          usuarioId: usuarioId, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la orden en el backend.');
      }

      const orderData = await response.json();
      console.log('Orden de PayPal creada en backend:', orderData);
      
      return orderData.orderId;

    } catch (err: unknown) { 
      console.error('Error en handleCreateOrder (frontend):', err);
      let errorMessage = 'Por favor, inténtalo de nuevo.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (isHasMessage(err)) { 
        errorMessage = err.message; 
      }
      setPaypalError(`Error al iniciar el pago: ${errorMessage}`);
      return Promise.reject(err); 
    }
  };

  /**
   * Función que se ejecuta cuando el usuario aprueba el pago en PayPal.
   * La captura y la redirección al SCORM se manejan en el backend.
   * @param data Datos de la aprobación de PayPal.
   * @param actions Acciones proporcionadas por el SDK de PayPal.
   */
  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    console.log('Pago de PayPal aprobado por el usuario:', data);
    setPaypalError(null);
  };

  /**
   * Función que se ejecuta si hay un error en el proceso de PayPal.
   * @param err Objeto de error de PayPal.
   */
  const onError = (err: Record<string, unknown>) => {
    console.error('Error en PayPal:', err);
    setPaypalError('El pago con PayPal no pudo completarse. Por favor, inténtalo de nuevo o contacta a soporte.');
  };

  /**
   * Función que se ejecuta si el usuario cancela el pago en PayPal.
   * @param data Datos de la cancelación de PayPal.
   */
  const onCancel = (data: Record<string, unknown>) => {
    console.log('Pago de PayPal cancelado:', data);
    setPaypalError('El pago fue cancelado.');
  };


  const getScormLaunchUrl = (scormPath?: string | null) => {
    if (!scormPath || typeof scormPath !== 'string') return '';
    return `http://localhost:3000${scormPath}`; 
  };


  if (cargando || cargandoUsuario) return <p className="p-6 text-center text-lg text-blue-400 animate-pulse">Cargando curso y usuario...</p>;
  if (error) return <p className="p-6 text-center text-red-500 text-lg">{error}</p>;
  if (!curso) return <p className="p-6 text-center text-lg text-blue-400">Curso no encontrado</p>;
  if (usuarioId === null) return <p className="p-6 text-center text-red-500 text-lg">Debes iniciar sesión para comprar este curso.</p>;


  const imageUrl = curso.imagenCurso
    ? `${apiUrl}${curso.imagenCurso}`
    : 'https://placehold.co/600x400/1e293b/64748b?text=Sin+Imagen';

  let precioNumerico: number;
  if (typeof curso.precio === 'string') {
    precioNumerico = parseFloat(curso.precio);
  } else if (typeof curso.precio === 'number') {
    precioNumerico = curso.precio;
  } else {
    precioNumerico = 0;
  }
  const precioFormateado = !isNaN(precioNumerico) ? precioNumerico.toFixed(2) : 'N/A';

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-gray-900 shadow-2xl rounded-xl my-8 border border-blue-700/50 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-90 z-0"></div>
      <div className="relative z-10">
        {!pagado ? (
          <div className="text-center space-y-6 text-white">
            {curso.imagenCurso && (
              <div className="w-full h-64 relative mb-6 rounded-lg overflow-hidden border border-blue-500/30 shadow-lg">
                <img
                  src={imageUrl}
                  alt={curso.titulo}
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  className="rounded-lg transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 border-b-2 border-blue-700/50 pb-4">
              {curso.titulo}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
              <div>
                <h2 className="text-2xl font-semibold text-blue-300 mb-4">Detalles Generales</h2>
                <p className="text-gray-300 mb-2"><strong>Descripción:</strong> {curso.descripcion}</p>
                <p className="text-gray-300 mb-2"><strong>Tipo:</strong> <span className="text-blue-400">{curso.tipo}</span></p>
                <p className="text-gray-300 mb-2"><strong>Categoría:</strong> <span className="text-blue-400">{curso.categoria}</span></p>
                <p className="text-gray-300 mb-2"><strong>Duración:</strong> <span className="text-blue-400">{curso.duracionHoras} horas</span></p>
                <p className="text-gray-300 mb-2"><strong>Precio:</strong> <span className="text-green-400 text-xl font-bold">${precioFormateado}</span></p>
                <p className="text-gray-300 mb-2"><strong>Modalidad:</strong> <span className="text-blue-400">{curso.modalidad}</span></p>
                <p className="text-gray-300 mb-2"><strong>Certificado Disponible:</strong> {curso.certificadoDisponible ? <span className="text-green-500">Sí</span> : <span className="text-red-500">No</span>}</p>
                <p className="text-gray-300 mb-2"><strong>Badge Disponible:</strong> {curso.badgeDisponible ? <span className="text-green-500">Sí</span> : <span className="text-red-500">No</span>}</p>
              </div>

              {curso.modulos && curso.modulos.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-blue-300 mb-4">Módulos del Curso</h2>
                  <ul className="list-none space-y-4">
                    {curso.modulos.map((modulo: Modulo) => (
                      <li key={modulo.id} className="text-gray-300 border border-blue-600/30 p-4 rounded-lg shadow-inner bg-gray-800 hover:bg-gray-700 transition duration-300 cursor-pointer">
                        <strong className="text-purple-400 block mb-1">{modulo.titulo}:</strong> <span className="text-gray-400">{modulo.descripcion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {paypalError && (
              <p className="text-red-500 text-lg mt-4">{paypalError}</p>
            )}

            <div className="mt-6 flex flex-col items-center space-y-4">
              <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "pill", label: "pay" }}
                  createOrder={handleCreateOrder}
                  onApprove={onApprove}
                  onError={onError}
                  onCancel={onCancel}
                />
              </PayPalScriptProvider>
              
              <button
                onClick={() => router.push('/cursos')}
                className="inline-block bg-gray-700 text-blue-300 font-bold py-3 px-6 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out shadow-md border border-gray-600 hover:border-blue-400"
              >
                Volver a Cursos
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 text-white">
            <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Contenido del Curso: {curso.titulo}</h1>

            <button
              onClick={() => router.push('/cursos')}
              className="mb-6 px-6 py-2 bg-gray-700 text-blue-300 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out flex items-center mx-auto shadow-md border border-gray-600 hover:border-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Volver a Cursos
            </button>

            {curso.archivoScorm && curso.archivoScorm.indexOf('.html') !== -1 ? (
              <div className="mt-6 p-4 border border-blue-700 bg-gray-800 rounded-lg flex flex-col items-center shadow-inner">
                <iframe
                  key={curso.archivoScorm} 
                  src={getScormLaunchUrl(curso.archivoScorm)}
                  width="100%"
                  height="600px"
                  title={`SCORM Course: ${curso.titulo}`}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-lg shadow-md border border-blue-600"
                />
              </div>
            ) : (
              <p className="text-gray-400 text-lg">No hay contenido SCORM válido disponible para este curso.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
