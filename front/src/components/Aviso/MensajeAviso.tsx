import React, { useEffect } from 'react';

interface MensajeAvisoProps {
  mensaje: string;
  duracion?: number;
  onCerrar: () => void;
}

const MensajeAviso: React.FC<MensajeAvisoProps> = ({ mensaje, duracion = 5000, onCerrar }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCerrar();
    }, duracion);

    return () => clearTimeout(timer);
  }, [duracion, onCerrar]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'linear-gradient(90deg, #FFEB3B, #F44336)',
        color: 'white',
        padding: '1.5rem 3rem',
        borderRadius: '10px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
        zIndex: 9999,
        fontWeight: 'bold',
        fontSize: '1.5rem',
        textAlign: 'center',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        minWidth: '250px',
      }}
    >
      <img
        src="/logo-bc.png"
        alt="Logo Bara Creativa"
        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
      />
      {mensaje}
    </div>
  );
};

export default MensajeAviso;
