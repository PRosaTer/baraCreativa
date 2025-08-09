import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { filename } = req.query;

  const targetUrl = `${BACKEND_URL}/uploads/perfiles/${filename}`;

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Archivo no encontrado' });
    }


    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.status(200).send(buffer);
    
  } catch (error) {
    console.error('Error en el proxy de API (uploads perfiles):', error);
    res.status(500).json({ message: 'Error en la conexión con el servidor de backend.' });
  }
}
