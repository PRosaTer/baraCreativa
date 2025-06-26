import { NextRequest, NextResponse } from 'next/server';


const rutasProtegidas = ['/perfil', '/dashboard', '/admin', '/panel'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  const rutaProtegida = rutasProtegidas.some((ruta) =>
    pathname.startsWith(ruta)
  );

  if (rutaProtegida && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/perfil/:path*', '/dashboard/:path*', '/admin/:path*', '/panel/:path*'],
};
