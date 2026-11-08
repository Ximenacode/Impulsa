export type EtapaComercial =
  | 'nuevo'
  | 'contactado'
  | 'interesado'
  | 'cerrado_con_venta'
  | 'cerrado_sin_venta';

export type OrigenContacto = 'referido' | 'campana' | 'visita';

export type ProductoInteres =
  | 'financiamiento'
  | 'ahorro'
  | 'servicios_pago'
  | 'otro';

export interface RegistroConversacion {
  id: string;
  fecha: string; // ISO string YYYY-MM-DD o timestamp
  tipo: 'llamada' | 'visita' | 'mensaje' | 'otro';
  resumen: string;
}

export interface Contacto {
  id: string;
  nombre: string; // Obligatorio
  negocio?: string; // Opcional
  necesidad: string; // Obligatorio
  productoInteres?: ProductoInteres; // Opcional
  origen: OrigenContacto; // Obligatorio
  etapa: EtapaComercial;
  proximaAccion?: string; // Opcional (par de fecha)
  fechaProximoContacto?: string; // Formato YYYY-MM-DD
  motivoPerdida?: string; // Opcional para cerrado_sin_venta
  historial: RegistroConversacion[];
  fechaCreacion: string;
}

export type Pantalla = 'mi_dia' | 'contactos' | 'detalle' | 'oportunidades' | 'resultados';

export interface ToastMessage {
  id: string;
  tipo: 'exito' | 'info' | 'advertencia';
  mensaje: string;
}
