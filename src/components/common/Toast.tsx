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
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-tarjeta border shadow-elevada transition-all duration-200 bg-superficie ${
              isExito
                ? 'border-estado-ganadoBorder text-texto-principal'
                : isAdvertencia
                ? 'border-acento-calidoBorder text-texto-principal'
                : 'border-borde-suave text-texto-principal'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isExito && <CheckCircle2 className="w-4 h-4 text-estado-ganadoText" aria-hidden="true" />}
              {isAdvertencia && <AlertCircle className="w-4 h-4 text-[#8C5D19]" aria-hidden="true" />}
              {!isExito && !isAdvertencia && <Info className="w-4 h-4 text-petroleo-700" aria-hidden="true" />}
            </div>

            <p className="text-xs font-medium leading-relaxed flex-1">
              {toast.mensaje}
            </p>

            <button
              type="button"
              onClick={() => removerToast(toast.id)}
              className="shrink-0 p-1 rounded-md text-texto-terciario hover:text-texto-principal hover:bg-fondo focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              aria-label="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
