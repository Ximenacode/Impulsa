import React, { useMemo } from 'react';
import { useContactos } from '../../context/ContactContext';
import { Contacto, EtapaComercial } from '../../types';
import { getEstadoFecha, formatFechaLegible } from '../../utils/dateUtils';
import { FechaEstadoBadge, ProductoBadge, OrigenBadge } from '../common/Badge';
import {
  Sparkles,
  Clock,
  Tag,
  CheckCircle2,
  XCircle,
  Building,
  Plus,
} from 'lucide-react';

interface OportunidadesScreenProps {
  onAbrirNuevoContacto: () => void;
  onCerrarOportunidad: (
    contacto: Contacto,
    etapa: 'cerrado_con_venta' | 'cerrado_sin_venta'
  ) => void;
}

const ETAPAS: {
  id: EtapaComercial;
  titulo: string;
  descripcion: string;
  icon: React.ComponentType<{ className?: string }>;
  colorBorde: string;
}[] = [
  {
    id: 'nuevo',
    titulo: 'Nuevo',
    descripcion: 'Prospectos recién captados sin contacto inicial',
    icon: Sparkles,
    colorBorde: 'border-t-blue-500',
  },
  {
    id: 'contactado',
    titulo: 'Contactado',
    descripcion: 'Primer contacto realizado o en proceso de levantamiento',
    icon: Clock,
    colorBorde: 'border-t-purple-500',
  },
  {
    id: 'interesado',
    titulo: 'Interesado',
    descripcion: 'Interés confirmado y requisitos en revisión',
    icon: Tag,
    colorBorde: 'border-t-amber-500',
  },
  {
    id: 'cerrado_con_venta',
    titulo: 'Cerrado con venta',
    descripcion: 'Operación concretada con éxito',
    icon: CheckCircle2,
    colorBorde: 'border-t-emerald-600',
  },
  {
    id: 'cerrado_sin_venta',
    titulo: 'Cerrado sin venta',
    descripcion: 'Oportunidad no concretada o desistida',
    icon: XCircle,
    colorBorde: 'border-t-slate-400',
  },
];

export const OportunidadesScreen: React.FC<OportunidadesScreenProps> = ({
  onAbrirNuevoContacto,
  onCerrarOportunidad,
}) => {
  const { contactos, cambiarEtapa, navegarA } = useContactos();

  // Agrupar oportunidades por etapa
  const agrupadas = useMemo(() => {
    const mapa: Record<EtapaComercial, Contacto[]> = {
      nuevo: [],
      contactado: [],
      interesado: [],
      cerrado_con_venta: [],
      cerrado_sin_venta: [],
    };

    contactos.forEach((c) => {
      if (mapa[c.etapa]) {
        mapa[c.etapa].push(c);
      }
    });

    return mapa;
  }, [contactos]);

  const handleCambioEtapa = (contacto: Contacto, nuevaEtapa: EtapaComercial) => {
    if (nuevaEtapa === 'cerrado_con_venta' || nuevaEtapa === 'cerrado_sin_venta') {
      onCerrarOportunidad(contacto, nuevaEtapa);
    } else {
      cambiarEtapa(contacto.id, nuevaEtapa);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tablero de Oportunidades
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Supervisa el avance comercial de cada emprendedor desde la captación hasta el cierre.
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirNuevoContacto}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-petroleo-700 text-white text-sm font-semibold hover:bg-petroleo-800 active:bg-petroleo-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-petroleo-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Nuevo contacto</span>
        </button>
      </div>

      {/* Nota de diseño accesible */}
      <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span>
          💡 <strong>Navegación accesible:</strong> Puedes mover cualquier oportunidad de etapa utilizando el menú desplegable individual de cada tarjeta, sin depender de arrastrar con mouse.
        </span>
      </div>

      {/* Columnas de etapas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {ETAPAS.map((columna) => {
          const Icon = columna.icon;
          const lista = agrupadas[columna.id] || [];

          return (
            <section
              key={columna.id}
              aria-label={`Etapa comercial: ${columna.titulo}`}
              className={`bg-slate-100/70 rounded-xl border border-slate-200 border-t-4 ${columna.colorBorde} p-3 space-y-3 flex flex-col min-h-[350px]`}
            >
              {/* Cabecera de la columna */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  <h2 className="text-sm font-bold text-slate-900">
                    {columna.titulo}
                  </h2>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                  {lista.length}
                </span>
              </div>

              {/* Lista de tarjetas en esta etapa */}
              <div className="space-y-2.5 flex-1">
                {lista.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 italic bg-white/50 rounded-lg border border-dashed border-slate-200">
                    Sin oportunidades en esta etapa
                  </div>
                ) : (
                  lista.map((contacto) => {
                    const estadoFecha = contacto.fechaProximoContacto
                      ? getEstadoFecha(contacto.fechaProximoContacto)
                      : 'sin_fecha';

                    return (
                      <article
                        key={contacto.id}
                        className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs hover:shadow-xs transition-shadow space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <button
                            type="button"
                            onClick={() => navegarA('detalle', contacto.id)}
                            className="text-left font-bold text-sm text-slate-900 hover:text-petroleo-800 focus:outline-none focus:underline"
                          >
                            {contacto.nombre}
                          </button>
                        </div>

                        {contacto.negocio && (
                          <p className="text-xs text-slate-600 flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" aria-hidden="true" />
                            <span className="truncate">{contacto.negocio}</span>
                          </p>
                        )}

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {contacto.necesidad}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          <OrigenBadge origen={contacto.origen} />
                          {contacto.productoInteres && (
                            <ProductoBadge producto={contacto.productoInteres} />
                          )}
                        </div>

                        {/* Seguimiento pendiente si existe */}
                        {contacto.fechaProximoContacto && (
                          <div className="pt-1">
                            <FechaEstadoBadge
                              estado={estadoFecha}
                              texto={formatFechaLegible(contacto.fechaProximoContacto)}
                            />
                          </div>
                        )}

                        {/* Motivo de no venta si aplica */}
                        {columna.id === 'cerrado_sin_venta' && contacto.motivoPerdida && (
                          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                            "{contacto.motivoPerdida}"
                          </p>
                        )}

                        {/* Selector accesible de etapa */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                          <label htmlFor={`etapa-select-${contacto.id}`} className="sr-only">
                            Mover {contacto.nombre} a otra etapa
                          </label>
                          <select
                            id={`etapa-select-${contacto.id}`}
                            value={contacto.etapa}
                            onChange={(e) =>
                              handleCambioEtapa(contacto, e.target.value as EtapaComercial)
                            }
                            className="w-full text-xs py-1 px-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-petroleo-700"
                          >
                            <option value="nuevo">Mover a: Nuevo</option>
                            <option value="contactado">Mover a: Contactado</option>
                            <option value="interesado">Mover a: Interesado</option>
                            <option value="cerrado_con_venta">Mover a: Cerrado con venta</option>
                            <option value="cerrado_sin_venta">Mover a: Cerrado sin venta</option>
                          </select>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
