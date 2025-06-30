import { useEffect } from 'react';
import { PayPalActions, CreateOrderData, OnApproveData, PayPalError } from '@/app/types/paypal';

export default function usePayPal(onSuccess: () => void) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=USD';

    const handleLoad = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (_data: CreateOrderData, actions: PayPalActions) => {
            return actions.order.create({
              purchase_units: [{ amount: { value: '1.00' } }],
            });
          },
          onApprove: (_data: OnApproveData, actions: PayPalActions) => {
            return actions.order.capture().then(() => {
              onSuccess();
            });
          },
          onError: (err: PayPalError) => {
            alert('Error en el pago: ' + (err.message || err.name || 'Error desconocido'));
          },
        }).render('#paypal-button-container');
      }
    };

    script.addEventListener('load', handleLoad);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.remove();
    };
  }, [onSuccess]);
}
