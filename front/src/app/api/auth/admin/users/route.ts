import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return NextResponse.json({ error: 'URL del backend no configurada' }, { status: 500 });
    }


    const endpointUrl = `${backendUrl}/auth/admin/users`;


    const cookies = req.headers.get('cookie') || '';

    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'cookie': cookies,
      },
      credentials: 'include', 
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del backend:', response.status, errorText);
      return new NextResponse(errorText, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('content-type') || 'text/plain',
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en el proxy de la API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
