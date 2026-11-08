import React from 'react';
import { EtapaComercial, OrigenContacto, ProductoInteres } from '../../types';
import { EstadoFecha } from '../../utils/dateUtils';
import { Clock, CheckCircle2, Calendar, AlertCircle, Tag, Sparkles, Building2 } from 'lucide-react';

export const EtapaBadge: React.FC<{ etapa: EtapaComercial }> = ({ etapa }) => {
  switch (etapa) {
    case 'nuevo':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F0F7FB] text-[#1E5670] border border-[#CFE4F0]">
          <Sparkles className="w-3 h-3 text-[#1E5670]" aria-hidden="true" />
          <span>Nuevo</span>
        </span>
      );
    case 'contactado':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F7F4FB] text-[#4A3A73] border border-[#E1D8F1]">
          <Clock className="w-3 h-3 text-[#4A3A73]" aria-hidden="true" />
          <span>Contactado</span>
        </span>
      );
    case 'interesado':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-acento-calidoLight text-[#8C5D19] border border-acento-calidoBorder">
          <Tag className="w-3 h-3 text-[#8C5D19]" aria-hidden="true" />
          <span>Interesado</span>
        </span>
      );
    case 'cerrado_con_venta':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-estado-ganadoBg text-estado-ganadoText border border-estado-ganadoBorder">
          <CheckCircle2 className="w-3 h-3 text-estado-ganadoText" aria-hidden="true" />
          <span>Cerrado con venta</span>
        </span>
      );
    case 'cerrado_sin_venta':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-estado-perdidoBg text-estado-perdidoText border border-estado-perdidoBorder">
          <span className="w-1.5 h-1.5 rounded-full bg-texto-terciario" aria-hidden="true" />
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
      classes: 'bg-[#F2F8F4] text-[#205C38] border-[#CFE6D6]',
    },
    campana: {
      label: 'Campaña',
      classes: 'bg-[#F2F6FA] text-[#24537D] border-[#D1E0EE]',
    },
    visita: {
      label: 'Visita presencial',
      classes: 'bg-petroleo-50 text-petroleo-700 border-petroleo-200',
    },
  }[origen];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${config.classes}`}
    >
      <Building2 className="w-3 h-3 opacity-80" aria-hidden="true" />
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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-fondo text-texto-secundario border border-borde-suave">
      <span>{labels[producto]}</span>
    </span>
  );
};

export const FechaEstadoBadge: React.FC<{
  estado: EstadoFecha;
  texto: string;
}> = ({ estado, texto }) => {
  switch (estado) {
    case 'vencido':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-estado-vencidoBg text-estado-vencidoText border border-estado-vencidoBorder">
          <AlertCircle className="w-3 h-3 text-estado-vencidoText shrink-0" aria-hidden="true" />
          <span>{texto}</span>
        </span>
      );
    case 'hoy':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-estado-hoyBg text-estado-hoyText border border-estado-hoyBorder">
          <Calendar className="w-3 h-3 text-estado-hoyText shrink-0" aria-hidden="true" />
          <span>{texto}</span>
        </span>
      );
    case 'proximo':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-estado-proximoBg text-estado-proximoText border border-estado-proximoBorder">
          <Calendar className="w-3 h-3 text-texto-terciario shrink-0" aria-hidden="true" />
          <span>{texto}</span>
        </span>
      );
    default:
      return null;
  }
};
