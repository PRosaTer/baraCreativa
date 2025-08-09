import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const targetPath = (Array.isArray(path) ? path.join('/') : path) || '';

  const targetUrl = `${BACKEND_URL}/${targetPath}`;


  const headers = new Headers();
  for (const key in req.headers) {
    const value = req.headers[key];
    if (typeof value === 'string') {
      headers.set(key, value);
    }
  }

  if (!headers.has('Content-Type') && req.method !== 'GET' && req.method !== 'HEAD') {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers, 
      body: req.method === 'GET' || req.method === 'HEAD' ? null : JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).send(errorData);
    }
    

    const data = await response.text();
    res.status(response.status).send(data);
    
  } catch (error) {
    console.error('Error en el proxy de API catch-all:', error);
    res.status(500).json({ message: 'Error en la conexión con el servidor de backend.' });
  }
}
