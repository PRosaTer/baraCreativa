
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
    secure: boolean;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    apiBaseUrl: string;
  };
  FRONTEND_URL?: string;
}

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'ecommerce_db',
  },
  jwtSecret: process.env.JWT_SECRET || 'superSecretJWTKey',
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
    apiBaseUrl: process.env.PAYPAL_API_BASE_URL || 'https://api-m.sandbox.paypal.com',
  },
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000', 
}) as AppConfig;
