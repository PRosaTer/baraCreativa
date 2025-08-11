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
        // CRÍTICO: La URL del endpoint debe apuntar a la ruta que tu backend
        // realmente reconoce, que es "/api/usuarios", no a la del proxy.
        const endpointUrl = `${backendUrl}/api/usuarios`;

        // 3. Crear un nuevo objeto de cabeceras.
        // Se asegura de reenviar las cookies del cliente al backend.
        const cookies = req.headers.get('cookie');

        // 4. Reenviar la solicitud al backend real
        const response = await fetch(endpointUrl, {
            method: 'GET',
            // CRÍTICO: Incluir las cookies en la cabecera
            headers: {
                'cookie': cookies || '', // Enviar la cookie si existe
            },
        });

        // 5. Manejar errores si el backend no responde correctamente
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del backend:', response.status, errorText);
            return new NextResponse(errorText, {
                status: response.status,
                headers: { 'Content-Type': response.headers.get('content-type') || 'text/plain' },
            });
        }

        // 6. Devolver la respuesta del backend al frontend
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error en el proxy de la API:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
