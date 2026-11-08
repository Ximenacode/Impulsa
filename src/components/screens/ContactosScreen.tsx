import React, { useState, useMemo } from 'react';
import { useContactos } from '../../context/ContactContext';
import {
  getEstadoFecha,
  formatFechaEtiqueta,
  getIniciales,
} from '../../utils/dateUtils';
import { EtapaBadge, OrigenBadge, ProductoBadge, FechaEstadoBadge } from '../common/Badge';
import {
  Search,
  Plus,
  ArrowRight,
  UserX,
  X,
} from 'lucide-react';

interface ContactosScreenProps {
  onAbrirNuevoContacto: () => void;
}

export const ContactosScreen: React.FC<ContactosScreenProps> = ({
  onAbrirNuevoContacto,
}) => {
  const { contactos, navegarA } = useContactos();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todas');
  const [filtroOrigen, setFiltroOrigen] = useState<string>('todos');

  // Filtrado reactivo
  const contactosFiltrados = useMemo(() => {
    return contactos.filter((c) => {
      // Búsqueda por nombre o negocio
      const texto = `${c.nombre} ${c.negocio || ''}`.toLowerCase();
      const coincideBusqueda = texto.includes(busqueda.toLowerCase().trim());

      // Filtro de etapa
      const coincideEtapa =
        filtroEtapa === 'todas' || c.etapa === filtroEtapa;

      // Filtro de origen
      const coincideOrigen =
        filtroOrigen === 'todos' || c.origen === filtroOrigen;

      return coincideBusqueda && coincideEtapa && coincideOrigen;
    });
  }, [contactos, busqueda, filtroEtapa, filtroOrigen]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEtapa('todas');
    setFiltroOrigen('todos');
  };

  const hayFiltrosActivos =
    busqueda.trim() !== '' || filtroEtapa !== 'todas' || filtroOrigen !== 'todos';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Encabezado de página */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-borde-suave">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-texto-principal tracking-tight">
            Contactos
          </h1>
          <p className="text-sm text-texto-secundario mt-0.5">
            Consulta, filtra y gestiona la cartera de prospectos y emprendedores
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

      {/* Barra de Búsqueda y Filtros Ordenados */}
      <div className="bg-superficie p-4 rounded-tarjeta border border-borde-suave shadow-tarjeta space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Buscador de texto visible y destacado */}
          <div className="md:col-span-6 relative">
            <label htmlFor="busqueda-contacto" className="sr-only">
              Buscar por nombre o negocio
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-texto-terciario absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                id="busqueda-contacto"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por contacto o negocio..."
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-borde-suave text-xs text-texto-principal bg-fondo focus:bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-texto-terciario hover:text-texto-principal rounded"
                  aria-label="Borrar texto de búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Etapa */}
          <div className="md:col-span-3">
            <label htmlFor="filtro-etapa" className="sr-only">
              Filtrar por etapa
            </label>
            <select
              id="filtro-etapa"
              value={filtroEtapa}
              onChange={(e) => setFiltroEtapa(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs text-texto-principal bg-fondo focus:bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors"
            >
              <option value="todas">Todas las etapas comerciales</option>
              <option value="nuevo">Nuevo</option>
              <option value="contactado">Contactado</option>
              <option value="interesado">Interesado</option>
              <option value="cerrado_con_venta">Cerrado con venta</option>
              <option value="cerrado_sin_venta">Cerrado sin venta</option>
            </select>
          </div>

          {/* Filtro por Origen */}
          <div className="md:col-span-3">
            <label htmlFor="filtro-origen" className="sr-only">
              Filtrar por origen
            </label>
            <select
              id="filtro-origen"
              value={filtroOrigen}
              onChange={(e) => setFiltroOrigen(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs text-texto-principal bg-fondo focus:bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors"
            >
              <option value="todos">Todos los orígenes</option>
              <option value="visita">Visita presencial</option>
              <option value="referido">Referido</option>
              <option value="campana">Campaña de difusión</option>
            </select>
          </div>
        </div>

        {/* Resumen de resultados */}
        <div className="flex items-center justify-between text-xs text-texto-secundario pt-1">
          <p>
            Mostrando <strong>{contactosFiltrados.length}</strong> de{' '}
            <strong>{contactos.length}</strong> contactos
          </p>

          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="text-petroleo-700 hover:text-petroleo-800 font-semibold underline focus:outline-none focus:ring-1 focus:ring-petroleo-700 rounded px-1"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Estado vacío cuando no hay resultados */}
      {contactosFiltrados.length === 0 && (
        <div className="bg-superficie rounded-tarjeta border border-borde-suave p-8 text-center max-w-md mx-auto space-y-3 shadow-tarjeta">
          <div className="w-10 h-10 rounded-full bg-fondo text-texto-terciario mx-auto flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-texto-principal">
            No se encontraron contactos
          </h2>
          <p className="text-xs text-texto-secundario">
            {hayFiltrosActivos
              ? 'No hay registros que coincidan con la búsqueda o los filtros aplicados.'
              : 'Aún no tienes contactos guardados.'}
          </p>
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="px-3.5 py-1.5 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      )}

      {/* TABLA LEGIBLE EN ESCRITORIO (Visible en md+) */}
      {contactosFiltrados.length > 0 && (
        <div className="hidden md:block bg-superficie rounded-tarjeta border border-borde-suave shadow-tarjeta overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-borde-suave bg-fondo text-texto-secundario uppercase tracking-wider text-[11px] font-semibold">
                <th scope="col" className="py-3 px-4">Contacto y Negocio</th>
                <th scope="col" className="py-3 px-4">Necesidad</th>
                <th scope="col" className="py-3 px-4">Etapa</th>
                <th scope="col" className="py-3 px-4">Origen</th>
                <th scope="col" className="py-3 px-4">Próximo seguimiento</th>
                <th scope="col" className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde-suave text-texto-principal">
              {contactosFiltrados.map((contacto) => {
                const estadoFecha = contacto.fechaProximoContacto
                  ? getEstadoFecha(contacto.fechaProximoContacto)
                  : 'sin_fecha';
                const iniciales = getIniciales(contacto.nombre);
                const etiquetaFecha = contacto.fechaProximoContacto
                  ? formatFechaEtiqueta(contacto.fechaProximoContacto)
                  : null;

                return (
                  <tr
                    key={contacto.id}
                    className="hover:bg-fondo/60 transition-colors"
                  >
                    {/* Contacto y Negocio */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full bg-petroleo-50 text-petroleo-700 border border-petroleo-200 flex items-center justify-center font-bold text-[10px] shrink-0"
                          aria-hidden="true"
                        >
                          {iniciales}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => navegarA('detalle', contacto.id)}
                            className="font-bold text-texto-principal hover:text-petroleo-700 text-left block truncate focus:outline-none focus:underline"
                          >
                            {contacto.nombre}
                          </button>
                          {contacto.negocio && (
                            <span className="text-[11px] text-texto-secundario block truncate">
                              {contacto.negocio}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Necesidad */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="text-texto-secundario line-clamp-2">
                        {contacto.necesidad}
                      </span>
                    </td>

                    {/* Etapa */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <EtapaBadge etapa={contacto.etapa} />
                    </td>

                    {/* Origen */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <OrigenBadge origen={contacto.origen} />
                    </td>

                    {/* Próximo seguimiento */}
                    <td className="py-3.5 px-4">
                      {contacto.fechaProximoContacto && etiquetaFecha ? (
                        <div className="space-y-0.5">
                          <FechaEstadoBadge
                            estado={estadoFecha}
                            texto={etiquetaFecha}
                          />
                          {contacto.proximaAccion && (
                            <span className="block text-[11px] text-texto-secundario truncate max-w-[160px]">
                              {contacto.proximaAccion}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-texto-terciario italic">
                          Sin programar
                        </span>
                      )}
                    </td>

                    {/* Botón de acción */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => navegarA('detalle', contacto.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-borde-suave text-texto-secundario hover:text-petroleo-700 hover:bg-superficie font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                      >
                        <span>Ver ficha</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PRESENTACIÓN ADAPTADA EN TARJETAS PARA MÓVIL (Visible en < md) */}
      {contactosFiltrados.length > 0 && (
        <div className="md:hidden space-y-3">
          {contactosFiltrados.map((contacto) => {
            const estadoFecha = contacto.fechaProximoContacto
              ? getEstadoFecha(contacto.fechaProximoContacto)
              : 'sin_fecha';
            const iniciales = getIniciales(contacto.nombre);
            const etiquetaFecha = contacto.fechaProximoContacto
              ? formatFechaEtiqueta(contacto.fechaProximoContacto)
              : null;

            return (
              <article
                key={contacto.id}
                className="bg-superficie rounded-tarjeta border border-borde-suave p-4 shadow-tarjeta space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full bg-petroleo-50 text-petroleo-700 border border-petroleo-200 flex items-center justify-center font-bold text-xs shrink-0"
                      aria-hidden="true"
                    >
                      {iniciales}
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-texto-principal">
                        {contacto.nombre}
                      </h2>
                      {contacto.negocio && (
                        <p className="text-xs text-texto-secundario">
                          {contacto.negocio}
                        </p>
                      )}
                    </div>
                  </div>

                  {contacto.fechaProximoContacto && etiquetaFecha && (
                    <FechaEstadoBadge
                      estado={estadoFecha}
                      texto={etiquetaFecha}
                    />
                  )}
                </div>

                <p className="text-xs text-texto-secundario line-clamp-2">
                  <strong className="text-texto-principal">Necesidad: </strong>
                  {contacto.necesidad}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <EtapaBadge etapa={contacto.etapa} />
                  <OrigenBadge origen={contacto.origen} />
                  {contacto.productoInteres && (
                    <ProductoBadge producto={contacto.productoInteres} />
                  )}
                </div>

                <div className="pt-2 border-t border-borde-suave flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => navegarA('detalle', contacto.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-borde-suave text-texto-secundario hover:text-petroleo-700 text-xs font-semibold"
                  >
                    <span>Ver ficha completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
