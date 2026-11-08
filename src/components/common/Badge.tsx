import React from 'react';
import { EtapaComercial, OrigenContacto, ProductoInteres } from '../../types';
import { EstadoFecha } from '../../utils/dateUtils';
import { Clock, CheckCircle2, Calendar, AlertTriangle, Tag, Sparkles, Building2 } from 'lucide-react';

export const EtapaBadge: React.FC<{ etapa: EtapaComercial }> = ({ etapa }) => {
  switch (etapa) {
    case 'nuevo':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
          <Sparkles className="w-3 h-3 text-blue-600" aria-hidden="true" />
          <span>Nuevo</span>
        </span>
      );
    case 'contactado':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
          <Clock className="w-3 h-3 text-purple-600" aria-hidden="true" />
          <span>Contactado</span>
        </span>
      );
    case 'interesado':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
          <Tag className="w-3 h-3 text-amber-600" aria-hidden="true" />
          <span>Interesado</span>
        </span>
      );
    case 'cerrado_con_venta':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
          <span>Cerrado con venta</span>
        </span>
      );
    case 'cerrado_sin_venta':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" aria-hidden="true" />
          <span>Cerrado sin venta</span>
        </span>
      );
    default:
      return null;
  }
};

export const OrigenBadge: React.FC<{ origen: OrigenContacto }> = ({ origen }) => {
  const config = {
    referido: {
      label: 'Referido',
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    campana: {
      label: 'Campaña',
      classes: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    visita: {
      label: 'Visita presencial',
      classes: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    },
  }[origen];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.classes}`}
    >
      <Building2 className="w-3 h-3 opacity-70" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export const ProductoBadge: React.FC<{ producto?: ProductoInteres }> = ({ producto }) => {
  if (!producto) return null;
  const labels: Record<ProductoInteres, string> = {
    financiamiento: 'Financiamiento',
    ahorro: 'Ahorro',
    servicios_pago: 'Servicios de pago',
    otro: 'Otro producto',
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <span>{labels[producto]}</span>
    </span>
  );
};

export const FechaEstadoBadge: React.FC<{
  estado: EstadoFecha;
  texto?: string;
}> = ({ estado, texto }) => {
  switch (estado) {
    case 'vencido':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
          <span>{texto || 'Vencido'}</span>
        </span>
      );
    case 'hoy':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-petroleo-50 text-petroleo-900 border border-petroleo-300">
          <Calendar className="w-3.5 h-3.5 text-petroleo-700" aria-hidden="true" />
          <span>{texto || 'Para hoy'}</span>
        </span>
      );
    case 'proximo':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>{texto || 'Próximo'}</span>
        </span>
      );
    default:
      return null;
  }
};
