/**
 * Utilidades para manejo de fechas en formato ISO YYYY-MM-DD
 * Evita desfases por zona horaria de JavaScript UTC.
 */

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRelativeDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export type EstadoFecha = 'vencido' | 'hoy' | 'proximo' | 'sin_fecha';

export function getEstadoFecha(dateStr?: string): EstadoFecha {
  if (!dateStr || dateStr.trim() === '') return 'sin_fecha';
  const today = getTodayString();
  if (dateStr < today) return 'vencido';
  if (dateStr === today) return 'hoy';
  return 'proximo';
}

export function getDiasDiferencia(dateStr: string): number {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return 0;
  const [y, m, d] = parts.map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = target.getTime() - todayStart.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

const NOMBRES_DIAS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const NOMBRES_MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'setiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export function formatFechaLegible(dateStr?: string): string {
  if (!dateStr || dateStr.trim() === '') return 'Sin fecha asignada';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts.map(Number);
  const fecha = new Date(y, m - 1, d);
  const diff = getDiasDiferencia(dateStr);

  const diaSemana = NOMBRES_DIAS[fecha.getDay()];
  const diaMes = fecha.getDate();
  const mes = NOMBRES_MESES[fecha.getMonth()];

  if (diff === 0) {
    return `Hoy (${diaSemana}, ${diaMes} de ${mes})`;
  }
  if (diff === -1) {
    return `Ayer (Vencido hace 1 día)`;
  }
  if (diff < -1) {
    return `Vencido hace ${Math.abs(diff)} días (${diaMes} de ${mes})`;
  }
  if (diff === 1) {
    return `Mañana (${diaSemana}, ${diaMes} de ${mes})`;
  }
  return `${diaSemana}, ${diaMes} de ${mes}`;
}

export function formatFechaCorta(dateStr?: string): string {
  if (!dateStr || dateStr.trim() === '') return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [, m, d] = parts.map(Number);
  return `${d} ${NOMBRES_MESES[m - 1].substring(0, 3)}.`;
}
