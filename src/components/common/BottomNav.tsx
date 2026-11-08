import React from 'react';
import { useContactos } from '../../context/ContactContext';
import { Pantalla } from '../../types';
import { CalendarCheck, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { getEstadoFecha } from '../../utils/dateUtils';

export const BottomNav: React.FC = () => {
  const { pantallaActiva, navegarA, contactos } = useContactos();

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
  }[] = [
    {
      id: 'mi_dia',
      label: 'Mi día',
      icon: CalendarCheck,
      badge: pendientesUrgentes > 0 ? pendientesUrgentes : undefined,
    },
    {
      id: 'contactos',
      label: 'Contactos',
      icon: Users,
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
    <nav
      aria-label="Navegación inferior para dispositivos móviles"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-superficie border-t border-borde-suave z-40 px-2 py-1 shadow-elevada"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
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
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-lg text-xs transition-colors relative focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                esActivo
                  ? 'text-petroleo-700 font-semibold'
                  : 'text-texto-secundario hover:text-texto-principal'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    esActivo ? 'scale-110 text-petroleo-700' : 'text-texto-terciario'
                  }`}
                  aria-hidden="true"
                />
                {typeof item.badge === 'number' && (
                  <span
                    className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[10px] font-bold bg-estado-vencidoText text-white"
                    aria-label={`${item.badge} pendientes urgentes`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[11px] truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
