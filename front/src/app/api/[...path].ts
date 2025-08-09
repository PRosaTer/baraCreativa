import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const targetPath = Array.isArray(path) ? path.join('/') : path || '';
  const targetUrl = `${BACKEND_URL}/${targetPath}`;


  console.log('Proxying request to:', targetUrl);

  const headers = new Headers();
  for (const key in req.headers) {
    const value = req.headers[key];
    if (typeof value === 'string' && key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
      headers.set(key, value);
    }
  }

  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    headers.set('cookie', cookieHeader);
  }


  if (!headers.has('Content-Type') && req.method !== 'GET' && req.method !== 'HEAD') {
    headers.set('Content-Type', 'application/json');
  }

  let body = null;
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
    });

    const responseBody = await response.text();

    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-length' && key.toLowerCase() !== 'set-cookie') {
        res.setHeader(key, value);
      }
    });

    res.send(responseBody);
  } catch (error) {
    console.error('Error en el proxy de API catch-all:', error);
    res.status(500).json({ message: 'Error en la conexión con el servidor de backend.' });
  }
}
