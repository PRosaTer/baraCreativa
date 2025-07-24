import { PanelTarjeta } from './PanelTarjeta';
import { Modulo } from '@/app/types/curso';

interface ListaModulosProps {
  modulos: Modulo[] | undefined;
}

export function ListaModulos({ modulos }: ListaModulosProps) {
  return (
    <PanelTarjeta
      titulo="Módulos de Programa:"
      claseAdicional="overflow-y-auto max-h-[450px] custom-scrollbar"
      colorBordeHover="accent-cyan" 
    >
      <div className="grid grid-cols-1 gap-4 w-full">
        {modulos && modulos.length > 0 ? (
          modulos.map((modulo) => (
            <div
              key={modulo.id}
              className="bg-dark-bg border border-mid-dark-bg rounded-lg p-4 shadow-sm
                         transition-all duration-300 hover:shadow-md hover:border-accent-magenta
                         transform hover:-translate-y-0.5 hover:scale-[1.005] relative overflow-hidden group"
            >
              <h4 className="m-0 text-lg sm:text-xl font-semibold text-text-light mb-1">{modulo.titulo}</h4>
             
              <p className="m-0 text-sm text-text-muted opacity-80">{modulo.descripcion ?? ''}</p>
             
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-lime/[0.05] to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-[120%] transition-transform duration-700 ease-out"></div>
            </div>
          ))
        ) : (
          <p className="text-text-muted text-center py-6 animate-glitch-subtle">No hay estructuras modulares disponibles.</p>
        )}
      </div>
    </PanelTarjeta>
  );
}