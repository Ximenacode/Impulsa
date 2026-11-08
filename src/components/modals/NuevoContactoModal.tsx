import React, { useState, useEffect, useRef } from 'react';
import { useContactos } from '../../context/ContactContext';
import { OrigenContacto, ProductoInteres } from '../../types';
import { getTodayString } from '../../utils/dateUtils';
import { X, UserPlus, AlertCircle } from 'lucide-react';

interface NuevoContactoModalProps {
  abierto: boolean;
  alCerrar: () => void;
}

export const NuevoContactoModal: React.FC<NuevoContactoModalProps> = ({
  abierto,
  alCerrar,
}) => {
  const { agregarContacto, navegarA } = useContactos();

  const [nombre, setNombre] = useState('');
  const [negocio, setNegocio] = useState('');
  const [necesidad, setNecesidad] = useState('');
  const [productoInteres, setProductoInteres] = useState<ProductoInteres | ''>('');
  const [origen, setOrigen] = useState<OrigenContacto>('visita');
  const [proximaAccion, setProximaAccion] = useState('');
  const [fechaProximoContacto, setFechaProximoContacto] = useState('');

  const [errores, setErrores] = useState<Record<string, string>>({});
  const primerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (abierto) {
      setNombre('');
      setNegocio('');
      setNecesidad('');
      setProductoInteres('');
      setOrigen('visita');
      setProximaAccion('');
      setFechaProximoContacto('');
      setErrores({});
      setTimeout(() => primerInputRef.current?.focus(), 50);
    }
  }, [abierto]);

  // Manejar Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto) {
        alCerrar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre de la persona o contacto es obligatorio.';
    }

    if (!necesidad.trim()) {
      nuevosErrores.necesidad = 'Debes describir la necesidad comercial del cliente.';
    }

    // Regla de integridad: Si se programa un seguimiento, solicitar tanto acción como fecha
    const tieneAccion = proximaAccion.trim().length > 0;
    const tieneFecha = fechaProximoContacto.trim().length > 0;

    if (tieneAccion && !tieneFecha) {
      nuevosErrores.fecha = 'Ingresa la fecha en que realizarás este contacto.';
    } else if (tieneFecha && !tieneAccion) {
      nuevosErrores.accion = 'Especifica qué acción realizarás en esa fecha (ej. llamar, visitar).';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    const id = agregarContacto({
      nombre,
      negocio: negocio.trim() || undefined,
      necesidad,
      productoInteres: productoInteres ? (productoInteres as ProductoInteres) : undefined,
      origen,
      proximaAccion: proximaAccion.trim() || undefined,
      fechaProximoContacto: fechaProximoContacto || undefined,
    });

    alCerrar();
    navegarA('detalle', id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-nuevo-contacto-titulo"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-petroleo-100 text-petroleo-800" aria-hidden="true">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-nuevo-contacto-titulo" className="text-lg font-bold text-slate-900">
                Nuevo Contacto
              </h2>
              <p className="text-xs text-slate-500">
                Registra un posible cliente y programa el siguiente paso
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={alCerrar}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Nombre */}
          <div>
            <label htmlFor="contacto-nombre" className="block text-sm font-semibold text-slate-800 mb-1">
              Nombre de la persona <span className="text-rose-600" aria-hidden="true">*</span>
            </label>
            <input
              ref={primerInputRef}
              type="text"
              id="contacto-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Rosa Huamán"
              aria-required="true"
              aria-invalid={!!errores.nombre}
              aria-describedby={errores.nombre ? 'error-nombre' : undefined}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors ${
                errores.nombre ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              }`}
            />
            {errores.nombre && (
              <p id="error-nombre" className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{errores.nombre}</span>
              </p>
            )}
          </div>

          {/* Negocio */}
          <div>
            <label htmlFor="contacto-negocio" className="block text-sm font-semibold text-slate-800 mb-1">
              Nombre del negocio <span className="text-slate-400 text-xs font-normal">(Opcional)</span>
            </label>
            <input
              type="text"
              id="contacto-negocio"
              value={negocio}
              onChange={(e) => setNegocio(e.target.value)}
              placeholder="Ej. Panadería El Buen Trigo"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            />
          </div>

          {/* Necesidad */}
          <div>
            <label htmlFor="contacto-necesidad" className="block text-sm font-semibold text-slate-800 mb-1">
              Necesidad identificada <span className="text-rose-600" aria-hidden="true">*</span>
            </label>
            <textarea
              id="contacto-necesidad"
              rows={2}
              value={necesidad}
              onChange={(e) => setNecesidad(e.target.value)}
              placeholder="¿Qué busca o qué problema necesita resolver el cliente? Ej. Capital para nuevo horno rotatorio"
              aria-required="true"
              aria-invalid={!!errores.necesidad}
              aria-describedby={errores.necesidad ? 'error-necesidad' : undefined}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors ${
                errores.necesidad ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              }`}
            />
            {errores.necesidad && (
              <p id="error-necesidad" className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{errores.necesidad}</span>
              </p>
            )}
          </div>

          {/* Fila: Producto de Interés y Origen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contacto-producto" className="block text-sm font-semibold text-slate-800 mb-1">
                Producto de interés <span className="text-slate-400 text-xs font-normal">(Opcional)</span>
              </label>
              <select
                id="contacto-producto"
                value={productoInteres}
                onChange={(e) => setProductoInteres(e.target.value as ProductoInteres | '')}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              >
                <option value="">Selecciona una categoría</option>
                <option value="financiamiento">Financiamiento</option>
                <option value="ahorro">Ahorro</option>
                <option value="servicios_pago">Servicios de pago</option>
                <option value="otro">Otro producto</option>
              </select>
            </div>

            <div>
              <label htmlFor="contacto-origen" className="block text-sm font-semibold text-slate-800 mb-1">
                Origen del contacto <span className="text-rose-600" aria-hidden="true">*</span>
              </label>
              <select
                id="contacto-origen"
                value={origen}
                onChange={(e) => setOrigen(e.target.value as OrigenContacto)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              >
                <option value="visita">Visita presencial</option>
                <option value="referido">Referido</option>
                <option value="campana">Campaña de difusión</option>
              </select>
            </div>
          </div>

          {/* Bloque: Próxima acción y Fecha (Vinculados) */}
          <fieldset className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/70 space-y-3">
            <legend className="text-xs font-semibold text-petroleo-900 px-1.5 uppercase tracking-wider">
              Próximo Seguimiento (Opcional)
            </legend>
            <p className="text-xs text-slate-500">
              Si programas un contacto, indica tanto la acción concreta como la fecha acordada.
            </p>

            <div>
              <label htmlFor="contacto-accion" className="block text-xs font-medium text-slate-700 mb-1">
                Próxima acción a realizar
              </label>
              <input
                type="text"
                id="contacto-accion"
                value={proximaAccion}
                onChange={(e) => setProximaAccion(e.target.value)}
                placeholder="Ej. Llamar para revisar proforma"
                aria-invalid={!!errores.accion}
                aria-describedby={errores.accion ? 'error-accion' : undefined}
                className={`w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                  errores.accion ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errores.accion && (
                <p id="error-accion" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errores.accion}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contacto-fecha" className="block text-xs font-medium text-slate-700 mb-1">
                Fecha del próximo contacto
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="contacto-fecha"
                  min={getTodayString()}
                  value={fechaProximoContacto}
                  onChange={(e) => setFechaProximoContacto(e.target.value)}
                  aria-invalid={!!errores.fecha}
                  aria-describedby={errores.fecha ? 'error-fecha' : undefined}
                  className={`w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                    errores.fecha ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
              </div>
              {errores.fecha && (
                <p id="error-fecha" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errores.fecha}</span>
                </p>
              )}
            </div>
          </fieldset>

          {/* Acciones */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={alCerrar}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-petroleo-700 text-white text-sm font-medium hover:bg-petroleo-800 active:bg-petroleo-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-petroleo-700"
            >
              Guardar contacto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
