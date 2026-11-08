import React, { useState } from 'react';
import { useContactos } from '../../context/ContactContext';
import { Contacto, EtapaComercial, OrigenContacto, ProductoInteres } from '../../types';
import { getEstadoFecha, formatFechaLegible } from '../../utils/dateUtils';
import { EtapaBadge, OrigenBadge, ProductoBadge, FechaEstadoBadge } from '../common/Badge';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Edit2,
  Save,
  X,
  MessageSquare,
  Building,
  Plus,
} from 'lucide-react';

interface DetalleContactoScreenProps {
  contactoId: string | null;
  onRegistrarSeguimiento: (contacto: Contacto) => void;
  onProgramarSeguimiento: (contacto: Contacto) => void;
  onCerrarOportunidad: (contacto: Contacto, etapa: 'cerrado_con_venta' | 'cerrado_sin_venta') => void;
}

export const DetalleContactoScreen: React.FC<DetalleContactoScreenProps> = ({
  contactoId,
  onRegistrarSeguimiento,
  onProgramarSeguimiento,
  onCerrarOportunidad,
}) => {
  const {
    contactos,
    actualizarContacto,
    cambiarEtapa,
    marcarSeguimientoRealizado,
    navegarA,
  } = useContactos();

  const contacto = contactos.find((c) => c.id === contactoId);

  // Estado de edición de datos generales
  const [editando, setEditando] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editNegocio, setEditNegocio] = useState('');
  const [editNecesidad, setEditNecesidad] = useState('');
  const [editProducto, setEditProducto] = useState<ProductoInteres | ''>('');
  const [editOrigen, setEditOrigen] = useState<OrigenContacto>('visita');
  const [errorNombre, setErrorNombre] = useState('');
  const [errorNecesidad, setErrorNecesidad] = useState('');

  if (!contacto) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-lg font-bold text-slate-800">
          Contacto no encontrado
        </h2>
        <p className="text-sm text-slate-600">
          El contacto seleccionado no existe o fue removido.
        </p>
        <button
          type="button"
          onClick={() => navegarA('contactos')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-petroleo-700 text-white text-sm font-semibold hover:bg-petroleo-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la lista de contactos</span>
        </button>
      </div>
    );
  }

  const iniciarEdicion = () => {
    setEditNombre(contacto.nombre);
    setEditNegocio(contacto.negocio || '');
    setEditNecesidad(contacto.necesidad);
    setEditProducto(contacto.productoInteres || '');
    setEditOrigen(contacto.origen);
    setErrorNombre('');
    setErrorNecesidad('');
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setEditando(false);
  };

  const guardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    let valido = true;

    if (!editNombre.trim()) {
      setErrorNombre('El nombre del contacto es obligatorio.');
      valido = false;
    } else {
      setErrorNombre('');
    }

    if (!editNecesidad.trim()) {
      setErrorNecesidad('La necesidad comercial es obligatoria.');
      valido = false;
    } else {
      setErrorNecesidad('');
    }

    if (!valido) return;

    actualizarContacto(contacto.id, {
      nombre: editNombre.trim(),
      negocio: editNegocio.trim() || undefined,
      necesidad: editNecesidad.trim(),
      productoInteres: editProducto ? (editProducto as ProductoInteres) : undefined,
      origen: editOrigen,
    });

    setEditando(false);
  };

  const handleCambiarEtapaDirecta = (nuevaEtapa: EtapaComercial) => {
    if (nuevaEtapa === 'cerrado_con_venta' || nuevaEtapa === 'cerrado_sin_venta') {
      onCerrarOportunidad(contacto, nuevaEtapa);
    } else {
      cambiarEtapa(contacto.id, nuevaEtapa);
    }
  };

  const estadoFecha = contacto.fechaProximoContacto
    ? getEstadoFecha(contacto.fechaProximoContacto)
    : 'sin_fecha';

  return (
    <div className="space-y-6">
      {/* Botón de retroceso */}
      <div>
        <button
          type="button"
          onClick={() => navegarA('contactos')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-petroleo-800 py-1 px-2 rounded-md hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-petroleo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al directorio de contactos</span>
        </button>
      </div>

      {/* Cabecera de la ficha */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        {!editando ? (
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {contacto.nombre}
                </h1>
                <EtapaBadge etapa={contacto.etapa} />
                <OrigenBadge origen={contacto.origen} />
                {contacto.productoInteres && (
                  <ProductoBadge producto={contacto.productoInteres} />
                )}
              </div>

              {contacto.negocio && (
                <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  <span>{contacto.negocio}</span>
                </p>
              )}

              {/* Motivo de pérdida si está cerrado sin venta */}
              {contacto.etapa === 'cerrado_sin_venta' && contacto.motivoPerdida && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  <span className="font-semibold text-slate-800">Motivo de no concreción: </span>
                  <span>{contacto.motivoPerdida}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Selector accesible de etapa comercial */}
              <div className="flex items-center gap-1.5 text-xs">
                <label htmlFor="selector-etapa-detalle" className="font-semibold text-slate-700">
                  Etapa:
                </label>
                <select
                  id="selector-etapa-detalle"
                  value={contacto.etapa}
                  onChange={(e) => handleCambiarEtapaDirecta(e.target.value as EtapaComercial)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="interesado">Interesado</option>
                  <option value="cerrado_con_venta">Cerrado con venta</option>
                  <option value="cerrado_sin_venta">Cerrado sin venta</option>
                </select>
              </div>

              <button
                type="button"
                onClick={iniciarEdicion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <span>Editar datos</span>
              </button>
            </div>
          </div>
        ) : (
          /* Formulario de edición rápida */
          <form onSubmit={guardarEdicion} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">Editar datos del contacto</h2>
              <button
                type="button"
                onClick={cancelarEdicion}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
                aria-label="Cancelar edición"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-nombre" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del contacto <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="edit-nombre"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                />
                {errorNombre && <p className="text-xs text-rose-600 mt-1">{errorNombre}</p>}
              </div>

              <div>
                <label htmlFor="edit-negocio" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del negocio (Opcional)
                </label>
                <input
                  type="text"
                  id="edit-negocio"
                  value={editNegocio}
                  onChange={(e) => setEditNegocio(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="edit-necesidad" className="block text-xs font-semibold text-slate-700 mb-1">
                  Necesidad identificada <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="edit-necesidad"
                  rows={2}
                  value={editNecesidad}
                  onChange={(e) => setEditNecesidad(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                />
                {errorNecesidad && <p className="text-xs text-rose-600 mt-1">{errorNecesidad}</p>}
              </div>

              <div>
                <label htmlFor="edit-producto" className="block text-xs font-semibold text-slate-700 mb-1">
                  Producto de interés
                </label>
                <select
                  id="edit-producto"
                  value={editProducto}
                  onChange={(e) => setEditProducto(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                >
                  <option value="">Ninguno específico</option>
                  <option value="financiamiento">Financiamiento</option>
                  <option value="ahorro">Ahorro</option>
                  <option value="servicios_pago">Servicios de pago</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-origen" className="block text-xs font-semibold text-slate-700 mb-1">
                  Origen del contacto
                </label>
                <select
                  id="edit-origen"
                  value={editOrigen}
                  onChange={(e) => setEditOrigen(e.target.value as OrigenContacto)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                >
                  <option value="visita">Visita presencial</option>
                  <option value="referido">Referido</option>
                  <option value="campana">Campaña</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={cancelarEdicion}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar cambios</span>
              </button>
            </div>
          </form>
        )}

        {/* Bloque: Necesidad comercial detallada */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Necesidad comercial identificada
          </h2>
          <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
            {contacto.necesidad}
          </p>
        </div>
      </section>

      {/* BLOQUE DISTINGUIDO: PRÓXIMA ACCIÓN PENDIENTE (FUTURO) */}
      <section
        aria-labelledby="bloque-proxima-accion"
        className={`rounded-xl border p-5 shadow-xs transition-colors ${
          estadoFecha === 'vencido'
            ? 'bg-rose-50/60 border-rose-300'
            : estadoFecha === 'hoy'
            ? 'bg-petroleo-50/60 border-petroleo-300'
            : contacto.proximaAccion
            ? 'bg-amber-50/40 border-amber-200'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                estadoFecha === 'vencido'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-petroleo-100 text-petroleo-800'
              }`}
              aria-hidden="true"
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 id="bloque-proxima-accion" className="text-base font-bold text-slate-900">
                Próxima Acción y Compromiso
              </h2>
              <p className="text-xs text-slate-600">
                Acción pendiente para no perder la continuidad con el cliente
              </p>
            </div>
          </div>

          {contacto.fechaProximoContacto && (
            <FechaEstadoBadge
              estado={estadoFecha}
              texto={formatFechaLegible(contacto.fechaProximoContacto)}
            />
          )}
        </div>

        {contacto.proximaAccion ? (
          <div className="mt-4 space-y-3">
            <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-sm">
              <span className="block text-xs font-semibold text-slate-500 uppercase">
                Compromiso acordado:
              </span>
              <p className="font-semibold text-slate-900 text-base mt-0.5">
                {contacto.proximaAccion}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onProgramarSeguimiento(contacto)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              >
                Reprogramar fecha
              </button>

              <button
                type="button"
                onClick={() => marcarSeguimientoRealizado(contacto.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>Marcar como realizado</span>
              </button>

              <button
                type="button"
                onClick={() => onRegistrarSeguimiento(contacto)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 active:bg-petroleo-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-petroleo-700"
              >
                <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Registrar conversación y resultado</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-2">
            <p className="text-sm text-slate-600">
              No tienes ningún seguimiento programado para este contacto.
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => onProgramarSeguimiento(contacto)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Programar próximo contacto</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* BLOQUE DISTINGUIDO: HISTORIAL DE CONVERSACIONES (PASADO) */}
      <section aria-labelledby="bloque-historial" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700" aria-hidden="true">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 id="bloque-historial" className="text-base font-bold text-slate-900">
                Historial de Conversaciones
              </h2>
              <p className="text-xs text-slate-600">
                Bitácora cronológica inmutable de acuerdos y notas pasadas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRegistrarSeguimiento(contacto)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-petroleo-700"
          >
            <Plus className="w-3.5 h-3.5 text-petroleo-700" />
            <span>Añadir nota</span>
          </button>
        </div>

        {contacto.historial.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-50 rounded-lg border border-slate-100">
            Aún no se han registrado conversaciones o visitas para este contacto.
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {contacto.historial.map((item) => (
              <article
                key={item.id}
                className="relative bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5"
              >
                {/* Punto en la línea de tiempo */}
                <div
                  className="absolute -left-[1.85rem] top-3.5 w-2.5 h-2.5 rounded-full bg-petroleo-700 ring-4 ring-white"
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span className="capitalize font-semibold text-slate-700">
                    {item.tipo === 'llamada' && '📞 Llamada telefónica'}
                    {item.tipo === 'visita' && '📍 Visita presencial'}
                    {item.tipo === 'mensaje' && '💬 Mensaje / Chat'}
                    {item.tipo === 'otro' && '📝 Interacción'}
                  </span>
                  <span>{formatFechaLegible(item.fecha)}</span>
                </div>

                <p className="text-slate-800 text-sm leading-relaxed">
                  {item.resumen}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
