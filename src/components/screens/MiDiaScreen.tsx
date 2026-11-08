import React, { useMemo } from 'react';
import { useContactos } from '../../context/ContactContext';
import { Contacto } from '../../types';
import {
  getEstadoFecha,
  formatFechaEtiqueta,
  getDiasDiferencia,
  getFechaActualEspanol,
  getIniciales,
} from '../../utils/dateUtils';
import { FechaEstadoBadge, EtapaBadge, OrigenBadge } from '../common/Badge';
import {
  AlertCircle,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface MiDiaScreenProps {
  onAbrirNuevoContacto: () => void;
  onRegistrarSeguimiento: (contacto: Contacto) => void;
}

export const MiDiaScreen: React.FC<MiDiaScreenProps> = ({
  onAbrirNuevoContacto,
  onRegistrarSeguimiento,
}) => {
  const { contactos, navegarA } = useContactos();

  // Filtrar y clasificar contactos con seguimiento activo
  const { vencidos, paraHoy, proximos } = useMemo(() => {
    const conSeguimiento = contactos.filter(
      (c) => c.proximaAccion && c.fechaProximoContacto
    );

    const venc: Contacto[] = [];
    const hoy: Contacto[] = [];
    const prox: Contacto[] = [];

    conSeguimiento.forEach((c) => {
      const estado = getEstadoFecha(c.fechaProximoContacto);
      if (estado === 'vencido') {
        venc.push(c);
      } else if (estado === 'hoy') {
        hoy.push(c);
      } else if (estado === 'proximo') {
        prox.push(c);
      }
    });

    // Ordenar vencidos: los más atrasados primero
    venc.sort(
      (a, b) =>
        getDiasDiferencia(a.fechaProximoContacto!) -
        getDiasDiferencia(b.fechaProximoContacto!)
    );

    // Ordenar hoy: alfabético
    hoy.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Ordenar próximos: el más cercano primero
    prox.sort(
      (a, b) =>
        getDiasDiferencia(a.fechaProximoContacto!) -
        getDiasDiferencia(b.fechaProximoContacto!)
    );

    return { vencidos: venc, paraHoy: hoy, proximos: prox };
  }, [contactos]);

  const totalPendientes = vencidos.length + paraHoy.length + proximos.length;

  return (
    <div className="space-y-7 max-w-5xl">
      {/* Encabezado de página */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-borde-suave">
        <div>
          <span className="text-xs font-medium text-texto-secundario uppercase tracking-wider block mb-1">
            {getFechaActualEspanol()}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-texto-principal tracking-tight">
            Mi día
          </h1>
          <p className="text-sm text-texto-secundario mt-0.5">
            Tus próximos contactos, en un solo lugar
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

      {/* Resumen: Tres indicadores compactos con superficies neutras */}
      <section
        aria-label="Resumen de prioridades del día"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
      >
        {/* Vencidos */}
        <div className="bg-superficie rounded-tarjeta border border-borde-suave p-4 shadow-tarjeta flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-texto-secundario block">
              Vencidos
            </span>
            <span className="text-2xl font-bold text-texto-principal mt-0.5 block">
              {vencidos.length}
            </span>
            <span className="text-[11px] text-texto-terciario">
              {vencidos.length === 1 ? 'Requiere atención' : 'Requieren atención'}
            </span>
          </div>
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              vencidos.length > 0
                ? 'bg-estado-vencidoBg text-estado-vencidoText border border-estado-vencidoBorder'
                : 'bg-fondo text-texto-terciario'
            }`}
          >
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* Para hoy */}
        <div className="bg-superficie rounded-tarjeta border border-borde-suave p-4 shadow-tarjeta flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-texto-secundario block">
              Para hoy
            </span>
            <span className="text-2xl font-bold text-texto-principal mt-0.5 block">
              {paraHoy.length}
            </span>
            <span className="text-[11px] text-texto-terciario">
              {paraHoy.length === 1 ? 'Agendado para hoy' : 'Agendados para hoy'}
            </span>
          </div>
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              paraHoy.length > 0
                ? 'bg-petroleo-50 text-petroleo-700 border border-petroleo-200'
                : 'bg-fondo text-texto-terciario'
            }`}
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* Próximos días */}
        <div className="bg-superficie rounded-tarjeta border border-borde-suave p-4 shadow-tarjeta flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-texto-secundario block">
              Próximos días
            </span>
            <span className="text-2xl font-bold text-texto-principal mt-0.5 block">
              {proximos.length}
            </span>
            <span className="text-[11px] text-texto-terciario">
              Seguimientos a futuro
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-fondo text-texto-terciario flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Si no hay pendientes en absoluto */}
      {totalPendientes === 0 && (
        <div className="bg-superficie rounded-tarjeta border border-borde-suave p-8 text-center max-w-md mx-auto space-y-3 shadow-tarjeta">
          <div className="w-10 h-10 rounded-full bg-estado-ganadoBg text-estado-ganadoText mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-texto-principal">
            ¡Estás completamente al día!
          </h2>
          <p className="text-xs text-texto-secundario leading-relaxed">
            No tienes tareas pendientes ni atrasadas para hoy. Puedes registrar un nuevo contacto para seguir ampliando tu cartera.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={onAbrirNuevoContacto}
              className="px-4 py-2 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 transition-colors"
            >
              Nuevo contacto
            </button>
            <button
              type="button"
              onClick={() => navegarA('contactos')}
              className="px-4 py-2 rounded-lg border border-borde-suave text-texto-secundario hover:text-texto-principal hover:bg-fondo text-xs font-semibold transition-colors"
            >
              Ver contactos
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN 1: REQUIEREN ATENCIÓN (Vencidos) */}
      {vencidos.length > 0 && (
        <section aria-labelledby="seccion-vencidos" className="space-y-3.5">
          <div className="flex items-center gap-2">
            <h2 id="seccion-vencidos" className="text-sm font-bold text-texto-principal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-estado-vencidoText inline-block" aria-hidden="true" />
              <span>Requieren atención</span>
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-estado-vencidoBg text-estado-vencidoText border border-estado-vencidoBorder">
              {vencidos.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {vencidos.map((contacto) => (
              <TarjetaContacto
                key={contacto.id}
                contacto={contacto}
                estado="vencido"
                onRegistrar={() => onRegistrarSeguimiento(contacto)}
                onVerDetalle={() => navegarA('detalle', contacto.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN 2: PARA HOY */}
      {paraHoy.length > 0 && (
        <section aria-labelledby="seccion-para-hoy" className="space-y-3.5">
          <div className="flex items-center gap-2">
            <h2 id="seccion-para-hoy" className="text-sm font-bold text-texto-principal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-petroleo-700 inline-block" aria-hidden="true" />
              <span>Para hoy</span>
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-petroleo-100 text-petroleo-700">
              {paraHoy.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paraHoy.map((contacto) => (
              <TarjetaContacto
                key={contacto.id}
                contacto={contacto}
                estado="hoy"
                onRegistrar={() => onRegistrarSeguimiento(contacto)}
                onVerDetalle={() => navegarA('detalle', contacto.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN 3: PRÓXIMOS SEGUIMIENTOS */}
      {proximos.length > 0 && (
        <section aria-labelledby="seccion-proximos" className="space-y-3.5">
          <div className="flex items-center gap-2">
            <h2 id="seccion-proximos" className="text-sm font-bold text-texto-principal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-texto-terciario inline-block" aria-hidden="true" />
              <span>Próximos seguimientos</span>
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-fondo text-texto-secundario border border-borde-suave">
              {proximos.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {proximos.map((contacto) => (
              <TarjetaContacto
                key={contacto.id}
                contacto={contacto}
                estado="proximo"
                onRegistrar={() => onRegistrarSeguimiento(contacto)}
                onVerDetalle={() => navegarA('detalle', contacto.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

interface TarjetaContactoProps {
  contacto: Contacto;
  estado: 'vencido' | 'hoy' | 'proximo';
  onRegistrar: () => void;
  onVerDetalle: () => void;
}

const TarjetaContacto: React.FC<TarjetaContactoProps> = ({
  contacto,
  estado,
  onRegistrar,
  onVerDetalle,
}) => {
  const etiquetaFecha = formatFechaEtiqueta(contacto.fechaProximoContacto);
  const iniciales = getIniciales(contacto.nombre);

  return (
    <article className="bg-superficie rounded-tarjeta border border-borde-suave p-5 sm:p-6 shadow-tarjeta flex flex-col justify-between gap-4 transition-all duration-150 hover:shadow-elevada hover:border-petroleo-200">
      <div className="space-y-3">
        {/* Cabecera: Avatar con iniciales, Nombre, Negocio y Etiqueta de Fecha */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar discreto con iniciales */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 select-none ${
                estado === 'vencido'
                  ? 'bg-estado-vencidoBg text-estado-vencidoText border border-estado-vencidoBorder'
                  : 'bg-petroleo-50 text-petroleo-700 border border-petroleo-200'
              }`}
              aria-hidden="true"
            >
              {iniciales}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-texto-principal text-sm sm:text-base leading-snug truncate">
                {contacto.nombre}
              </h3>
              {contacto.negocio && (
                <p className="text-xs text-texto-secundario truncate mt-0.5">
                  {contacto.negocio}
                </p>
              )}
            </div>
          </div>

          {/* Etiqueta breve con la fecha */}
          <div className="shrink-0">
            <FechaEstadoBadge estado={estado} texto={etiquetaFecha} />
          </div>
        </div>

        {/* Necesidad del cliente */}
        <div className="text-xs text-texto-secundario leading-relaxed">
          <strong className="text-texto-principal font-semibold">Necesidad: </strong>
          <span>{contacto.necesidad}</span>
        </div>

        {/* Bloque de "Próxima acción" con fondo suave */}
        {contacto.proximaAccion && (
          <div className="p-3 rounded-lg bg-fondo border border-borde-suave text-xs">
            <span className="text-[11px] font-semibold text-petroleo-700 uppercase tracking-wider block mb-0.5">
              Próxima acción:
            </span>
            <p className="text-texto-principal font-medium leading-snug">
              {contacto.proximaAccion}
            </p>
          </div>
        )}

        {/* Metadatos discretos: Etapa y Origen */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <EtapaBadge etapa={contacto.etapa} />
          <OrigenBadge origen={contacto.origen} />
        </div>
      </div>

      {/* Acciones al pie */}
      <div className="pt-3 border-t border-borde-suave flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onVerDetalle}
          className="inline-flex items-center gap-1 text-xs font-semibold text-texto-secundario hover:text-petroleo-700 py-2 px-2.5 rounded-lg hover:bg-fondo transition-colors focus:outline-none focus:ring-2 focus:ring-petroleo-700 min-h-[40px]"
        >
          <span>Ver detalle</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onRegistrar}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 active:bg-petroleo-900 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-petroleo-700 min-h-[40px]"
        >
          <span>Registrar seguimiento</span>
        </button>
      </div>
    </article>
  );
};
