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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-superficie rounded-tarjeta shadow-elevada max-w-lg w-full overflow-hidden border border-borde-suave animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-borde-suave bg-superficie">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-petroleo-50 text-petroleo-700 flex items-center justify-center shrink-0" aria-hidden="true">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-registrar-seguimiento-titulo" className="text-base font-bold text-texto-principal">
                Registrar Seguimiento
              </h2>
              <p className="text-xs text-texto-secundario">
                {contacto.nombre} {contacto.negocio ? `• ${contacto.negocio}` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={alCerrar}
            className="p-1.5 rounded-lg text-texto-terciario hover:text-texto-principal hover:bg-fondo focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Contexto del seguimiento previo */}
          {contacto.proximaAccion && (
            <div className="p-3 bg-fondo border border-borde-suave rounded-lg text-xs space-y-0.5">
              <span className="font-semibold text-petroleo-700 text-[11px] uppercase tracking-wider block">
                Acción programada previa:
              </span>
              <p className="text-texto-principal font-medium">{contacto.proximaAccion}</p>
              {contacto.fechaProximoContacto && (
                <p className="text-[11px] text-texto-secundario pt-0.5">
                  Fecha asignada: {formatFechaLegible(contacto.fechaProximoContacto)}
                </p>
              )}
            </div>
          )}

          {/* Tipo de interacción */}
          <div>
            <label htmlFor="seg-tipo" className="block text-xs font-semibold text-texto-principal mb-1">
              Medio de contacto realizado <span className="text-estado-vencidoText">*</span>
            </label>
            <select
              id="seg-tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs bg-fondo focus:bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              <option value="llamada">Llamada telefónica</option>
              <option value="visita">Visita presencial</option>
              <option value="mensaje">Mensaje de texto / chat</option>
              <option value="otro">Otro medio</option>
            </select>
          </div>

          {/* Resumen */}
          <div>
            <label htmlFor="seg-resumen" className="block text-xs font-semibold text-texto-principal mb-1">
              Resumen de la conversación y acuerdos <span className="text-estado-vencidoText">*</span>
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
              className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                errores.resumen ? 'border-estado-vencidoBorder bg-estado-vencidoBg/40' : 'border-borde-suave bg-fondo focus:bg-superficie'
              }`}
            />
            {errores.resumen && (
              <p id="error-seg-resumen" className="mt-1 text-[11px] text-estado-vencidoText flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                <span>{errores.resumen}</span>
              </p>
            )}
          </div>

          {/* Actualizar etapa */}
          <div>
            <label htmlFor="seg-etapa" className="block text-xs font-semibold text-texto-principal mb-1">
              Actualizar etapa comercial de la oportunidad
            </label>
            <select
              id="seg-etapa"
              value={nuevaEtapa}
              onChange={(e) => setNuevaEtapa(e.target.value as EtapaComercial)}
              className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs bg-fondo focus:bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              <option value="nuevo">Nuevo</option>
              <option value="contactado">Contactado</option>
              <option value="interesado">Interesado</option>
              <option value="cerrado_con_venta">Cerrado con venta</option>
              <option value="cerrado_sin_venta">Cerrado sin venta</option>
            </select>
          </div>

          {/* Checkbox para programar próximo contacto */}
          <div className="pt-2 border-t border-borde-suave">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={programarSiguiente}
                onChange={(e) => setProgramarSiguiente(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-borde-suave text-petroleo-700 focus:ring-petroleo-700"
              />
              <span className="text-xs font-medium text-texto-principal">
                Programar el siguiente contacto de una vez
              </span>
            </label>
          </div>

          {/* Subformulario si se activa programar siguiente */}
          {programarSiguiente && (
            <div className="p-3.5 bg-fondo border border-borde-suave rounded-xl space-y-3">
              <div>
                <label htmlFor="seg-prox-accion" className="block text-xs font-semibold text-texto-principal mb-1">
                  Próxima acción <span className="text-estado-vencidoText">*</span>
                </label>
                <input
                  type="text"
                  id="seg-prox-accion"
                  value={siguienteAccion}
                  onChange={(e) => setSiguienteAccion(e.target.value)}
                  placeholder="Ej. Recoger proforma firmada"
                  className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                />
                {errores.siguienteAccion && (
                  <p className="mt-1 text-[11px] text-estado-vencidoText">{errores.siguienteAccion}</p>
                )}
              </div>

              <div>
                <label htmlFor="seg-prox-fecha" className="block text-xs font-semibold text-texto-principal mb-1">
                  Fecha del próximo contacto <span className="text-estado-vencidoText">*</span>
                </label>
                <input
                  type="date"
                  id="seg-prox-fecha"
                  min={getTodayString()}
                  value={siguienteFecha}
                  onChange={(e) => setSiguienteFecha(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-borde-suave text-xs bg-superficie focus:outline-none focus:ring-2 focus:ring-petroleo-700"
                />
                {errores.siguienteFecha && (
                  <p className="mt-1 text-[11px] text-estado-vencidoText">{errores.siguienteFecha}</p>
                )}
              </div>
            </div>
          )}

          {/* Si no se programa el siguiente, dar opción de completar el pendiente anterior */}
          {!programarSiguiente && contacto.proximaAccion && (
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-texto-secundario">
                <input
                  type="checkbox"
                  checked={completarAnterior}
                  onChange={(e) => setCompletarAnterior(e.target.checked)}
                  className="rounded border-borde-suave text-petroleo-700 focus:ring-petroleo-700"
                />
                <span>Marcar la acción previa como completada</span>
              </label>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-borde-suave">
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
              Guardar seguimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
