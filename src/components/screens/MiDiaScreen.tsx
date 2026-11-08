import React, { useMemo } from 'react';
import { useContactos } from '../../context/ContactContext';
import { Contacto } from '../../types';
import { getEstadoFecha, formatFechaLegible, getDiasDiferencia } from '../../utils/dateUtils';
import { FechaEstadoBadge, EtapaBadge, OrigenBadge } from '../common/Badge';
import {
  CalendarCheck,
  AlertTriangle,
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

    // Ordenar hoy: por orden de creación o nombre
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
    <div className="space-y-6">
      {/* Cabecera y botón principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Mi día
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Prioriza tus contactos del día y da el siguiente paso con cada emprendedor.
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

      {/* Tarjetas de resumen cuantitativo rápido */}
      <section aria-label="Resumen de prioridades del día" className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Vencidos */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            vencidos.length > 0
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Vencidos
            </span>
            <AlertTriangle
              className={`w-4 h-4 ${vencidos.length > 0 ? 'text-rose-600' : 'text-slate-400'}`}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {vencidos.length}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            {vencidos.length === 1 ? 'Seguimiento que requiere atención' : 'Seguimientos que requieren atención'}
          </p>
        </div>

        {/* Para hoy */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            paraHoy.length > 0
              ? 'bg-petroleo-50/70 border-petroleo-200 text-petroleo-950'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-petroleo-800">
              Para hoy
            </span>
            <Calendar
              className={`w-4 h-4 ${paraHoy.length > 0 ? 'text-petroleo-700' : 'text-slate-400'}`}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {paraHoy.length}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            {paraHoy.length === 1 ? 'Compromiso agendado para hoy' : 'Compromisos agendados para hoy'}
          </p>
        </div>

        {/* Próximos */}
        <div className="p-4 rounded-xl border bg-white border-slate-200 text-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Próximos días
            </span>
            <Clock className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {proximos.length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Seguimientos agendados a futuro
          </p>
        </div>
      </section>

      {/* Si no hay ningún pendiente en absoluto */}
      {totalPendientes === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            ¡Estás completamente al día!
          </h2>
          <p className="text-sm text-slate-600">
            No tienes seguimientos pendientes ni atrasados. Puedes registrar un nuevo contacto o explorar tu cartera completa.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={onAbrirNuevoContacto}
              className="px-4 py-2 rounded-lg bg-petroleo-700 text-white text-sm font-medium hover:bg-petroleo-800"
            >
              Nuevo contacto
            </button>
            <button
              type="button"
              onClick={() => navegarA('contactos')}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100"
            >
              Ver todos los contactos
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN 1: VENCIDOS (Máxima urgencia) */}
      {vencidos.length > 0 && (
        <section aria-labelledby="seccion-vencidos" className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 id="seccion-vencidos" className="text-base font-bold text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" aria-hidden="true" />
              <span>Seguimientos vencidos</span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {vencidos.length} {vencidos.length === 1 ? 'urgente' : 'urgentes'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {vencidos.map((contacto) => (
              <TarjetaPendiente
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
        <section aria-labelledby="seccion-para-hoy" className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 id="seccion-para-hoy" className="text-base font-bold text-petroleo-950 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-petroleo-700" aria-hidden="true" />
              <span>Compromisos para hoy</span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-petroleo-100 text-petroleo-800">
              {paraHoy.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {paraHoy.map((contacto) => (
              <TarjetaPendiente
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
        <section aria-labelledby="seccion-proximos" className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <h2 id="seccion-proximos" className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span>Próximas acciones programadas</span>
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {proximos.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {proximos.map((contacto) => (
              <TarjetaPendiente
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

interface TarjetaPendienteProps {
  contacto: Contacto;
  estado: 'vencido' | 'hoy' | 'proximo';
  onRegistrar: () => void;
  onVerDetalle: () => void;
}

const TarjetaPendiente: React.FC<TarjetaPendienteProps> = ({
  contacto,
  estado,
  onRegistrar,
  onVerDetalle,
}) => {
  return (
    <article
      className={`rounded-xl border p-4.5 bg-white shadow-xs transition-shadow hover:shadow-sm flex flex-col justify-between gap-3 ${
        estado === 'vencido'
          ? 'border-rose-200 ring-1 ring-rose-100'
          : estado === 'hoy'
          ? 'border-petroleo-200 ring-1 ring-petroleo-50'
          : 'border-slate-200'
      }`}
    >
      <div>
        {/* Cabecera de la tarjeta: Nombre, negocio y badge de fecha */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug">
              {contacto.nombre}
            </h3>
            {contacto.negocio && (
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                {contacto.negocio}
              </p>
            )}
          </div>

          <FechaEstadoBadge
            estado={estado}
            texto={formatFechaLegible(contacto.fechaProximoContacto)}
          />
        </div>

        {/* Necesidad identificada del cliente */}
        <div className="mt-2.5 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Necesidad: </span>
          <span className="line-clamp-2">{contacto.necesidad}</span>
        </div>

        {/* Próxima acción pactada (resaltada) */}
        {contacto.proximaAccion && (
          <div className="mt-2 p-2 rounded-md bg-slate-50 border border-slate-200 text-xs">
            <span className="font-semibold text-petroleo-900">Acción a realizar: </span>
            <span className="text-slate-800 font-medium">{contacto.proximaAccion}</span>
          </div>
        )}

        {/* Metadatos adicionales */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <EtapaBadge etapa={contacto.etapa} />
          <OrigenBadge origen={contacto.origen} />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onVerDetalle}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-petroleo-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-petroleo-700"
        >
          <span>Ver detalle</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onRegistrar}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 active:bg-petroleo-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-petroleo-700"
        >
          <span>Registrar seguimiento</span>
        </button>
      </div>
    </article>
  );
};
