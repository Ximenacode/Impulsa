import React from 'react';
import { useContactos } from '../../context/ContactContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removerToast } = useContactos();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notificaciones del sistema"
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isExito = toast.tipo === 'exito';
        const isAdvertencia = toast.tipo === 'advertencia';

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-md transition-all duration-200 bg-white ${
              isExito
                ? 'border-emerald-300 text-slate-800'
                : isAdvertencia
                ? 'border-amber-300 text-slate-800'
                : 'border-slate-300 text-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isExito && <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />}
              {isAdvertencia && <AlertCircle className="w-5 h-5 text-amber-600" aria-hidden="true" />}
              {!isExito && !isAdvertencia && <Info className="w-5 h-5 text-petroleo-700" aria-hidden="true" />}
            </div>

            <p className="text-sm font-medium leading-snug flex-1">
              {toast.mensaje}
            </p>

            <button
              type="button"
              onClick={() => removerToast(toast.id)}
              className="shrink-0 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
