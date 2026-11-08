import React from 'react';
import { useContactos } from '../../context/ContactContext';
import { Pantalla } from '../../types';
import { CalendarCheck, Users, TrendingUp, BarChart3, RotateCcw } from 'lucide-react';
import { getEstadoFecha } from '../../utils/dateUtils';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  onAbrirRestablecer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAbrirRestablecer }) => {
  const { pantallaActiva, navegarA, contactos } = useContactos();

  // Calcular número de pendientes urgentes (hoy + vencidos) para badge
  const pendientesUrgentes = contactos.filter((c) => {
    if (!c.fechaProximoContacto || !c.proximaAccion) return false;
    const estado = getEstadoFecha(c.fechaProximoContacto);
    return estado === 'hoy' || estado === 'vencido';
  }).length;

  const items: {
    id: Pantalla;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeStyle?: string;
  }[] = [
    {
      id: 'mi_dia',
      label: 'Mi día',
      icon: CalendarCheck,
      badge: pendientesUrgentes > 0 ? pendientesUrgentes : undefined,
      badgeStyle: 'bg-estado-vencidoBg text-estado-vencidoText border border-estado-vencidoBorder',
    },
    {
      id: 'contactos',
      label: 'Contactos',
      icon: Users,
      badge: contactos.length,
      badgeStyle: 'bg-fondo text-texto-secundario border border-borde-suave',
    },
    {
      id: 'oportunidades',
      label: 'Oportunidades',
      icon: TrendingUp,
    },
    {
      id: 'resultados',
      label: 'Resultados',
      icon: BarChart3,
    },
  ];

  return (
    <aside
      aria-label="Navegación principal de escritorio"
      className="hidden md:flex flex-col w-[240px] bg-superficie border-r border-borde-suave shrink-0 h-screen sticky top-0 px-4 py-6 justify-between select-none"
    >
      <div className="space-y-6">
        {/* Marca e identidad */}
        <div className="px-2">
          <BrandLogo />
        </div>

        {/* Menú de navegación principal */}
        <nav className="space-y-1" aria-label="Secciones de la aplicación">
          {items.map((item) => {
            const Icon = item.icon;
            const esActivo =
              pantallaActiva === item.id ||
              (pantallaActiva === 'detalle' && item.id === 'contactos');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navegarA(item.id)}
                aria-current={esActivo ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                  esActivo
                    ? 'bg-petroleo-50 text-petroleo-700 font-semibold shadow-2xs'
                    : 'text-texto-secundario hover:text-texto-principal hover:bg-fondo'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      esActivo ? 'text-petroleo-700' : 'text-texto-terciario'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </div>

                {typeof item.badge === 'number' && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                      item.badgeStyle || 'bg-fondo text-texto-secundario'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Parte inferior: Restablecer demo con confirmación */}
      <div className="pt-4 border-t border-borde-suave px-1 space-y-3">
        <button
          type="button"
          onClick={onAbrirRestablecer}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-texto-secundario hover:text-texto-principal hover:bg-fondo transition-colors focus:outline-none focus:ring-2 focus:ring-petroleo-700"
          title="Restablecer datos ficticios de demostración"
        >
          <RotateCcw className="w-3.5 h-3.5 text-texto-terciario" aria-hidden="true" />
          <span>Restablecer demo</span>
        </button>

        <p className="text-[11px] text-texto-terciario px-2 leading-tight">
          Diseño de experiencia comercial enfocado en asesores.
        </p>
      </div>
    </aside>
  );
};
