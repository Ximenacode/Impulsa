import React, { useState, useEffect } from 'react';
import { useContactos } from '../../context/ContactContext';
import { Contacto } from '../../types';
import { X, CheckCircle2, XCircle } from 'lucide-react';

interface CerrarOportunidadModalProps {
  abierto: boolean;
  contacto: Contacto | null;
  etapaDestino: 'cerrado_con_venta' | 'cerrado_sin_venta' | null;
  alCerrar: () => void;
}

export const CerrarOportunidadModal: React.FC<CerrarOportunidadModalProps> = ({
  abierto,
  contacto,
  etapaDestino,
  alCerrar,
}) => {
  const { cambiarEtapa } = useContactos();

  const [motivoPerdida, setMotivoPerdida] = useState('');
  const [decisionSeguimiento, setDecisionSeguimiento] = useState<'completar' | 'mantener'>('completar');

  useEffect(() => {
    if (abierto) {
      setMotivoPerdida('');
      setDecisionSeguimiento('completar');
    }
  }, [abierto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto) {
        alCerrar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto, alCerrar]);

  if (!abierto || !contacto || !etapaDestino) return null;

  const esVenta = etapaDestino === 'cerrado_con_venta';
  const tieneSeguimientoPendiente = !!(contacto.proximaAccion || contacto.fechaProximoContacto);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    cambiarEtapa(
      contacto.id,
      etapaDestino,
      !esVenta ? motivoPerdida : undefined,
      tieneSeguimientoPendiente ? decisionSeguimiento : undefined
    );

    alCerrar();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cerrar-titulo"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                esVenta ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}
              aria-hidden="true"
            >
              {esVenta ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 id="modal-cerrar-titulo" className="text-lg font-bold text-slate-900">
                {esVenta ? 'Cerrar con Venta' : 'Cerrar sin Venta'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            {esVenta
              ? 'Estás a punto de marcar esta oportunidad comercial como formalizada y ganada.'
              : 'Vas a registrar que la oportunidad concluye sin concretarse en esta ocasión.'}
          </p>

          {/* Motivo de pérdida opcional */}
          {!esVenta && (
            <div>
              <label htmlFor="motivo-perdida" className="block text-sm font-semibold text-slate-800 mb-1">
                Motivo del descarte o no concreción <span className="text-slate-400 font-normal">(Opcional)</span>
              </label>
              <textarea
                id="motivo-perdida"
                rows={2}
                value={motivoPerdida}
                onChange={(e) => setMotivoPerdida(e.target.value)}
                placeholder="Ej. Postergó la inversión para el siguiente trimestre, optó por usar capital propio..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              />
            </div>
          )}

          {/* Decisión sobre el seguimiento pendiente */}
          {tieneSeguimientoPendiente && (
            <fieldset className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
              <legend className="text-xs font-semibold text-amber-900 px-1">
                Seguimiento pendiente detectado
              </legend>
              <p className="text-xs text-slate-700">
                Este contacto tiene programada la acción: <br />
                <span className="font-semibold italic">"{contacto.proximaAccion}"</span>
              </p>
              <p className="text-xs font-medium text-slate-800 mt-2">
                ¿Qué deseas hacer con este recordatorio?
              </p>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="decisionSeguimiento"
                    value="completar"
                    checked={decisionSeguimiento === 'completar'}
                    onChange={() => setDecisionSeguimiento('completar')}
                    className="text-petroleo-700 focus:ring-petroleo-700"
                  />
                  <span>Completar y retirar de la lista de pendientes</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="decisionSeguimiento"
                    value="mantener"
                    checked={decisionSeguimiento === 'mantener'}
                    onChange={() => setDecisionSeguimiento('mantener')}
                    className="text-petroleo-700 focus:ring-petroleo-700"
                  />
                  <span>Mantener recordatorio activo en "Mi día"</span>
                </label>
              </div>
            </fieldset>
          )}

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
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                esVenta
                  ? 'bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-700'
                  : 'bg-slate-700 hover:bg-slate-800 focus:ring-slate-700'
              }`}
            >
              Confirmar cierre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
