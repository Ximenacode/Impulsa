import React, { useState, useEffect, useRef } from 'react';
import { useContactos } from '../../context/ContactContext';
import { Contacto } from '../../types';
import { getTodayString } from '../../utils/dateUtils';
import { X, Calendar, AlertCircle } from 'lucide-react';

interface ProgramarSeguimientoModalProps {
  abierto: boolean;
  contacto: Contacto | null;
  alCerrar: () => void;
}

export const ProgramarSeguimientoModal: React.FC<ProgramarSeguimientoModalProps> = ({
  abierto,
  contacto,
  alCerrar,
}) => {
  const { programarSeguimiento } = useContactos();

  const [accion, setAccion] = useState('');
  const [fecha, setFecha] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const inputAccionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (abierto && contacto) {
      setAccion(contacto.proximaAccion || '');
      setFecha(contacto.fechaProximoContacto || '');
      setErrores({});
      setTimeout(() => inputAccionRef.current?.focus(), 50);
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

    if (!accion.trim()) {
      nuevosErrores.accion = 'Indica qué acción concreta realizarás (ej. llamar, visitar).';
    }

    if (!fecha.trim()) {
      nuevosErrores.fecha = 'Selecciona la fecha para realizar este contacto.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    programarSeguimiento(contacto.id, accion, fecha);
    alCerrar();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-programar-titulo"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-petroleo-100 text-petroleo-800" aria-hidden="true">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-programar-titulo" className="text-lg font-bold text-slate-900">
                Programar Seguimiento
              </h2>
              <p className="text-xs text-slate-600 truncate max-w-[240px]">
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

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <div>
            <label htmlFor="prog-accion" className="block text-sm font-semibold text-slate-800 mb-1">
              Próxima acción <span className="text-rose-600">*</span>
            </label>
            <input
              ref={inputAccionRef}
              type="text"
              id="prog-accion"
              value={accion}
              onChange={(e) => setAccion(e.target.value)}
              placeholder="Ej. Llamar para verificar recepción de proforma"
              aria-required="true"
              aria-invalid={!!errores.accion}
              aria-describedby={errores.accion ? 'error-prog-accion' : undefined}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                errores.accion ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              }`}
            />
            {errores.accion && (
              <p id="error-prog-accion" className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{errores.accion}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="prog-fecha" className="block text-sm font-semibold text-slate-800 mb-1">
              Fecha de contacto <span className="text-rose-600">*</span>
            </label>
            <input
              type="date"
              id="prog-fecha"
              min={getTodayString()}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              aria-required="true"
              aria-invalid={!!errores.fecha}
              aria-describedby={errores.fecha ? 'error-prog-fecha' : undefined}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700 ${
                errores.fecha ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              }`}
            />
            {errores.fecha && (
              <p id="error-prog-fecha" className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{errores.fecha}</span>
              </p>
            )}
          </div>

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
              Guardar fecha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
