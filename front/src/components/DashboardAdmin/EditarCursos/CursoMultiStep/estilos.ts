import React from 'react';

export const formStyle: React.CSSProperties = {
  maxWidth: 700,
  margin: '2rem auto',
  padding: 24,
  borderRadius: 15,
  background: 'linear-gradient(135deg, #ff6a00, #fddb92)',
  boxShadow: '0 10px 25px rgba(255, 105, 0, 0.3)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: '#5a1a01',
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem',
  borderRadius: 8,
  border: 'none',
  marginBottom: 16,
  fontSize: 16,
  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
};

export const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: 6,
  display: 'block',
};

export const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 12,
};

export const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem',
  borderRadius: 10,
  border: 'none',
  backgroundColor: '#b91c1c',
  color: 'white',
  fontWeight: 700,
  fontSize: '1.1rem',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(185, 28, 28, 0.5)',
  transition: 'background-color 0.3s ease',
};

export const moduloItemStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.7)',
  padding: 15,
  borderRadius: 10,
  marginBottom: 15,
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

export const removeModuloButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc2626',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  marginTop: 10,
  fontSize: '0.9rem',
  fontWeight: 600,
  transition: 'background-color 0.3s ease',
};

export const addModuloButtonStyle: React.CSSProperties = {
  backgroundColor: '#10b981',
  color: 'white',
  padding: '0.8rem 1.5rem',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
  marginTop: 20,
  fontSize: '1rem',
  fontWeight: 700,
  transition: 'background-color 0.3s ease',
};
