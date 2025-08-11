import { NextRequest, NextResponse } from 'next/server';

// Esta ruta de API actúa como un proxy.
// Recibe la solicitud del frontend, le adjunta las cookies de autenticación
// y la reenvía al servicio de backend real.
export async function GET(req: NextRequest) {
    try {
        // 1. Obtener la URL base del backend desde las variables de entorno
        // Asegúrate de que esta variable esté configurada en Render
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!backendUrl) {
            return NextResponse.json({ error: 'URL del backend no configurada' }, { status: 500 });
        }

        // 2. Construir la URL completa para el endpoint de tu backend
        const endpointUrl = `${backendUrl}/api/usuarios`;

        // 3. Crear un nuevo objeto de cabeceras.
        // Copiamos las cabeceras de la solicitud original.
        const headers = new Headers(req.headers);

        // 4. Se asegura de reenviar las cookies del cliente al backend.
        // Esto es crucial para la autenticación (JWT, etc.)
        // `credentials: 'include'` en el frontend solo funciona si el servidor
        // (Next.js en este caso) reenvía esas cookies.
        const cookies = req.headers.get('cookie');
        if (cookies) {
            headers.set('cookie', cookies);
        }

        // 5. Reenviar la solicitud al backend real
        const response = await fetch(endpointUrl, {
            method: 'GET',
            headers: headers, // Adjuntamos las cabeceras, incluyendo las cookies
        });

        // 6. Manejar errores si el backend no responde correctamente
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del backend:', response.status, errorText);
            return new NextResponse(errorText, {
                status: response.status,
                headers: { 'Content-Type': response.headers.get('content-type') || 'text/plain' },
            });
        }

        // 7. Devolver la respuesta del backend al frontend
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error en el proxy de la API:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
