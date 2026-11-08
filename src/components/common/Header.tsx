import React from 'react';
import { RotateCcw, Compass, Plus } from 'lucide-react';

interface HeaderProps {
  onAbrirNuevoContacto: () => void;
  onAbrirRestablecer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAbrirNuevoContacto,
  onAbrirRestablecer,
}) => {
  return (
    <>
      {/* Enlace accesible para saltar navegación con teclado */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-petroleo-700 focus:text-white focus:rounded focus:shadow-lg focus:outline-none"
      >
        Saltar al contenido principal
      </a>

      {/* Banner discreto de transparencia de portafolio */}
      <div
        role="region"
        aria-label="Aviso de prototipo"
        className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2"
      >
        <div className="flex items-center gap-1.5 mx-auto md:mx-0">
          <Compass className="w-3.5 h-3.5 text-petroleo-700 shrink-0" aria-hidden="true" />
          <span>
            <strong>Prototipo de Portafolio UX/UI:</strong> Datos 100% ficticios guardados en este navegador (localStorage). No usar para datos reales ni sensibles.
          </span>
        </div>

        <button
          type="button"
          onClick={onAbrirRestablecer}
          className="inline-flex items-center gap-1 text-slate-600 hover:text-petroleo-800 underline focus:outline-none focus:ring-2 focus:ring-petroleo-700 rounded px-1"
          aria-label="Restablecer datos de demostración a su estado inicial"
        >
          <RotateCcw className="w-3 h-3" aria-hidden="true" />
          <span>Restablecer demo</span>
        </button>
      </div>

      {/* Cabecera superior compacta */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-petroleo-700 flex items-center justify-center text-white shadow-sm" aria-hidden="true">
              <span className="font-bold text-lg tracking-wider">I</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-petroleo-900 tracking-tight">Impulsa</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-petroleo-100 text-petroleo-800">
                  UX/UI Demo
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500">
                Organiza tus contactos y convierte el interés en una próxima acción
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onAbrirNuevoContacto}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-petroleo-700 text-white text-sm font-medium hover:bg-petroleo-800 active:bg-petroleo-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-petroleo-700 transition-colors"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Nuevo contacto</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
