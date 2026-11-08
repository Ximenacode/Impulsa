import React, { useState, useMemo } from 'react';
import { useContactos } from '../../context/ContactContext';
import { getEstadoFecha, formatFechaLegible } from '../../utils/dateUtils';
import { EtapaBadge, OrigenBadge, ProductoBadge, FechaEstadoBadge } from '../common/Badge';
import {
  Search,
  Plus,
  ArrowRight,
  UserX,
  Building,
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
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Directorio de Contactos
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Consulta, filtra y gestiona la cartera de prospectos y emprendedores.
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

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Buscador de texto */}
          <div className="md:col-span-6 relative">
            <label htmlFor="busqueda-contacto" className="sr-only">
              Buscar por nombre o negocio
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                id="busqueda-contacto"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o negocio (ej. Bertha, Panadería)..."
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded"
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
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700"
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
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              <option value="todos">Todos los orígenes</option>
              <option value="visita">Visita presencial</option>
              <option value="referido">Referido</option>
              <option value="campana">Campaña de difusión</option>
            </select>
          </div>
        </div>

        {/* Contador y botón de reset de filtros */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
          <p>
            Mostrando <strong>{contactosFiltrados.length}</strong> de{' '}
            <strong>{contactos.length}</strong> contactos
          </p>

          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="text-petroleo-700 hover:text-petroleo-900 font-semibold underline focus:outline-none focus:ring-1 focus:ring-petroleo-700 rounded px-1"
            >
              Limpiar filtros de búsqueda
            </button>
          )}
        </div>
      </div>

      {/* Estado vacío por búsqueda sin resultados */}
      {contactosFiltrados.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            No se encontraron contactos
          </h2>
          <p className="text-sm text-slate-600">
            {hayFiltrosActivos
              ? 'No hay registros que coincidan con los criterios de búsqueda o filtros seleccionados.'
              : 'Aún no tienes contactos guardados.'}
          </p>
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="px-4 py-2 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      )}

      {/* Lista de Contactos (Diseño en tarjetas responsivas y estructuradas) */}
      {contactosFiltrados.length > 0 && (
        <div className="space-y-3">
          {contactosFiltrados.map((contacto) => {
            const estadoFecha = contacto.fechaProximoContacto
              ? getEstadoFecha(contacto.fechaProximoContacto)
              : 'sin_fecha';

            return (
              <article
                key={contacto.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-petroleo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Columna principal: Identificación y necesidad */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 truncate">
                      {contacto.nombre}
                    </h2>
                    {contacto.negocio && (
                      <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        <span>{contacto.negocio}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    <strong className="text-slate-700">Necesidad: </strong>
                    {contacto.necesidad}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <EtapaBadge etapa={contacto.etapa} />
                    <OrigenBadge origen={contacto.origen} />
                    {contacto.productoInteres && (
                      <ProductoBadge producto={contacto.productoInteres} />
                    )}
                  </div>
                </div>

                {/* Columna secundaria: Próximo seguimiento y botón de detalle */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase">
                      Próximo seguimiento
                    </span>
                    {contacto.fechaProximoContacto ? (
                      <FechaEstadoBadge
                        estado={estadoFecha}
                        texto={formatFechaLegible(contacto.fechaProximoContacto)}
                      />
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Sin programar
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => navegarA('detalle', contacto.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-petroleo-700 text-slate-700 hover:text-petroleo-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors"
                  >
                    <span>Ver ficha</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
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
