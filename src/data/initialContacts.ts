import { Contacto } from '../types';
import { getRelativeDateString } from '../utils/dateUtils';

/**
 * Genera el conjunto de 8 contactos de prueba con fechas relativas al día en que se inicia la app.
 * No utiliza nombres completos, teléfonos ni documentos de personas reales.
 */
export function generarContactosIniciales(): Contacto[] {
  return [
    {
      id: 'c1',
      nombre: 'Bertha M.',
      negocio: 'Bodega San Pedro',
      necesidad: 'Capital de trabajo para surtir abarrotes y bebidas para fin de mes',
      productoInteres: 'financiamiento',
      origen: 'visita',
      etapa: 'contactado',
      proximaAccion: 'Llamar para verificar si tiene lista la boleta de sus proveedores',
      fechaProximoContacto: getRelativeDateString(-2), // Vencido hace 2 días
      historial: [
        {
          id: 'h1-1',
          fecha: getRelativeDateString(-5),
          tipo: 'visita',
          resumen: 'Visita presencial a la bodega. Mostró interés en financiamiento de corto plazo.',
        },
      ],
      fechaCreacion: getRelativeDateString(-5),
    },
    {
      id: 'c2',
      nombre: 'Marcos T.',
      negocio: 'Taller de Calzado Rápido',
      necesidad: 'Financiamiento para adquisición de máquina aparadora industrial',
      productoInteres: 'financiamiento',
      origen: 'campana',
      etapa: 'contactado',
      proximaAccion: 'Enviar requisitos para evaluación de activo fijo',
      fechaProximoContacto: getRelativeDateString(-1), // Vencido hace 1 día (Ayer)
      historial: [
        {
          id: 'h2-1',
          fecha: getRelativeDateString(-3),
          tipo: 'llamada',
          resumen: 'Contacto telefónico tras folleto en feria comercial. Requiere cotización de la máquina.',
        },
      ],
      fechaCreacion: getRelativeDateString(-3),
    },
    {
      id: 'c3',
      nombre: 'Rosa H.',
      negocio: 'Panadería El Buen Trigo',
      necesidad: 'Financiamiento para compra de nuevo horno rotatorio antes de campaña',
      productoInteres: 'financiamiento',
      origen: 'visita',
      etapa: 'interesado',
      proximaAccion: 'Llamar para coordinar revisión de proforma del horno',
      fechaProximoContacto: getRelativeDateString(0), // Para hoy
      historial: [
        {
          id: 'h3-1',
          fecha: getRelativeDateString(-4),
          tipo: 'visita',
          resumen: 'Conversación en panadería. Indicó que el jueves tendría la cotización del proveedor.',
        },
      ],
      fechaCreacion: getRelativeDateString(-4),
    },
    {
      id: 'c4',
      nombre: 'Walter C.',
      negocio: 'Ferretería El Tornillo',
      necesidad: 'Solución de cobro electrónico (POS/transferencias) para sus clientes',
      productoInteres: 'servicios_pago',
      origen: 'referido',
      etapa: 'nuevo',
      proximaAccion: 'Visitar la ferretería para explicar comisiones y funcionamiento del equipo',
      fechaProximoContacto: getRelativeDateString(0), // Para hoy
      historial: [],
      fechaCreacion: getRelativeDateString(-1),
    },
    {
      id: 'c5',
      nombre: 'Elena M.',
      negocio: 'Librería y Útiles ABC',
      necesidad: 'Cuenta de ahorro empresarial para resguardar ganancias antes de campaña escolar',
      productoInteres: 'ahorro',
      origen: 'referido',
      etapa: 'interesado',
      proximaAccion: 'Enviar comparativa de tasas de ahorro para pequeños negocios',
      fechaProximoContacto: getRelativeDateString(1), // Mañana
      historial: [
        {
          id: 'h5-1',
          fecha: getRelativeDateString(-2),
          tipo: 'llamada',
          resumen: 'Recomendada por comerciante vecino. Busca rentabilizar su capital de trabajo sin riesgo.',
        },
      ],
      fechaCreacion: getRelativeDateString(-2),
    },
    {
      id: 'c6',
      nombre: 'Jorge L.',
      negocio: 'Peluquería y Spa Glamour',
      necesidad: 'Terminal de cobro para tarjetas de débito y crédito',
      productoInteres: 'servicios_pago',
      origen: 'campana',
      etapa: 'contactado',
      proximaAccion: 'Confirmar horario para entrega e instalación del terminal',
      fechaProximoContacto: getRelativeDateString(3), // En 3 días
      historial: [
        {
          id: 'h6-1',
          fecha: getRelativeDateString(-1),
          tipo: 'mensaje',
          resumen: 'Consultó por mensaje sobre costos de mantenimiento del terminal de pago.',
        },
      ],
      fechaCreacion: getRelativeDateString(-1),
    },
    {
      id: 'c7',
      nombre: 'Lucía P.',
      negocio: 'Restaurante Sabores del Norte',
      necesidad: 'Financiamiento para remodelación de salón de comensales',
      productoInteres: 'financiamiento',
      origen: 'visita',
      etapa: 'cerrado_con_venta',
      proximaAccion: undefined,
      fechaProximoContacto: undefined,
      historial: [
        {
          id: 'h7-1',
          fecha: getRelativeDateString(-12),
          tipo: 'visita',
          resumen: 'Levantamiento de información y cálculo preliminar de inversión.',
        },
        {
          id: 'h7-2',
          fecha: getRelativeDateString(-7),
          tipo: 'llamada',
          resumen: 'Validación de documentos comerciales y referencias.',
        },
        {
          id: 'h7-3',
          fecha: getRelativeDateString(-2),
          tipo: 'visita',
          resumen: 'Firma de contrato y formalización exitosa de la operación.',
        },
      ],
      fechaCreacion: getRelativeDateString(-12),
    },
    {
      id: 'c8',
      nombre: 'Raúl S.',
      negocio: 'Minimarket La Esquina',
      necesidad: 'Financiamiento de furgoneta pequeña para reparto a domicilio',
      productoInteres: 'financiamiento',
      origen: 'referido',
      etapa: 'cerrado_sin_venta',
      motivoPerdida: 'Decidió postergar la adquisición de la furgoneta y operar con servicio tercerizado.',
      proximaAccion: undefined,
      fechaProximoContacto: undefined,
      historial: [
        {
          id: 'h8-1',
          fecha: getRelativeDateString(-9),
          tipo: 'visita',
          resumen: 'Reunión en tienda para evaluar capacidad de cuota mensual.',
        },
        {
          id: 'h8-2',
          fecha: getRelativeDateString(-4),
          tipo: 'llamada',
          resumen: 'Comunica que los costos de mantenimiento vehicular exceden su previsión y opta por no continuar por ahora.',
        },
      ],
      fechaCreacion: getRelativeDateString(-9),
    },
  ];
}
