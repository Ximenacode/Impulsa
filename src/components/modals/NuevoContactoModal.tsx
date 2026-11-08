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
      nuevosErrores.nombre = 'El nombre del contacto es obligatorio.';
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
      nuevosErrores.accion = 'Especifica qué acción realizarás en esa fecha.';
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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-superficie rounded-tarjeta shadow-elevada max-w-lg w-full overflow-hidden border border-borde-suave animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-borde-suave bg-superficie">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-petroleo-50 text-petroleo-700 flex items-center justify-center shrink-0" aria-hidden="true">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-nuevo-contacto-titulo" className="text-base font-bold text-texto-principal">
                Nuevo Contacto
              </h2>
              <p className="text-xs text-texto-secundario">
                Registra un posible cliente y programa el siguiente paso
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={alCerrar}
            className="p-1.5 rounded-lg text-texto-terciario hover:text-texto-principal hover:bg-fondo focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Nombre */}
          <div>
            <label htmlFor="contacto-nombre" className="block text-xs font-semibold text-texto-principal mb-1">
              Nombre de la persona <span className="text-estado-vencidoText" aria-hidden="true">*</span>
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
              className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors ${
                errores.nombre ? 'border-estado-vencidoBorder bg-estado-vencidoBg/40' : 'border-borde-suave bg-fondo focus:bg-superficie'
              }`}
            />
            {errores.nombre && (
              <p id="error-nombre" className="mt-1 text-[11px] text-estado-vencidoText flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                <span>{errores.nombre}</span>
              </p>
            )}
          </div>

          {/* Negocio */}
          <div>
            <label htmlFor="contacto-negocio" className="block text-xs font-semibold text-texto-principal mb-1">
              Nombre del negocio <span className="text-texto-terciario font-normal">(Opcional)</span>
            </label>
            <input
              type="text"
              id="contacto-negocio"
              value={negocio}
              onChange={(e) => setNegocio(e.target.value)}
              placeholder="Ej. Panadería El Buen Trigo"
              className="w-full px-3 py-2 rounded-lg border border-borde-suave bg-fondo focus:bg-superficie text-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            />
          </div>

          {/* Necesidad */}
          <div>
            <label htmlFor="contacto-necesidad" className="block text-xs font-semibold text-texto-principal mb-1">
              Necesidad identificada <span className="text-estado-vencidoText" aria-hidden="true">*</span>
            </label>
            <textarea
              id="contacto-necesidad"
              rows={2}
              value={necesidad}
              onChange={(e) => setNecesidad(e.target.value)}
              placeholder="¿Qué busca o qué problema necesita resolver el cliente?"
              aria-required="true"
              aria-invalid={!!errores.necesidad}
              aria-describedby={errores.necesidad ? 'error-necesidad' : undefined}
              className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors ${
                errores.necesidad ? 'border-estado-vencidoBorder bg-estado-vencidoBg/40' : 'border-borde-suave bg-fondo focus:bg-superficie'
              }`}
            />
            {errores.necesidad && (
              <p id="error-necesidad" className="mt-1 text-[11px] text-estado-vencidoText flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                <span>{errores.necesidad}</span>
              </p>
            )}
          </div>

          {/* Producto y Origen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="contacto-producto" className="block text-xs font-semibold text-texto-principal mb-1">
                Producto de interés <span className="text-texto-terciario font-normal">(Opcional)</span>
              </label>
              <select
                id="contacto-producto"
                value={productoInteres}
                onChange={(e) => setProductoInteres(e.target.value as ProductoInteres | '')}
                className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs bg-fondo focus:bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              >
                <option value="">Selecciona una categoría</option>
                <option value="financiamiento">Financiamiento</option>
                <option value="ahorro">Ahorro</option>
                <option value="servicios_pago">Servicios de pago</option>
                <option value="otro">Otro producto</option>
              </select>
            </div>

            <div>
              <label htmlFor="contacto-origen" className="block text-xs font-semibold text-texto-principal mb-1">
                Origen del contacto <span className="text-estado-vencidoText" aria-hidden="true">*</span>
              </label>
              <select
                id="contacto-origen"
                value={origen}
                onChange={(e) => setOrigen(e.target.value as OrigenContacto)}
                className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs bg-fondo focus:bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              >
                <option value="visita">Visita presencial</option>
                <option value="referido">Referido</option>
                <option value="campana">Campaña de difusión</option>
              </select>
            </div>
          </div>

          {/* Bloque: Próxima acción y Fecha (Vinculados) */}
          <fieldset className="border border-borde-suave rounded-xl p-3.5 bg-fondo/60 space-y-3">
            <legend className="text-[11px] font-semibold text-petroleo-700 px-1 uppercase tracking-wider">
              Próximo Seguimiento (Opcional)
            </legend>
            <p className="text-[11px] text-texto-secundario">
              Si programas un contacto, indica tanto la acción concreta como la fecha acordada.
            </p>

            <div>
              <label htmlFor="contacto-accion" className="block text-xs font-medium text-texto-principal mb-1">
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
                className={`w-full px-3 py-2 rounded-lg border text-xs bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                  errores.accion ? 'border-estado-vencidoBorder bg-estado-vencidoBg/40' : 'border-borde-suave'
                }`}
              />
              {errores.accion && (
                <p id="error-accion" className="mt-1 text-[11px] text-estado-vencidoText flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errores.accion}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contacto-fecha" className="block text-xs font-medium text-texto-principal mb-1">
                Fecha del próximo contacto
              </label>
              <input
                type="date"
                id="contacto-fecha"
                min={getTodayString()}
                value={fechaProximoContacto}
                onChange={(e) => setFechaProximoContacto(e.target.value)}
                aria-invalid={!!errores.fecha}
                aria-describedby={errores.fecha ? 'error-fecha' : undefined}
                className={`w-full px-3 py-2 rounded-lg border text-xs bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                  errores.fecha ? 'border-estado-vencidoBorder bg-estado-vencidoBg/40' : 'border-borde-suave'
                }`}
              />
              {errores.fecha && (
                <p id="error-fecha" className="mt-1 text-[11px] text-estado-vencidoText flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errores.fecha}</span>
                </p>
              )}
            </div>
          </fieldset>

          {/* Acciones */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-borde-suave">
            <button
              type="button"
              onClick={alCerrar}
              className="px-3.5 py-2 rounded-lg border border-borde-suave text-texto-secundario text-xs font-semibold hover:bg-fondo hover:text-texto-principal focus:outline-none focus:ring-2 focus:ring-petroleo-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-petroleo-700 text-white text-xs font-semibold hover:bg-petroleo-800 active:bg-petroleo-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-petroleo-700 transition-colors"
            >
              Guardar contacto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
