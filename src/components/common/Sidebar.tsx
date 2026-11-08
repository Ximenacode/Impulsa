import React from 'react';
import { useContactos } from '../../context/ContactContext';
import { Pantalla } from '../../types';
import { CalendarCheck, Users, TrendingUp, BarChart3, Plus } from 'lucide-react';
import { getEstadoFecha } from '../../utils/dateUtils';

interface SidebarProps {
  onAbrirNuevoContacto: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAbrirNuevoContacto }) => {
  const { pantallaActiva, navegarA, contactos } = useContactos();

  // Calcular número de pendientes urgentes (hoy + vencidos) para badge
  const pendientesUrgentes = contactos.filter((c) => {
    if (!c.fechaProximoContacto || !c.proximaAccion) return false;
    const estado = getEstadoFecha(c.fechaProximoContacto);
    return estado === 'hoy' || estado === 'vencido';
  }).length;

  const items: { id: Pantalla; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
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
      badge: contactos.length,
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
      className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-4rem)] p-4"
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={onAbrirNuevoContacto}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-petroleo-700 text-white font-medium text-sm hover:bg-petroleo-800 active:bg-petroleo-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-petroleo-700 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Nuevo contacto</span>
        </button>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Menú principal">
        {items.map((item) => {
          const Icon = item.icon;
          const esActivo = pantallaActiva === item.id || (pantallaActiva === 'detalle' && item.id === 'contactos');

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navegarA(item.id)}
              aria-current={esActivo ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                esActivo
                  ? 'bg-petroleo-50 text-petroleo-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 ${
                    esActivo ? 'text-petroleo-700' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </div>

              {typeof item.badge === 'number' && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    item.id === 'mi_dia' && pendientesUrgentes > 0
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-200 mt-auto text-xs text-slate-500">
        <p className="font-medium text-slate-700">Impulsa v1.0</p>
        <p className="mt-0.5">Diseño centrado en el asesor de microemprendedores.</p>
      </div>
    </aside>
  );
};
