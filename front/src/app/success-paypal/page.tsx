'use client';

import { useEffect, useState, Suspense } from 'react'; 
import { useSearchParams, useRouter } from 'next/navigation';


const SuccessPaypalContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setError('No se recibió el ID de la orden.');
      setLoading(false);
      return;
    }

    const capturarPago = async () => {
      try {
        const res = await fetch('http://localhost:3001/pagos/paypal/capture-order', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Error capturando el pago');
        }

        const data = await res.json();
        const cursoId = data.pagoLocal.curso.id; 
        router.replace(`/scorm/${cursoId}`);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        setLoading(false);
      }
    };

    capturarPago();
  }, [orderId, router]); 

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>Procesando pago...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>{error}</p>;

  return null;
};


const SuccessPaypalPage: React.FC = () => {
  return (
    <Suspense fallback={<p style={{ textAlign: 'center', marginTop: 50 }}>Iniciando proceso de pago...</p>}>
      <SuccessPaypalContent />
    </Suspense>
  );
};

export default SuccessPaypalPage;
