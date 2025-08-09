import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const targetUrl = `${BACKEND_URL}/usuarios`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error en el proxy de API (register user):', error);
    res.status(500).json({ message: 'Error en la conexión con el servidor de backend.' });
  }
}
