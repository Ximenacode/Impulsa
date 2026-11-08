import React, { useState, useEffect, useRef } from 'react';
import { useContactos } from '../../context/ContactContext';
import { Contacto, EtapaComercial } from '../../types';
import { getTodayString, formatFechaLegible } from '../../utils/dateUtils';
import { X, CheckSquare, AlertCircle } from 'lucide-react';

interface RegistrarSeguimientoModalProps {
  abierto: boolean;
  contacto: Contacto | null;
  alCerrar: () => void;
}

export const RegistrarSeguimientoModal: React.FC<RegistrarSeguimientoModalProps> = ({
  abierto,
  contacto,
  alCerrar,
}) => {
  const { registrarSeguimiento } = useContactos();

  const [resumen, setResumen] = useState('');
  const [tipo, setTipo] = useState<'llamada' | 'visita' | 'mensaje' | 'otro'>('llamada');
  const [nuevaEtapa, setNuevaEtapa] = useState<EtapaComercial>('contactado');
  const [programarSiguiente, setProgramarSiguiente] = useState(false);
  const [siguienteAccion, setSiguienteAccion] = useState('');
  const [siguienteFecha, setSiguienteFecha] = useState('');
  const [completarAnterior, setCompletarAnterior] = useState(true);

  const [errores, setErrores] = useState<Record<string, string>>({});
  const resumenInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (abierto && contacto) {
      setResumen('');
      setTipo('llamada');
      setNuevaEtapa(contacto.etapa);
      setProgramarSiguiente(false);
      setSiguienteAccion('');
      setSiguienteFecha('');
      setCompletarAnterior(true);
      setErrores({});
      setTimeout(() => resumenInputRef.current?.focus(), 50);
    }
  }, [abierto, contacto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto) {
        alCerrar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto, alCerrar]);

  if (!abierto || !contacto) return null;

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!resumen.trim()) {
      nuevosErrores.resumen = 'Ingresa un resumen de lo conversado o acordado.';
    }

    if (programarSiguiente) {
      if (!siguienteAccion.trim()) {
        nuevosErrores.siguienteAccion = 'Indica qué acción realizarás en la próxima fecha.';
      }
      if (!siguienteFecha.trim()) {
        nuevosErrores.siguienteFecha = 'Selecciona la fecha para el próximo contacto.';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    registrarSeguimiento(contacto.id, {
      resumen,
      tipo,
      nuevaEtapa,
      proximaAccion: programarSiguiente ? siguienteAccion : undefined,
      fechaProximoContacto: programarSiguiente ? siguienteFecha : undefined,
      completarSeguimientoAnterior: completarAnterior,
    });

    alCerrar();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-registrar-seguimiento-titulo"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-petroleo-100 text-petroleo-800" aria-hidden="true">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-registrar-seguimiento-titulo" className="text-lg font-bold text-slate-900">
                Registrar Seguimiento
              </h2>
              <p className="text-xs text-slate-600">
                {contacto.nombre} {contacto.negocio ? `• ${contacto.negocio}` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={alCerrar}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Contexto del seguimiento previo si existía */}
          {contacto.proximaAccion && (
            <div className="p-3 bg-petroleo-50 border border-petroleo-200 rounded-lg text-xs text-petroleo-900">
              <p className="font-semibold text-petroleo-950">Acción programada previa:</p>
              <p className="mt-0.5">{contacto.proximaAccion}</p>
              {contacto.fechaProximoContacto && (
                <p className="mt-1 text-petroleo-700 font-medium">
                  Fecha asignada: {formatFechaLegible(contacto.fechaProximoContacto)}
                </p>
              )}
            </div>
          )}

          {/* Tipo de interacción */}
          <div>
            <label htmlFor="seg-tipo" className="block text-sm font-semibold text-slate-800 mb-1">
              Medio de contacto realizado <span className="text-rose-600">*</span>
            </label>
            <select
              id="seg-tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              <option value="llamada">Llamada telefónica</option>
              <option value="visita">Visita presencial</option>
              <option value="mensaje">Mensaje de texto / chat</option>
              <option value="otro">Otro medio</option>
            </select>
          </div>

          {/* Resumen */}
          <div>
            <label htmlFor="seg-resumen" className="block text-sm font-semibold text-slate-800 mb-1">
              Resumen de la conversación y acuerdos <span className="text-rose-600">*</span>
            </label>
            <textarea
              ref={resumenInputRef}
              id="seg-resumen"
              rows={3}
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              placeholder="¿Qué conversaron? ¿Cuáles son las objeciones, avances o acuerdos alcanzados?"
              aria-required="true"
              aria-invalid={!!errores.resumen}
              aria-describedby={errores.resumen ? 'error-seg-resumen' : undefined}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                errores.resumen ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              }`}
            />
            {errores.resumen && (
              <p id="error-seg-resumen" className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{errores.resumen}</span>
              </p>
            )}
          </div>

          {/* Actualizar etapa */}
          <div>
            <label htmlFor="seg-etapa" className="block text-sm font-semibold text-slate-800 mb-1">
              Actualizar etapa comercial de la oportunidad
            </label>
            <select
              id="seg-etapa"
              value={nuevaEtapa}
              onChange={(e) => setNuevaEtapa(e.target.value as EtapaComercial)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              <option value="nuevo">Nuevo</option>
              <option value="contactado">Contactado</option>
              <option value="interesado">Interesado</option>
              <option value="cerrado_con_venta">Cerrado con venta</option>
              <option value="cerrado_sin_venta">Cerrado sin venta</option>
            </select>
          </div>

          {/* Checkbox para programar próximo contacto */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={programarSiguiente}
                onChange={(e) => setProgramarSiguiente(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-petroleo-700 focus:ring-petroleo-700"
              />
              <span className="text-sm font-medium text-slate-800">
                Programar el siguiente contacto de una vez
              </span>
            </label>
          </div>

          {/* Subformulario si se activa programar siguiente */}
          {programarSiguiente && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div>
                <label htmlFor="seg-prox-accion" className="block text-xs font-semibold text-slate-700 mb-1">
                  Próxima acción <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="seg-prox-accion"
                  value={siguienteAccion}
                  onChange={(e) => setSiguienteAccion(e.target.value)}
                  placeholder="Ej. Recoger proforma firmada"
                  aria-invalid={!!errores.siguienteAccion}
                  className={`w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                    errores.siguienteAccion ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {errores.siguienteAccion && (
                  <p className="mt-1 text-xs text-rose-600">{errores.siguienteAccion}</p>
                )}
              </div>

              <div>
                <label htmlFor="seg-prox-fecha" className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha del próximo contacto <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  id="seg-prox-fecha"
                  min={getTodayString()}
                  value={siguienteFecha}
                  onChange={(e) => setSiguienteFecha(e.target.value)}
                  aria-invalid={!!errores.siguienteFecha}
                  className={`w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                    errores.siguienteFecha ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {errores.siguienteFecha && (
                  <p className="mt-1 text-xs text-rose-600">{errores.siguienteFecha}</p>
                )}
              </div>
            </div>
          )}

          {/* Si no se programa el siguiente, dar opción de completar el pendiente anterior */}
          {!programarSiguiente && contacto.proximaAccion && (
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={completarAnterior}
                  onChange={(e) => setCompletarAnterior(e.target.checked)}
                  className="rounded border-slate-300 text-petroleo-700 focus:ring-petroleo-700"
                />
                <span>Marcar la acción previa como completada y quitarla de pendientes</span>
              </label>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
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
              Guardar seguimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
