interface ContenedorContenidoProps {
  tipo: string;
  urlContenido?: string;
  contenidoTexto?: string | null;
}

export default function ContenedorContenido({
  tipo,
  urlContenido,
  contenidoTexto,
}: ContenedorContenidoProps) {
  if (tipo === 'scorm' && urlContenido) {
    return <iframe src={urlContenido} style={{ width: '100%', height: '100%' }} title="SCORM Content" allowFullScreen />;
  }

  if (tipo === 'video' && urlContenido) {
    return (
      <video controls className="w-full h-full object-contain">
        <source src={urlContenido} type="video/mp4" />
        Tu navegador no soporta el tag de video.
      </video>
    );
  }

  if (tipo === 'pdf' && urlContenido) {
    return <iframe src={urlContenido} className="w-full h-full" title="PDF Content" />;
  }

  if (tipo === 'imagen' && urlContenido) {
    return <img src={urlContenido} alt="Contenido" className="max-w-full max-h-full object-contain" />;
  }

  if (tipo === 'texto') {
    return <div className="p-4 text-center">{contenidoTexto || "No hay contenido de texto disponible."}</div>;
  }

  return <div className="p-4 text-red-500 text-center">Tipo de contenido no soportado o URL no disponible.</div>;
}