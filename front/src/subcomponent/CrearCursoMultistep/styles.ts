import { CSSProperties } from 'react';

export const formStyle: CSSProperties = {
    maxWidth: 700,
    margin: '2rem auto',
    padding: 24,
    borderRadius: 15,
    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
    boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#065f46',
};

export const inputStyle: CSSProperties = {
    width: '100%',
    padding: '0.6rem',
    borderRadius: 8,
    border: 'none',
    marginBottom: 16,
    fontSize: 16,
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
};

export const labelStyle: CSSProperties = {
    fontWeight: 600,
    marginBottom: 6,
    display: 'block',
};

export const checkboxLabelStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 12,
};

export const buttonStyle: CSSProperties = {
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

export const removeModuloButtonStyle: CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#dc3545',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginTop: '10px',
    alignSelf: 'flex-end',
    boxShadow: '0 3px 10px rgba(220, 53, 69, 0.3)',
    transition: 'background-color 0.3s ease',
};

export const addModuloButtonStyle: CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    boxShadow: '0 5px 15px rgba(40, 167, 69, 0.5)',
};

export const submitButtonStyle: CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    boxShadow: '0 5px 15px rgba(0, 123, 255, 0.5)',
};

export const cancelButtonStyle: CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    boxShadow: '0 5px 15px rgba(108, 117, 125, 0.5)',
};

export const moduloContainerStyle: CSSProperties = {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    background: '#f9f9f9',
    color: '#333',
};

export const moduloItemStyle: CSSProperties = {
    border: '1px dashed #bbb',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    background: '#e0ffe0',
    display: 'flex',
    flexDirection: 'column',
};