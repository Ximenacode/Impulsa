import React from 'react';
import { RotateCcw } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onAbrirRestablecer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAbrirRestablecer }) => {
  return (
    <>
      {/* Enlace accesible para saltar navegación con teclado */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-petroleo-700 focus:text-white focus:rounded-lg focus:shadow-elevada focus:outline-none text-xs font-semibold"
      >
        Saltar al contenido principal
      </a>

      {/* Cabecera compacta visible únicamente en dispositivos móviles */}
      <header className="md:hidden bg-superficie border-b border-borde-suave sticky top-0 z-30 px-4 h-14 flex items-center justify-between shadow-2xs">
        <BrandLogo />

        <button
          type="button"
          onClick={onAbrirRestablecer}
          className="p-2 rounded-lg text-texto-secundario hover:text-texto-principal hover:bg-fondo transition-colors focus:outline-none focus:ring-2 focus:ring-petroleo-700"
          title="Restablecer datos de demostración"
          aria-label="Restablecer datos de demostración"
        >
          <RotateCcw className="w-4 h-4 text-texto-secundario" />
        </button>
      </header>
    </>
  );
};
