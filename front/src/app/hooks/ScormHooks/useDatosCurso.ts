'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { OnApproveData } from '@paypal/paypal-js/types/components/buttons';
import { Curso } from '@/app/types/curso';


const API_BASE_URL = 'http://localhost:3001/api';
const PAYPAL_API_BASE_URL = 'http://localhost:3001/pagos/paypal';

interface UseDatosCursoResult {
  curso: Curso | null;
  usuarioId: number | null;
  loading: boolean;
  error: string;
  crearOrden: () => Promise<string>;
  onApprove: (data: OnApproveData) => Promise<void>;
}

export function useDatosCurso(): UseDatosCursoResult {
  const { id: cursoId } = useParams() as { id: string };
  const router = useRouter();

  const [curso, setCurso] = useState<Curso | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resCurso = await fetch(`${API_BASE_URL}/cursos/${cursoId}`, {
          credentials: 'include',
        });

        if (resCurso.status === 401) {
          toast.error('Necesitas iniciar sesión o registrarte para continuar.', {
            duration: 3000,
          });
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        if (!resCurso.ok) {
          throw new Error('No se pudo cargar el programa.');
        }

        const dataCurso: Curso = await resCurso.json();
        dataCurso.precio = parseFloat(dataCurso.precio as unknown as string);
        dataCurso.fechaInicio = dataCurso.fechaInicio ? new Date(dataCurso.fechaInicio) : null;
        setCurso(dataCurso);

        const resUsuario = await fetch(`${API_BASE_URL}/usuarios/me`, {
          credentials: 'include',
        });

        if (resUsuario.status === 401) {
          toast.error('Necesitas iniciar sesión o registrarte para continuar.', {
            duration: 3000,
          });
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        if (!resUsuario.ok) {
          throw new Error('No se pudo obtener el usuario.');
        }

        const usuario = await resUsuario.json();
        setUsuarioId(usuario.id);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar los datos.');
        toast.error('Error al cargar la información del programa. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [cursoId, router]);

  const crearOrden = useCallback(async (): Promise<string> => {
    if (!usuarioId) {
      toast.error('Usuario no autenticado para crear la orden.');
      throw new Error('Usuario no autenticado');
    }

    try {
      const res = await fetch(`${PAYPAL_API_BASE_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cursoId: Number(cursoId),
          usuarioId,
          currency_code: 'USD',
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error al crear la orden de PayPal:', errorText);
        throw new Error(`Error al crear la orden: ${errorText}`);
      }

      const data = await res.json();
      return data.orderId;
    } catch (error) {
      toast.error('No se pudo iniciar el proceso de pago. Intenta de nuevo.');
      throw error;
    }
  }, [usuarioId, cursoId]);

  const onApprove = useCallback(async (data: OnApproveData) => {
    try {
      if (!usuarioId) {
        toast.error('Usuario no autenticado para completar el pago.');
      }

      const res = await fetch(`${PAYPAL_API_BASE_URL}/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error('Error al capturar el pago de PayPal:', errData);
        throw new Error(errData.message || 'Error al capturar el pago.');
      }

      toast.success('¡Pago completado con éxito! Aguarda que vas a ser redirigido.');
      router.push(`/cursos/${cursoId}/scorm`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido al finalizar el pago.');
      toast.error('Hubo un problema al procesar tu pago. Por favor, contacta a soporte.');
    }
  }, [usuarioId, router, cursoId]);

  return { curso, usuarioId, loading, error, crearOrden, onApprove };
}