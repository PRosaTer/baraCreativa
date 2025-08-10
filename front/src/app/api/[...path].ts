import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!BACKEND_URL) {
    res.status(500).json({ message: 'Variable NEXT_PUBLIC_API_URL no está configurada en el front. Configure la URL del backend en las variables de entorno.' });
    return;
  }

  try {
    const requestHost = String(req.headers.host || '');
    let backendHost = '';
    try {
      backendHost = new URL(BACKEND_URL).host;
    } catch {
      backendHost = '';
    }
    if (backendHost && backendHost === requestHost) {
      res.status(500).json({ message: 'La variable NEXT_PUBLIC_API_URL parece apuntar al mismo host que el front. Verifique que apunte a su backend.' });
      return;
    }

    const { path } = req.query;
    const targetPath = Array.isArray(path) ? path.join('/') : path || '';
    const targetUrl = `${BACKEND_URL.replace(/\/+$/g, '')}/${targetPath.replace(/^\/+/g, '')}`;

    const headers = new Headers();
    for (const key in req.headers) {
      const value = req.headers[key];
      if (typeof value === 'string' && key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
        headers.set(key, value);
      }
    }

    const requestInit: RequestInit = {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      redirect: 'follow',
    };

    const response = await fetch(targetUrl, requestInit);

    const responseBody = await response.arrayBuffer();
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-length' && key.toLowerCase() !== 'set-cookie') {
        res.setHeader(key, value);
      }
    });
    res.send(Buffer.from(responseBody));
  } catch (error) {
    console.error('Error en el proxy de API catch-all:', error);
    res.status(500).json({ message: 'Error en la conexión con el servidor de backend.' });
  }
}
