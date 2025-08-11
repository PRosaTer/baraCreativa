import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!backendUrl) {
            return NextResponse.json({ error: 'URL del backend no configurada' }, { status: 500 });
        }

        const endpointUrl = `${backendUrl}/auth/login`;

        const body = await req.json();
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'cookie': req.headers.get('cookie') || '',
            },
            body: JSON.stringify(body),
        });


        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del backend en el login:', response.status, errorText);
            return new NextResponse(errorText, {
                status: response.status,
                headers: { 'Content-Type': response.headers.get('content-type') || 'text/plain' },
            });
        }


        const setCookieHeader = response.headers.get('Set-Cookie');


        const data = await response.json();
        const clientResponse = NextResponse.json(data, {
            status: response.status,
        });

    
        if (setCookieHeader) {
            clientResponse.headers.set('Set-Cookie', setCookieHeader);
        }

        return clientResponse;
    } catch (error) {
        console.error('Error en el proxy de login:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
