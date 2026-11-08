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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800" aria-hidden="true">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-restablecer-titulo" className="text-lg font-bold text-slate-900">
                Restablecer Datos de Demostración
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={alCerrar}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Esta acción borrará cualquier contacto o interacción que hayas registrado en este navegador y volverá a cargar los <strong>8 contactos ficticios originales</strong> con fechas calibradas al día de hoy.
            </p>
          </div>

          <p className="text-sm text-slate-600">
            ¿Deseas reiniciar la información de demostración para volver a explorar el flujo desde cero?
          </p>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={alCerrar}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 active:bg-amber-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
            >
              Sí, restablecer datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
