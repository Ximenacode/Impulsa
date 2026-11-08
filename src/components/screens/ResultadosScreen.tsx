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
  Info,
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

  // Cálculo de tasa de conversión con protección contra división entre cero
  const tasaConversion =
    totalOportunidades > 0
      ? ((cerradasConVenta / totalOportunidades) * 100).toFixed(1)
      : null;

  // Distribución por etapa comercial
  const etapasConfig: { id: EtapaComercial; label: string; color: string }[] = [
    { id: 'nuevo', label: 'Nuevo', color: 'bg-[#1E5670]' },
    { id: 'contactado', label: 'Contactado', color: 'bg-[#4A3A73]' },
    { id: 'interesado', label: 'Interesado', color: 'bg-acento-calido' },
    { id: 'cerrado_con_venta', label: 'Cerrado con venta', color: 'bg-estado-ganadoText' },
    { id: 'cerrado_sin_venta', label: 'Cerrado sin venta', color: 'bg-texto-terciario' },
  ];

  const conteoEtapas = etapasConfig.map((etapa) => {
    const cantidad = contactos.filter((c) => c.etapa === etapa.id).length;
    const porcentaje =
      totalOportunidades > 0
        ? Math.round((cantidad / totalOportunidades) * 100)
        : 0;
    return { ...etapa, cantidad, porcentaje };
  });

  // Distribución por canal de origen
  const origenesConfig: { id: OrigenContacto; label: string; color: string }[] = [
    { id: 'visita', label: 'Visita presencial', color: 'bg-petroleo-700' },
    { id: 'referido', label: 'Referido', color: 'bg-[#205C38]' },
    { id: 'campana', label: 'Campaña de difusión', color: 'bg-[#24537D]' },
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
    <div className="space-y-6 max-w-5xl">
      {/* Encabezado de página */}
      <div className="pb-2 border-b border-borde-suave">
        <h1 className="text-2xl sm:text-3xl font-bold text-texto-principal tracking-tight">
          Resultados y Conversión
        </h1>
        <p className="text-sm text-texto-secundario mt-0.5">
          Indicadores calculados sobre la cartera registrada en este navegador
        </p>
      </div>

      {/* Identificación de datos demostrativos */}
      <div
        role="note"
        aria-label="Aviso de datos demostrativos"
        className="p-3.5 bg-fondo rounded-tarjeta border border-borde-suave flex items-start gap-2.5 text-xs text-texto-secundario"
      >
        <Info className="w-4 h-4 text-petroleo-700 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="text-texto-principal">Datos demostrativos:</strong> Estos indicadores reflejan las oportunidades registradas localmente en este prototipo. No constituyen evidencia de incremento de ventas ni datos de entidades reales.
        </p>
      </div>

      {/* Tarjetas de indicadores clave (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Oportunidades */}
        <div className="bg-superficie p-5 rounded-tarjeta border border-borde-suave shadow-tarjeta space-y-1">
          <div className="flex items-center justify-between text-texto-secundario text-xs font-semibold uppercase tracking-wider">
            <span>Total Oportunidades</span>
            <Users className="w-4 h-4 text-texto-terciario" aria-hidden="true" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-texto-principal pt-1">
            {totalOportunidades}
          </p>
          <p className="text-xs text-texto-terciario">
            Prospectos registrados
          </p>
        </div>

        {/* Cierres con Venta */}
        <div className="bg-superficie p-5 rounded-tarjeta border border-borde-suave shadow-tarjeta space-y-1">
          <div className="flex items-center justify-between text-estado-ganadoText text-xs font-semibold uppercase tracking-wider">
            <span>Cierres con Venta</span>
            <CheckCircle2 className="w-4 h-4 text-estado-ganadoText" aria-hidden="true" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-estado-ganadoText pt-1">
            {cerradasConVenta}
          </p>
          <p className="text-xs text-texto-terciario">
            {cerradasSinVenta} cerrados sin venta
          </p>
        </div>

        {/* Tasa de Conversión */}
        <div className="bg-superficie p-5 rounded-tarjeta border border-borde-suave shadow-tarjeta space-y-1">
          <div className="flex items-center justify-between text-petroleo-700 text-xs font-semibold uppercase tracking-wider">
            <span>Tasa de Conversión</span>
            <Target className="w-4 h-4 text-petroleo-700" aria-hidden="true" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-texto-principal pt-1">
            {tasaConversion !== null ? `${tasaConversion}%` : 'Sin datos'}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-texto-terciario">
            <HelpCircle className="w-3 h-3 text-texto-terciario" aria-hidden="true" />
            <span>(Cierres con venta / Total) × 100</span>
          </div>
        </div>
      </div>

      {/* Gráficos sencillos de comparación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Distribución por Etapa Comercial */}
        <section
          aria-labelledby="titulo-etapas"
          className="bg-superficie p-5 rounded-tarjeta border border-borde-suave shadow-tarjeta space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-borde-suave">
            <h2 id="titulo-etapas" className="text-xs sm:text-sm font-bold text-texto-principal flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-petroleo-700" aria-hidden="true" />
              <span>Oportunidades por Etapa</span>
            </h2>
            <span className="text-[11px] text-texto-terciario font-medium">
              {totalOportunidades} en total
            </span>
          </div>

          <div className="space-y-3">
            {conteoEtapas.map((etapa) => (
              <div key={etapa.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-texto-secundario">
                  <span>{etapa.label}</span>
                  <span className="text-texto-principal font-semibold">
                    {etapa.cantidad} ({etapa.porcentaje}%)
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${etapa.label}: ${etapa.cantidad} oportunidades, ${etapa.porcentaje}%`}
                  aria-valuenow={etapa.porcentaje}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="w-full bg-fondo h-2 rounded-full overflow-hidden border border-borde-suave"
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

        {/* Distribución por Canal de Origen */}
        <section
          aria-labelledby="titulo-origen"
          className="bg-superficie p-5 rounded-tarjeta border border-borde-suave shadow-tarjeta space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-borde-suave">
            <h2 id="titulo-origen" className="text-xs sm:text-sm font-bold text-texto-principal flex items-center gap-2">
              <Building2 className="w-4 h-4 text-petroleo-700" aria-hidden="true" />
              <span>Oportunidades por Canal de Origen</span>
            </h2>
            <span className="text-[11px] text-texto-terciario font-medium">
              {totalOportunidades} en total
            </span>
          </div>

          <div className="space-y-3">
            {conteoOrigenes.map((orig) => (
              <div key={orig.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-texto-secundario">
                  <span>{orig.label}</span>
                  <span className="text-texto-principal font-semibold">
                    {orig.cantidad} ({orig.porcentaje}%)
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${orig.label}: ${orig.cantidad} oportunidades, ${orig.porcentaje}%`}
                  aria-valuenow={orig.porcentaje}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="w-full bg-fondo h-2 rounded-full overflow-hidden border border-borde-suave"
                >
                  <div
                    className={`h-full ${orig.color} rounded-full transition-all duration-300`}
                    style={{ width: `${orig.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-texto-terciario leading-relaxed pt-1">
            Esta distribución permite comparar el flujo de prospectos generados en campo frente a los referidos por clientes existentes.
          </p>
        </section>
      </div>
    </div>
  );
};
