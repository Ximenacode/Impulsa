import React, { useState } from 'react';
import { useContactos } from '../../context/ContactContext';
import { Contacto, EtapaComercial, OrigenContacto, ProductoInteres } from '../../types';
import {
  getEstadoFecha,
  formatFechaLegible,
  formatFechaEtiqueta,
  getIniciales,
} from '../../utils/dateUtils';
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
      <div className="bg-superficie rounded-tarjeta border border-borde-suave p-8 text-center max-w-md mx-auto space-y-4 shadow-tarjeta">
        <h2 className="text-base font-bold text-texto-principal">
          Contacto no encontrado
        </h2>
        <p className="text-xs text-texto-secundario">
          El contacto seleccionado no existe o fue removido.
        </p>
        <button
          type="button"
          onClick={() => navegarA('contactos')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a contactos</span>
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
  const etiquetaFecha = contacto.fechaProximoContacto
    ? formatFechaEtiqueta(contacto.fechaProximoContacto)
    : '';
  const iniciales = getIniciales(contacto.nombre);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Botón de retroceso al directorio */}
      <div>
        <button
          type="button"
          onClick={() => navegarA('contactos')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-texto-secundario hover:text-petroleo-700 py-1.5 px-2.5 rounded-lg hover:bg-superficie border border-transparent hover:border-borde-suave transition-all focus:outline-none focus:ring-2 focus:ring-petroleo-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al directorio de contactos</span>
        </button>
      </div>

      {/* BLOQUE 1: INFORMACIÓN DEL CONTACTO (Encabezado) */}
      <section className="bg-superficie rounded-tarjeta border border-borde-suave p-5 sm:p-6 shadow-tarjeta space-y-4">
        {!editando ? (
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className="w-11 h-11 rounded-full bg-petroleo-50 text-petroleo-700 border border-petroleo-200 flex items-center justify-center font-bold text-sm shrink-0"
                aria-hidden="true"
              >
                {iniciales}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-texto-principal tracking-tight truncate">
                    {contacto.nombre}
                  </h1>
                  <EtapaBadge etapa={contacto.etapa} />
                </div>

                {contacto.negocio && (
                  <p className="text-xs font-medium text-texto-secundario flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-texto-terciario" aria-hidden="true" />
                    <span>{contacto.negocio}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <OrigenBadge origen={contacto.origen} />
                  {contacto.productoInteres && (
                    <ProductoBadge producto={contacto.productoInteres} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Selector accesible de etapa comercial */}
              <div className="flex items-center gap-1.5 text-xs">
                <label htmlFor="selector-etapa-detalle" className="font-semibold text-texto-secundario">
                  Etapa:
                </label>
                <select
                  id="selector-etapa-detalle"
                  value={contacto.etapa}
                  onChange={(e) => handleCambiarEtapaDirecta(e.target.value as EtapaComercial)}
                  className="px-2.5 py-1.5 rounded-lg border border-borde-suave text-xs font-semibold bg-fondo focus:bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700"
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-borde-suave text-texto-secundario hover:text-texto-principal hover:bg-fondo text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              >
                <Edit2 className="w-3 h-3" />
                <span>Editar</span>
              </button>
            </div>
          </div>
        ) : (
          /* Formulario de edición rápida */
          <form onSubmit={guardarEdicion} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-borde-suave">
              <h2 className="text-sm font-bold text-texto-principal">Editar datos del contacto</h2>
              <button
                type="button"
                onClick={cancelarEdicion}
                className="p-1 rounded text-texto-terciario hover:text-texto-principal"
                aria-label="Cancelar edición"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="edit-nombre" className="block text-xs font-semibold text-texto-principal mb-1">
                  Nombre del contacto <span className="text-estado-vencidoText">*</span>
                </label>
                <input
                  type="text"
                  id="edit-nombre"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                />
                {errorNombre && <p className="text-[11px] text-estado-vencidoText mt-1">{errorNombre}</p>}
              </div>

              <div>
                <label htmlFor="edit-negocio" className="block text-xs font-semibold text-texto-principal mb-1">
                  Nombre del negocio (Opcional)
                </label>
                <input
                  type="text"
                  id="edit-negocio"
                  value={editNegocio}
                  onChange={(e) => setEditNegocio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="edit-necesidad" className="block text-xs font-semibold text-texto-principal mb-1">
                  Necesidad comercial <span className="text-estado-vencidoText">*</span>
                </label>
                <textarea
                  id="edit-necesidad"
                  rows={2}
                  value={editNecesidad}
                  onChange={(e) => setEditNecesidad(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                />
                {errorNecesidad && <p className="text-[11px] text-estado-vencidoText mt-1">{errorNecesidad}</p>}
              </div>

              <div>
                <label htmlFor="edit-producto" className="block text-xs font-semibold text-texto-principal mb-1">
                  Producto de interés
                </label>
                <select
                  id="edit-producto"
                  value={editProducto}
                  onChange={(e) => setEditProducto(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs bg-fondo focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                >
                  <option value="">Ninguno específico</option>
                  <option value="financiamiento">Financiamiento</option>
                  <option value="ahorro">Ahorro</option>
                  <option value="servicios_pago">Servicios de pago</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-origen" className="block text-xs font-semibold text-texto-principal mb-1">
                  Origen del contacto
                </label>
                <select
                  id="edit-origen"
                  value={editOrigen}
                  onChange={(e) => setEditOrigen(e.target.value as OrigenContacto)}
                  className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs bg-fondo focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                >
                  <option value="visita">Visita presencial</option>
                  <option value="referido">Referido</option>
                  <option value="campana">Campaña</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-borde-suave">
              <button
                type="button"
                onClick={cancelarEdicion}
                className="px-3 py-1.5 rounded-lg border border-borde-suave text-xs font-semibold text-texto-secundario hover:bg-fondo"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar cambios</span>
              </button>
            </div>
          </form>
        )}

        {/* Motivo de pérdida si aplica */}
        {contacto.etapa === 'cerrado_sin_venta' && contacto.motivoPerdida && (
          <div className="p-3 bg-fondo rounded-lg border border-borde-suave text-xs text-texto-secundario">
            <strong className="text-texto-principal">Motivo de no concreción: </strong>
            <span>{contacto.motivoPerdida}</span>
          </div>
        )}

        {/* Necesidad identificada */}
        <div className="pt-3 border-t border-borde-suave">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-texto-terciario block mb-1">
            Necesidad comercial identificada
          </span>
          <p className="text-xs sm:text-sm text-texto-principal bg-fondo p-3.5 rounded-lg border border-borde-suave leading-relaxed">
            {contacto.necesidad}
          </p>
        </div>
      </section>

      {/* BLOQUE 2: PRÓXIMA ACCIÓN PENDIENTE (FUTURO) */}
      <section
        aria-labelledby="bloque-proxima-accion"
        className="bg-superficie rounded-tarjeta border border-borde-suave p-5 sm:p-6 shadow-tarjeta space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-borde-suave">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-petroleo-50 text-petroleo-700 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 id="bloque-proxima-accion" className="text-sm font-bold text-texto-principal">
                Próxima Acción y Seguimiento
              </h2>
              <p className="text-[11px] text-texto-secundario">
                Acción pactada para mantener el avance comercial
              </p>
            </div>
          </div>

          {contacto.fechaProximoContacto && (
            <FechaEstadoBadge
              estado={estadoFecha}
              texto={etiquetaFecha}
            />
          )}
        </div>

        {contacto.proximaAccion ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-fondo border border-borde-suave space-y-1">
              <span className="text-[11px] font-semibold text-petroleo-700 uppercase tracking-wider block">
                Compromiso acordado:
              </span>
              <p className="text-sm font-semibold text-texto-principal leading-relaxed">
                {contacto.proximaAccion}
              </p>
              {contacto.fechaProximoContacto && (
                <p className="text-xs text-texto-secundario pt-0.5">
                  Fecha asignada: {formatFechaLegible(contacto.fechaProximoContacto)}
                </p>
              )}
            </div>

            {/* Acciones principales destacadas */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onProgramarSeguimiento(contacto)}
                className="px-3 py-1.5 rounded-lg border border-borde-suave text-texto-secundario hover:text-texto-principal hover:bg-fondo text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-petroleo-700 min-h-[38px]"
              >
                Reprogramar fecha
              </button>

              <button
                type="button"
                onClick={() => marcarSeguimientoRealizado(contacto.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-estado-ganadoBorder bg-estado-ganadoBg text-estado-ganadoText text-xs font-semibold hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 min-h-[38px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Marcar realizado</span>
              </button>

              <button
                type="button"
                onClick={() => onRegistrarSeguimiento(contacto)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 active:bg-petroleo-900 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-petroleo-700 min-h-[38px]"
              >
                <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Registrar seguimiento</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-fondo rounded-lg border border-dashed border-borde-suave space-y-2.5">
            <p className="text-xs text-texto-secundario">
              No tienes ningún seguimiento programado para este contacto.
            </p>
            <button
              type="button"
              onClick={() => onProgramarSeguimiento(contacto)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Programar próximo contacto</span>
            </button>
          </div>
        )}
      </section>

      {/* BLOQUE 3: HISTORIAL DE CONVERSACIONES (PASADO) */}
      <section
        aria-labelledby="bloque-historial"
        className="bg-superficie rounded-tarjeta border border-borde-suave p-5 sm:p-6 shadow-tarjeta space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-borde-suave">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-fondo text-texto-secundario flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 id="bloque-historial" className="text-sm font-bold text-texto-principal">
                Historial de Conversaciones
              </h2>
              <p className="text-[11px] text-texto-secundario">
                Bitácora cronológica inmutable de acuerdos y notas previas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRegistrarSeguimiento(contacto)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-borde-suave text-texto-secundario hover:text-texto-principal hover:bg-fondo text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-petroleo-700"
          >
            <Plus className="w-3 h-3 text-petroleo-700" />
            <span>Añadir nota</span>
          </button>
        </div>

        {contacto.historial.length === 0 ? (
          <div className="p-6 text-center text-xs text-texto-terciario italic bg-fondo rounded-lg border border-borde-suave">
            Aún no se han registrado notas o visitas para este contacto.
          </div>
        ) : (
          <div className="relative pl-6 space-y-3.5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-borde-suave">
            {contacto.historial.map((item) => (
              <article
                key={item.id}
                className="relative bg-fondo border border-borde-suave rounded-lg p-3 text-xs space-y-1.5"
              >
                {/* Indicador en la línea de tiempo */}
                <div
                  className="absolute -left-[1.85rem] top-3.5 w-2 h-2 rounded-full bg-petroleo-700 ring-4 ring-superficie"
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between text-texto-secundario">
                  <span className="font-semibold text-texto-principal">
                    {item.tipo === 'llamada' && 'Llamada telefónica'}
                    {item.tipo === 'visita' && 'Visita presencial'}
                    {item.tipo === 'mensaje' && 'Mensaje / Chat'}
                    {item.tipo === 'otro' && 'Interacción'}
                  </span>
                  <span className="text-[11px] text-texto-terciario">
                    {formatFechaLegible(item.fecha)}
                  </span>
                </div>

                <p className="text-texto-principal text-xs leading-relaxed">
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
