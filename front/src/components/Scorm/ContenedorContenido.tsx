interface ContenedorContenidoProps {
  tipo: string;
  urlContenido?: string | null;
  contenidoTexto?: string | null; 
}

export default function ContenedorContenido({
  tipo,
  urlContenido,
  contenidoTexto,
}: ContenedorContenidoProps) {
  if (tipo === 'scorm' && urlContenido) {
    return (
      <iframe
        src={urlContenido}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="SCORM Content"
        allowFullScreen
      />
    );
  }

  if (tipo === 'video' && urlContenido) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <video
          key={urlContenido}
          controls           
          className="w-full h-auto max-h-full object-contain rounded-lg shadow-lg" 
          preload="auto"   
        >
          <source src={urlContenido} type="video/mp4" />
          Tu navegador no soporta el tag de video para este contenido.
        </video>
      </div>
    );
  }

  if (tipo === 'pdf' && urlContenido) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <iframe
          key={urlContenido} 
          src={urlContenido}
          className="w-full h-full border-none rounded-lg shadow-lg"
          title="PDF Content"
        />
      </div>
    );
  }

  if (tipo === 'imagen' && urlContenido) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <img
          key={urlContenido}
          src={urlContenido}
          alt="Contenido de Imagen"
          className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
        />
      </div>
    );
  }

  if (tipo === 'texto') {
    return (
      <div className="p-4 text-center w-full h-full flex items-center justify-center">
        <p className="text-lg text-gray-700">{contenidoTexto || "No hay contenido de texto disponible."}</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-red-500 text-center w-full h-full flex items-center justify-center">
      <p>Tipo de contenido no soportado o URL no disponible.</p>
    </div>
  );
}