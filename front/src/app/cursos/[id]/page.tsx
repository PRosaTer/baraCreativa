'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import type { OnApproveData } from '@paypal/paypal-js/types/components/buttons';

import { Curso } from '@/app/types/curso';

export default function CursoDetalle() {
  const { id: cursoId } = useParams();
  const router = useRouter();

  const [curso, setCurso] = useState<Curso | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchDatos() {
      try {
        const resCurso = await fetch(`http://localhost:3001/api/cursos/${cursoId}`);
        if (!resCurso.ok) throw new Error('No se pudo cargar el curso');
        const dataCurso: Curso = await resCurso.json();
        setCurso(dataCurso);

        const resUsuario = await fetch('http://localhost:3001/api/usuarios/me', {
          credentials: 'include',
        });
        if (!resUsuario.ok) throw new Error('No se pudo obtener el usuario');
        const usuario = await resUsuario.json();
        setUsuarioId(usuario.id);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    }
    fetchDatos();
  }, [cursoId]);

  const crearOrden = async (): Promise<string> => {
    if (!usuarioId) throw new Error('Usuario no autenticado');
    const res = await fetch('http://localhost:3001/pagos/paypal/create-order', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        cursoId: Number(cursoId),
        usuarioId,
        // monto: Number(curso?.precio ?? 0), //Esto no hay que tocar

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

      router.push(`/cursos/${cursoId}/scorm`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  if (loading) return <p>Cargando curso...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div
      style={{
        padding: '30px',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        color: '#ffffff',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        maxWidth: '900px',
        margin: '40px auto',
      }}
    >
      <h1 style={{ marginBottom: '10px', fontSize: '2rem' }}>{curso?.titulo}</h1>
      <p style={{ opacity: 0.8 }}>{curso?.descripcion}</p>
      <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>💲 Precio: ${curso?.precio}</p>

      <p>
        Certificado:{' '}
        {curso?.certificadoDisponible ? (
          <span style={{ color: '#00ff88' }}>✅ Disponible</span>
        ) : (
          <span style={{ color: '#ff4d4d' }}>❌ No disponible</span>
        )}
      </p>

      <p>
        Badge:{' '}
        {curso?.badgeDisponible ? (
          <span style={{ color: '#00ff88' }}>✅ Disponible</span>
        ) : (
          <span style={{ color: '#ff4d4d' }}>❌ No disponible</span>
        )}
      </p>

      <p>
        Archivo Scorm:{' '}
        {curso?.archivoScorm ? (
          <span style={{ color: '#00ff88' }}>✅ Disponible</span>
        ) : (
          <span style={{ color: '#ff4d4d' }}>❌ No disponible</span>
        )}
      </p>

      <p>Tipo: <span style={{ fontWeight: 'bold' }}>{curso?.tipo}</span></p>
      <p>Categoría: <span style={{ fontWeight: 'bold' }}>{curso?.categoria ?? 'Sin categoría'}</span></p>
      <p>Modalidad: <span style={{ fontWeight: 'bold' }}>{curso?.modalidad}</span></p>
      <p>Horas: <span style={{ fontWeight: 'bold' }}>{curso?.duracionHoras}</span></p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginTop: '10px',
        }}
      >
        {curso?.modulos && curso.modulos.length > 0 ? (
          curso.modulos.map((modulo) => (
            <div
              key={modulo.id}
              style={{
                flex: '1 1 calc(50% - 6px)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <h4 style={{ margin: 0 }}>{modulo.titulo}</h4>
              <p style={{ margin: '6px 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                {modulo.descripcion}
              </p>
            </div>
          ))
        ) : (
          <p>Sin módulos</p>
        )}
      </div>

      {curso?.imagenCurso && typeof curso.imagenCurso === 'string' && (
        <img
          src={curso.imagenCurso}
          alt="Imagen curso"
          style={{
            maxWidth: '100%',
            marginTop: 20,
            borderRadius: '12px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
          }}
        />
      )}

      <div style={{ marginTop: 30 }}>
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
          />

        </PayPalScriptProvider>
      </div>
    </div>
  );
}
