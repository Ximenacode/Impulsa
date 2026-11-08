import React, { useState, useMemo } from 'react';
import { useContactos } from '../../context/ContactContext';
import { Contacto, EtapaComercial } from '../../types';
import {
  getEstadoFecha,
  formatFechaEtiqueta,
  getIniciales,
} from '../../utils/dateUtils';
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
  icon: React.ComponentType<{ className?: string }>;
  colorBorde: string;
}[] = [
  {
    id: 'nuevo',
    titulo: 'Nuevo',
    icon: Sparkles,
    colorBorde: 'border-t-[#1E5670]',
  },
  {
    id: 'contactado',
    titulo: 'Contactado',
    icon: Clock,
    colorBorde: 'border-t-[#4A3A73]',
  },
  {
    id: 'interesado',
    titulo: 'Interesado',
    icon: Tag,
    colorBorde: 'border-t-acento-calido',
  },
  {
    id: 'cerrado_con_venta',
    titulo: 'Cerrado con venta',
    icon: CheckCircle2,
    colorBorde: 'border-t-estado-ganadoText',
  },
  {
    id: 'cerrado_sin_venta',
    titulo: 'Cerrado sin venta',
    icon: XCircle,
    colorBorde: 'border-t-texto-terciario',
  },
];

export const OportunidadesScreen: React.FC<OportunidadesScreenProps> = ({
  onAbrirNuevoContacto,
  onCerrarOportunidad,
}) => {
  const { contactos, cambiarEtapa, navegarA } = useContactos();

  // Filtro activo para la vista móvil
  const [etapaMovil, setEtapaMovil] = useState<string>('todas');

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

  // Filtrado para móvil
  const contactosMovil = useMemo(() => {
    if (etapaMovil === 'todas') return contactos;
    return contactos.filter((c) => c.etapa === etapaMovil);
  }, [contactos, etapaMovil]);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Encabezado de página */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-borde-suave">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-texto-principal tracking-tight">
            Oportunidades
          </h1>
          <p className="text-sm text-texto-secundario mt-0.5">
            Supervisa el avance comercial de cada prospecto desde la captación hasta el cierre
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirNuevoContacto}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-petroleo-700 text-white text-xs sm:text-sm font-semibold hover:bg-petroleo-800 active:bg-petroleo-900 shadow-xs transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-petroleo-700"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Nuevo contacto</span>
        </button>
      </div>

      {/* SELECTOR ADAPTADO PARA MÓVIL (Evita desplazamiento horizontal excesivo) */}
      <div className="md:hidden bg-superficie p-3.5 rounded-tarjeta border border-borde-suave shadow-tarjeta space-y-3">
        <label htmlFor="filtro-oportunidades-movil" className="block text-xs font-semibold text-texto-principal">
          Ver etapa comercial:
        </label>
        <select
          id="filtro-oportunidades-movil"
          value={etapaMovil}
          onChange={(e) => setEtapaMovil(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs text-texto-principal bg-fondo focus:outline-none focus:ring-2 focus:ring-petroleo-700"
        >
          <option value="todas">Todas las etapas ({contactos.length})</option>
          {ETAPAS.map((et) => (
            <option key={et.id} value={et.id}>
              {et.titulo} ({agrupadas[et.id].length})
            </option>
          ))}
        </select>

        {/* Lista de tarjetas adaptada en móvil */}
        <div className="space-y-3 pt-1">
          {contactosMovil.length === 0 ? (
            <p className="text-xs text-texto-terciario text-center py-4 italic">
              No hay oportunidades en esta etapa
            </p>
          ) : (
            contactosMovil.map((contacto) => (
              <TarjetaOportunidad
                key={contacto.id}
                contacto={contacto}
                onNavegarDetalle={() => navegarA('detalle', contacto.id)}
                onCambioEtapa={(nueva) => handleCambioEtapa(contacto, nueva)}
              />
            ))
          )}
        </div>
      </div>

      {/* TABLERO DE COLUMNAS PARA ESCRITORIO (Visible en md+) */}
      <div className="hidden md:grid md:grid-cols-5 gap-3.5 items-start">
        {ETAPAS.map((columna) => {
          const Icon = columna.icon;
          const lista = agrupadas[columna.id] || [];

          return (
            <section
              key={columna.id}
              aria-label={`Etapa comercial: ${columna.titulo}`}
              className={`bg-fondo rounded-tarjeta border border-borde-suave border-t-4 ${columna.colorBorde} p-3 space-y-3 flex flex-col min-h-[380px] shadow-2xs`}
            >
              {/* Encabezado de la columna */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-texto-secundario shrink-0" aria-hidden="true" />
                  <h2 className="text-xs font-bold text-texto-principal truncate">
                    {columna.titulo}
                  </h2>
                </div>
                <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-superficie border border-borde-suave text-texto-secundario">
                  {lista.length}
                </span>
              </div>

              {/* Lista de tarjetas en esta etapa */}
              <div className="space-y-2.5 flex-1">
                {lista.length === 0 ? (
                  <div className="p-4 text-center text-xs text-texto-terciario italic bg-superficie/60 rounded-lg border border-dashed border-borde-suave">
                    Sin prospectos
                  </div>
                ) : (
                  lista.map((contacto) => (
                    <TarjetaOportunidad
                      key={contacto.id}
                      contacto={contacto}
                      onNavegarDetalle={() => navegarA('detalle', contacto.id)}
                      onCambioEtapa={(nueva) => handleCambioEtapa(contacto, nueva)}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

interface TarjetaOportunidadProps {
  contacto: Contacto;
  onNavegarDetalle: () => void;
  onCambioEtapa: (nueva: EtapaComercial) => void;
}

const TarjetaOportunidad: React.FC<TarjetaOportunidadProps> = ({
  contacto,
  onNavegarDetalle,
  onCambioEtapa,
}) => {
  const estadoFecha = contacto.fechaProximoContacto
    ? getEstadoFecha(contacto.fechaProximoContacto)
    : 'sin_fecha';
  const etiquetaFecha = contacto.fechaProximoContacto
    ? formatFechaEtiqueta(contacto.fechaProximoContacto)
    : null;
  const iniciales = getIniciales(contacto.nombre);

  return (
    <article className="bg-superficie rounded-xl border border-borde-suave p-3 shadow-tarjeta space-y-2 hover:border-petroleo-200 transition-all">
      <div className="flex items-start gap-2">
        <div
          className="w-6 h-6 rounded-full bg-petroleo-50 text-petroleo-700 border border-petroleo-200 flex items-center justify-center font-bold text-[10px] shrink-0 select-none"
          aria-hidden="true"
        >
          {iniciales}
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onNavegarDetalle}
            className="text-left font-bold text-xs text-texto-principal hover:text-petroleo-700 focus:outline-none focus:underline truncate block w-full"
          >
            {contacto.nombre}
          </button>
          {contacto.negocio && (
            <p className="text-[11px] text-texto-secundario truncate flex items-center gap-1 mt-0.5">
              <Building className="w-2.5 h-2.5 text-texto-terciario shrink-0" />
              <span>{contacto.negocio}</span>
            </p>
          )}
        </div>
      </div>

      <p className="text-[11px] text-texto-secundario line-clamp-2 leading-relaxed">
        {contacto.necesidad}
      </p>

      <div className="flex flex-wrap gap-1 pt-0.5">
        <OrigenBadge origen={contacto.origen} />
        {contacto.productoInteres && (
          <ProductoBadge producto={contacto.productoInteres} />
        )}
      </div>

      {/* Seguimiento pendiente si existe */}
      {contacto.fechaProximoContacto && etiquetaFecha && (
        <div className="pt-0.5">
          <FechaEstadoBadge estado={estadoFecha} texto={etiquetaFecha} />
        </div>
      )}

      {/* Motivo de descarte si aplica */}
      {contacto.etapa === 'cerrado_sin_venta' && contacto.motivoPerdida && (
        <p className="text-[10px] text-texto-secundario italic bg-fondo p-1.5 rounded border border-borde-suave">
          "{contacto.motivoPerdida}"
        </p>
      )}

      {/* Selector accesible de etapa */}
      <div className="pt-1.5 border-t border-borde-suave">
        <label htmlFor={`etapa-select-${contacto.id}`} className="sr-only">
          Mover etapa de {contacto.nombre}
        </label>
        <select
          id={`etapa-select-${contacto.id}`}
          value={contacto.etapa}
          onChange={(e) => onCambioEtapa(e.target.value as EtapaComercial)}
          className="w-full text-[11px] py-1 px-1.5 rounded-md border border-borde-suave bg-fondo hover:bg-superficie text-texto-principal font-medium focus:outline-none focus:ring-1 focus:ring-petroleo-700 transition-colors"
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
};
