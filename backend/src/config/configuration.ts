// src/config/configuration.ts

export interface AppConfig {
  port: number;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  jwtSecret: string;
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean; // Añadir si `secure` es una variable de entorno configurable
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    apiBaseUrl: string;
  };
}

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost', // Añadir valores por defecto
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'ecommerce_db',
  },
  jwtSecret: process.env.JWT_SECRET || 'superSecretJWTKey', // Usar una clave segura en .env
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASS || 'password',
    secure: process.env.EMAIL_SECURE === 'true',
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || 'your_paypal_client_id',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'your_paypal_client_secret',
    apiBaseUrl: process.env.PAYPAL_API_BASE_URL || 'https://api-m.sandbox.paypal.com', // Hay que cambiar a https://api-m.paypal.com para producción
  },
}) as AppConfig;