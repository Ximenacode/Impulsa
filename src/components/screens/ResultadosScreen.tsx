import React from 'react';
import { useContactos } from '../../context/ContactContext';
import { EtapaComercial, OrigenContacto } from '../../types';
import {
  HelpCircle,
  CheckCircle2,
  Users,
  Target,
  BarChart2,
  Building2,
  AlertCircle,
} from 'lucide-react';

export const ResultadosScreen: React.FC = () => {
  const { contactos } = useContactos();

  const totalOportunidades = contactos.length;

  const cerradasConVenta = contactos.filter(
    (c) => c.etapa === 'cerrado_con_venta'
  ).length;

  const cerradasSinVenta = contactos.filter(
    (c) => c.etapa === 'cerrado_sin_venta'
  ).length;

  // Cálculo seguro de tasa de conversión evitando división entre cero
  const tasaConversion =
    totalOportunidades > 0
      ? ((cerradasConVenta / totalOportunidades) * 100).toFixed(1)
      : null;

  // Distribución por etapa
  const etapasConfig: { id: EtapaComercial; label: string; color: string }[] = [
    { id: 'nuevo', label: 'Nuevo', color: 'bg-blue-500' },
    { id: 'contactado', label: 'Contactado', color: 'bg-purple-500' },
    { id: 'interesado', label: 'Interesado', color: 'bg-amber-500' },
    { id: 'cerrado_con_venta', label: 'Cerrado con venta', color: 'bg-emerald-600' },
    { id: 'cerrado_sin_venta', label: 'Cerrado sin venta', color: 'bg-slate-400' },
  ];

  const conteoEtapas = etapasConfig.map((etapa) => {
    const cantidad = contactos.filter((c) => c.etapa === etapa.id).length;
    const porcentaje =
      totalOportunidades > 0
        ? Math.round((cantidad / totalOportunidades) * 100)
        : 0;
    return { ...etapa, cantidad, porcentaje };
  });

  // Distribución por origen
  const origenesConfig: { id: OrigenContacto; label: string; color: string }[] = [
    { id: 'visita', label: 'Visita presencial', color: 'bg-cyan-600' },
    { id: 'referido', label: 'Referido', color: 'bg-emerald-600' },
    { id: 'campana', label: 'Campaña de difusión', color: 'bg-indigo-600' },
  ];

  const conteoOrigenes = origenesConfig.map((orig) => {
    const cantidad = contactos.filter((c) => c.origen === orig.id).length;
    const porcentaje =
      totalOportunidades > 0
        ? Math.round((cantidad / totalOportunidades) * 100)
        : 0;
    return { ...orig, cantidad, porcentaje };
  });

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Panel de Resultados y Conversión
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Métricas calculadas sobre la cartera de demostración para evaluar la gestión comercial.
        </p>
      </div>

      {/* Aviso de rigor metodológico */}
      <div
        role="note"
        aria-label="Nota de demostración"
        className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600"
      >
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong>Aviso de portafolio:</strong> Estos indicadores reflejan exclusivamente los datos ficticios y de prueba guardados en el navegador. No constituyen evidencia de incremento de ventas ni de resultados en entidades financieras reales.
        </p>
      </div>

      {/* Tarjetas KPI principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Oportunidades */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Oportunidades</span>
            <Users className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 pt-1">
            {totalOportunidades}
          </p>
          <p className="text-xs text-slate-500">
            Prospectos y clientes registrados
          </p>
        </div>

        {/* Cierres con Venta */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <span>Cierres con Venta</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 pt-1">
            {cerradasConVenta}
          </p>
          <p className="text-xs text-slate-500">
            {cerradasSinVenta} oportunidades cerradas sin venta
          </p>
        </div>

        {/* Tasa de Conversión */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-petroleo-800 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <span>Tasa de Conversión</span>
            </span>
            <Target className="w-4 h-4 text-petroleo-700" aria-hidden="true" />
          </div>
          <p className="text-3xl font-extrabold text-petroleo-900 pt-1">
            {tasaConversion !== null ? `${tasaConversion}%` : 'Sin datos'}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <HelpCircle className="w-3 h-3 text-slate-400" aria-hidden="true" />
            <span>Fórmula: (Cerrados con venta / Total) × 100</span>
          </div>
        </div>
      </div>

      {/* Desgloses en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Desglose por Etapa Comercial */}
        <section
          aria-labelledby="titulo-etapas"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 id="titulo-etapas" className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-petroleo-700" aria-hidden="true" />
              <span>Oportunidades por Etapa Comercial</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {totalOportunidades} en total
            </span>
          </div>

          <div className="space-y-3">
            {conteoEtapas.map((etapa) => (
              <div key={etapa.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>{etapa.label}</span>
                  <span className="text-slate-500">
                    <strong>{etapa.cantidad}</strong> ({etapa.porcentaje}%)
                  </span>
                </div>
                {/* Barra de progreso accesible */}
                <div
                  role="progressbar"
                  aria-label={`${etapa.label}: ${etapa.cantidad} oportunidades, ${etapa.porcentaje}%`}
                  aria-valuenow={etapa.porcentaje}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full ${etapa.color} rounded-full transition-all duration-300`}
                    style={{ width: `${etapa.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Desglose por Origen de Captación */}
        <section
          aria-labelledby="titulo-origen"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 id="titulo-origen" className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-petroleo-700" aria-hidden="true" />
              <span>Oportunidades por Canal de Origen</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {totalOportunidades} en total
            </span>
          </div>

          <div className="space-y-3">
            {conteoOrigenes.map((orig) => (
              <div key={orig.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>{orig.label}</span>
                  <span className="text-slate-500">
                    <strong>{orig.cantidad}</strong> ({orig.porcentaje}%)
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${orig.label}: ${orig.cantidad} oportunidades, ${orig.porcentaje}%`}
                  aria-valuenow={orig.porcentaje}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full ${orig.color} rounded-full transition-all duration-300`}
                    style={{ width: `${orig.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
            💡 <strong>Observación para diseño:</strong> La categorización por origen permite al asesor contrastar la calidad de los prospectos según provengan de visitas directas, recomendaciones o campañas comerciales.
          </div>
        </section>
      </div>
    </div>
  );
};
