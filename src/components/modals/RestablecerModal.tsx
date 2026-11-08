import React, { useEffect } from 'react';
import { useContactos } from '../../context/ContactContext';
import { X, RotateCcw, AlertTriangle } from 'lucide-react';

interface RestablecerModalProps {
  abierto: boolean;
  alCerrar: () => void;
}

export const RestablecerModal: React.FC<RestablecerModalProps> = ({
  abierto,
  alCerrar,
}) => {
  const { restablecerDatosDemostracion, navegarA } = useContactos();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto) {
        alCerrar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  const handleConfirm = () => {
    restablecerDatosDemostracion();
    alCerrar();
    navegarA('mi_dia');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-restablecer-titulo"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-superficie rounded-tarjeta shadow-elevada max-w-md w-full overflow-hidden border border-borde-suave animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-borde-suave bg-superficie">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-acento-calidoLight text-[#8C5D19] flex items-center justify-center shrink-0" aria-hidden="true">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-restablecer-titulo" className="text-base font-bold text-texto-principal">
                Restablecer Demostración
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={alCerrar}
            className="p-1.5 rounded-lg text-texto-terciario hover:text-texto-principal hover:bg-fondo focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-start gap-2.5 p-3.5 bg-fondo rounded-xl border border-borde-suave text-texto-secundario leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-[#8C5D19] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Esta acción borrará cualquier cambio guardado en este navegador y recargará los <strong>8 contactos ficticios iniciales</strong> con fechas ajustadas al día actual.
            </p>
          </div>

          <p className="text-xs text-texto-secundario">
            ¿Deseas reiniciar la información para volver a explorar el flujo desde el inicio?
          </p>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-borde-suave">
            <button
              type="button"
              onClick={alCerrar}
              className="px-3.5 py-2 rounded-lg border border-borde-suave text-texto-secundario text-xs font-semibold hover:bg-fondo hover:text-texto-principal focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 active:bg-petroleo-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-petroleo-700"
            >
              Sí, restablecer datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
