import React from 'react';

export const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 600,
  margin: 'auto',
  padding: '20px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  backgroundColor: '#f9fafb',
};

export const labelStyle: React.CSSProperties = {
  marginBottom: '8px',
  fontWeight: '600',
  color: '#4b5563',
};

export const inputStyle: React.CSSProperties = {
  padding: '10px',
  marginBottom: '16px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  width: '100%',
  boxSizing: 'border-box',
};

export const checkboxLabelStyle: React.CSSProperties = {
  marginBottom: '8px',
  fontWeight: '400',
  color: '#4b5563',
  display: 'flex',
  alignItems: 'center',
};

export const buttonStyle: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '700',
  color: 'white',
  backgroundColor: '#b91c1c',
  transition: 'background-color 0.3s ease',
  textAlign: 'center',
};

export const addModuloButtonStyle: React.CSSProperties = {
  padding: '10px',
  border: '1px dashed #d1d5db',
  borderRadius: '4px',
  backgroundColor: '#e5e7eb',
  cursor: 'pointer',
  textAlign: 'center',
  marginTop: '10px',
  marginBottom: '20px',
};

export const removeModuloButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
  color: 'white',
  backgroundColor: '#ef4444',
  marginTop: '10px',
  transition: 'background-color 0.3s ease',
};

export const moduloItemStyle: React.CSSProperties = {
  padding: '15px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  backgroundColor: '#f3f4f6',
  marginBottom: '15px',
};