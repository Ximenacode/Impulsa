import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contacto, EtapaComercial, Pantalla, ToastMessage } from '../types';
import { generarContactosIniciales } from '../data/initialContacts';
import { getTodayString } from '../utils/dateUtils';

interface ContactContextType {
  contactos: Contacto[];
  pantallaActiva: Pantalla;
  contactoSeleccionadoId: string | null;
  toasts: ToastMessage[];
  navegarA: (pantalla: Pantalla, contactoId?: string) => void;
  agregarContacto: (datos: {
    nombre: string;
    negocio?: string;
    necesidad: string;
    productoInteres?: Contacto['productoInteres'];
    origen: Contacto['origen'];
    proximaAccion?: string;
    fechaProximoContacto?: string;
  }) => string;
  actualizarContacto: (id: string, datos: Partial<Contacto>) => void;
  registrarSeguimiento: (
    id: string,
    opciones: {
      resumen: string;
      tipo: 'llamada' | 'visita' | 'mensaje' | 'otro';
      nuevaEtapa?: EtapaComercial;
      proximaAccion?: string;
      fechaProximoContacto?: string;
      completarSeguimientoAnterior: boolean;
    }
  ) => void;
  programarSeguimiento: (id: string, proximaAccion: string, fechaProximoContacto: string) => void;
  marcarSeguimientoRealizado: (id: string) => void;
  cambiarEtapa: (
    id: string,
    nuevaEtapa: EtapaComercial,
    motivoPerdida?: string,
    resolverSeguimiento?: 'completar' | 'mantener'
  ) => void;
  restablecerDatosDemostracion: () => void;
  mostrarToast: (mensaje: string, tipo?: 'exito' | 'info' | 'advertencia') => void;
  removerToast: (id: string) => void;
}

const STORAGE_KEY = 'impulsa_contactos_v1';

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contactos, setContactos] = useState<Contacto[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error leyendo localStorage, inicializando con datos semilla:', e);
    }
    return generarContactosIniciales();
  });

  const [pantallaActiva, setPantallaActiva] = useState<Pantalla>('mi_dia');
  const [contactoSeleccionadoId, setContactoSeleccionadoId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Guardar en localStorage ante cambios
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contactos));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  }, [contactos]);

  const mostrarToast = (mensaje: string, tipo: 'exito' | 'info' | 'advertencia' = 'exito') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);

    // Auto-remover a los 4.5 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removerToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navegarA = (pantalla: Pantalla, contactoId?: string) => {
    if (contactoId) {
      setContactoSeleccionadoId(contactoId);
    }
    setPantallaActiva(pantalla);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const agregarContacto = (datos: {
    nombre: string;
    negocio?: string;
    necesidad: string;
    productoInteres?: Contacto['productoInteres'];
    origen: Contacto['origen'];
    proximaAccion?: string;
    fechaProximoContacto?: string;
  }): string => {
    const nuevoId = 'c_' + Date.now().toString(36);
    const hoy = getTodayString();

    const nuevoContacto: Contacto = {
      id: nuevoId,
      nombre: datos.nombre.trim(),
      negocio: datos.negocio?.trim() || undefined,
      necesidad: datos.necesidad.trim(),
      productoInteres: datos.productoInteres,
      origen: datos.origen,
      etapa: 'nuevo',
      proximaAccion: datos.proximaAccion?.trim() || undefined,
      fechaProximoContacto: datos.fechaProximoContacto || undefined,
      historial: [],
      fechaCreacion: hoy,
    };

    setContactos((prev) => [nuevoContacto, ...prev]);
    mostrarToast(`Contacto "${nuevoContacto.nombre}" guardado correctamente.`);
    return nuevoId;
  };

  const actualizarContacto = (id: string, datos: Partial<Contacto>) => {
    setContactos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...datos } : c))
    );
    mostrarToast('Información de contacto actualizada.');
  };

  const registrarSeguimiento = (
    id: string,
    opciones: {
      resumen: string;
      tipo: 'llamada' | 'visita' | 'mensaje' | 'otro';
      nuevaEtapa?: EtapaComercial;
      proximaAccion?: string;
      fechaProximoContacto?: string;
      completarSeguimientoAnterior: boolean;
    }
  ) => {
    const hoy = getTodayString();
    const nuevoRegistroId = 'h_' + Date.now().toString(36);

    setContactos((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const nuevoHistorial = [
          {
            id: nuevoRegistroId,
            fecha: hoy,
            tipo: opciones.tipo,
            resumen: opciones.resumen.trim(),
          },
          ...c.historial,
        ];

        let proximaAccion = c.proximaAccion;
        let fechaProximoContacto = c.fechaProximoContacto;

        if (opciones.proximaAccion && opciones.fechaProximoContacto) {
          proximaAccion = opciones.proximaAccion.trim();
          fechaProximoContacto = opciones.fechaProximoContacto;
        } else if (opciones.completarSeguimientoAnterior) {
          proximaAccion = undefined;
          fechaProximoContacto = undefined;
        }

        return {
          ...c,
          etapa: opciones.nuevaEtapa || c.etapa,
          proximaAccion,
          fechaProximoContacto,
          historial: nuevoHistorial,
        };
      })
    );

    mostrarToast('Seguimiento e interacción registrados correctamente.');
  };

  const programarSeguimiento = (
    id: string,
    proximaAccion: string,
    fechaProximoContacto: string
  ) => {
    setContactos((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              proximaAccion: proximaAccion.trim(),
              fechaProximoContacto,
            }
          : c
      )
    );
    mostrarToast('Próximo contacto programado con éxito.');
  };

  const marcarSeguimientoRealizado = (id: string) => {
    setContactos((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const hoy = getTodayString();
        const accionPrevia = c.proximaAccion || 'Seguimiento completado';

        return {
          ...c,
          proximaAccion: undefined,
          fechaProximoContacto: undefined,
          historial: [
            {
              id: 'h_' + Date.now().toString(36),
              fecha: hoy,
              tipo: 'llamada',
              resumen: `Seguimiento marcado como realizado: "${accionPrevia}".`,
            },
            ...c.historial,
          ],
        };
      })
    );
    mostrarToast('Seguimiento marcado como realizado.');
  };

  const cambiarEtapa = (
    id: string,
    nuevaEtapa: EtapaComercial,
    motivoPerdida?: string,
    resolverSeguimiento?: 'completar' | 'mantener'
  ) => {
    setContactos((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        let proximaAccion = c.proximaAccion;
        let fechaProximoContacto = c.fechaProximoContacto;

        if (resolverSeguimiento === 'completar') {
          proximaAccion = undefined;
          fechaProximoContacto = undefined;
        }

        return {
          ...c,
          etapa: nuevaEtapa,
          motivoPerdida: nuevaEtapa === 'cerrado_sin_venta' ? motivoPerdida?.trim() : undefined,
          proximaAccion,
          fechaProximoContacto,
        };
      })
    );

    const nombresEtapas: Record<EtapaComercial, string> = {
      nuevo: 'Nuevo',
      contactado: 'Contactado',
      interesado: 'Interesado',
      cerrado_con_venta: 'Cerrado con venta',
      cerrado_sin_venta: 'Cerrado sin venta',
    };

    mostrarToast(`Etapa comercial actualizada a "${nombresEtapas[nuevaEtapa]}".`);
  };

  const restablecerDatosDemostracion = () => {
    const nuevos = generarContactosIniciales();
    setContactos(nuevos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos));
    mostrarToast('Datos de demostración restablecidos.', 'info');
  };

  return (
    <ContactContext.Provider
      value={{
        contactos,
        pantallaActiva,
        contactoSeleccionadoId,
        toasts,
        navegarA,
        agregarContacto,
        actualizarContacto,
        registrarSeguimiento,
        programarSeguimiento,
        marcarSeguimientoRealizado,
        cambiarEtapa,
        restablecerDatosDemostracion,
        mostrarToast,
        removerToast,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export function useContactos() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactos debe utilizarse dentro de un ContactProvider');
  }
  return context;
}
