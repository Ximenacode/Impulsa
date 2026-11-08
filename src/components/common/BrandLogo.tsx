import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

export const BrandLogo: React.FC<{ onAbrirInfoDemo?: () => void }> = () => {
  const [modalDemoAbierto, setModalDemoAbierto] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalDemoAbierto) {
        setModalDemoAbierto(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalDemoAbierto]);

  return (
    <>
      <div className="flex items-center gap-2.5">
        {/* Símbolo geométrico de la marca */}
        <div
          className="w-8 h-8 rounded-lg bg-petroleo-700 flex items-center justify-center text-white shadow-xs shrink-0 relative overflow-hidden"
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
          {/* Pequeño acento cálido geométrico en la esquina */}
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-acento-calido rounded-full" />
        </div>

        {/* Tratamiento tipográfico */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-texto-principal tracking-tight">
            Impulsa
          </span>

          {/* Etiqueta pequeña "Demo" interactiva */}
          <button
            type="button"
            onClick={() => setModalDemoAbierto(true)}
            className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-petroleo-100 text-petroleo-700 hover:bg-petroleo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            title="Información sobre la demostración"
            aria-label="Ver información sobre esta demostración"
          >
            Demo
          </button>
        </div>
      </div>

      {/* Modal/Diálogo informativo de la demo */}
      {modalDemoAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-demo-titulo"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-tarjeta shadow-elevada max-w-sm w-full border border-borde-suave p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-petroleo-50 text-petroleo-700 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <h3 id="dialog-demo-titulo" className="text-sm font-bold text-texto-principal">
                  Demostración de Portafolio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalDemoAbierto(false)}
                className="p-1 text-texto-secundario hover:text-texto-principal rounded-md hover:bg-fondo focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                aria-label="Cerrar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-texto-secundario leading-relaxed">
              Esta demostración utiliza datos ficticios. Los cambios se guardan únicamente en este navegador. No ingreses información personal real.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setModalDemoAbierto(false)}
                className="px-3.5 py-1.5 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
