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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-superficie rounded-tarjeta shadow-elevada max-w-md w-full overflow-hidden border border-borde-suave animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-borde-suave bg-superficie">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                esVenta ? 'bg-estado-ganadoBg text-estado-ganadoText' : 'bg-fondo text-texto-secundario'
              }`}
              aria-hidden="true"
            >
              {esVenta ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            </div>
            <div>
              <h2 id="modal-cerrar-titulo" className="text-base font-bold text-texto-principal">
                {esVenta ? 'Cerrar con Venta' : 'Cerrar sin Venta'}
              </h2>
              <p className="text-xs text-texto-secundario truncate max-w-[240px]">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-xs text-texto-secundario leading-relaxed">
            {esVenta
              ? 'Estás a punto de marcar esta oportunidad comercial como formalizada y concretada.'
              : 'Vas a registrar que la oportunidad concluye sin concretarse en esta ocasión.'}
          </p>

          {/* Motivo de pérdida opcional */}
          {!esVenta && (
            <div>
              <label htmlFor="motivo-perdida" className="block text-xs font-semibold text-texto-principal mb-1">
                Motivo del descarte o no concreción <span className="text-texto-terciario font-normal">(Opcional)</span>
              </label>
              <textarea
                id="motivo-perdida"
                rows={2}
                value={motivoPerdida}
                onChange={(e) => setMotivoPerdida(e.target.value)}
                placeholder="Ej. Postergó la inversión para el siguiente trimestre, optó por usar capital propio..."
                className="w-full px-3 py-2 rounded-lg border border-borde-suave bg-fondo focus:bg-superficie text-xs focus:outline-none focus:ring-2 focus:ring-petroleo-700"
              />
            </div>
          )}

          {/* Decisión sobre el seguimiento pendiente */}
          {tieneSeguimientoPendiente && (
            <fieldset className="p-3.5 bg-acento-calidoLight border border-acento-calidoBorder rounded-xl space-y-2">
              <legend className="text-[11px] font-semibold text-[#8C5D19] px-1 uppercase tracking-wider">
                Seguimiento pendiente detectado
              </legend>
              <p className="text-xs text-texto-principal">
                Este contacto tiene programada la acción: <br />
                <span className="font-semibold italic">"{contacto.proximaAccion}"</span>
              </p>
              <p className="text-xs font-medium text-texto-principal mt-2">
                ¿Qué deseas hacer con este recordatorio?
              </p>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 text-xs text-texto-principal cursor-pointer">
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

                <label className="flex items-center gap-2 text-xs text-texto-principal cursor-pointer">
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

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-borde-suave">
            <button
              type="button"
              onClick={alCerrar}
              className="px-3.5 py-2 rounded-lg border border-borde-suave text-texto-secundario text-xs font-semibold hover:bg-fondo hover:text-texto-principal focus:outline-none focus:ring-2 focus:ring-petroleo-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white text-xs font-semibold shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                esVenta
                  ? 'bg-petroleo-700 hover:bg-petroleo-800 focus:ring-petroleo-700'
                  : 'bg-texto-secundario hover:bg-texto-principal focus:ring-texto-principal'
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
