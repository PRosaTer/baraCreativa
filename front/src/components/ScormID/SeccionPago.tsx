'use client';

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import type { OnApproveData } from '@paypal/paypal-js/types/components/buttons';

interface SeccionPagoProps {
  crearOrden: () => Promise<string>;
  onApprove: (data: OnApproveData) => Promise<void>;
  onError: (err: unknown) => void;
}

export function SeccionPago({ crearOrden, onApprove, onError }: SeccionPagoProps) {
  return (
    <div className="mt-16 mb-4 relative z-10 flex justify-center">
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-2/5 p-4 rounded-xl shadow-lg border border-accent-cyan
                      hover:border-accent-magenta transition-colors duration-300 transform hover:scale-[1.01]">
        <h3 className="text-xl text-text-light font-bold mb-4 text-center">Inscripción:</h3>
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
            currency: 'USD',
          }}
        >
          <PayPalButtons
            createOrder={crearOrden}
            onApprove={onApprove}
            onError={onError}
            style={{ layout: 'vertical', color: 'gold', tagline: false }}
          />
        </PayPalScriptProvider>
        <p className="text-xs text-text-muted text-center mt-3">Procesamos pagos de forma segura vía PayPal. <span className="font-bold text-accent-lime">Acceso instantáneo.</span></p>
      </div>
    </div>
  );
}