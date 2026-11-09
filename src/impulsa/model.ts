import { channels, financialProducts, lossReasonLabel, lossReasons, origins, stages, t } from './texts';

export type Origin = typeof origins[number];
export type Stage = typeof stages[number];
export type Channel = typeof channels[number];
export type LossReason = typeof lossReasons[number];
export interface Contact { id: string; name: string; business: string; phone: string; need: string; origin: Origin; preferred: string; notes: string; createdAt: string }
export type ProductCategory = typeof financialProducts[number]['value'] | 'legacy';
export interface Opportunity { id: string; contactId: string; name: string; product: string; productCategory: ProductCategory; amount?: number; stage: Stage; createdAt: string; closedAt?: string; lossReason?: LossReason; lossNote?: string }
export interface Followup { id: string; opportunityId: string; channel: Channel; date: string; action: string; status: 'Pendiente' | 'Realizado' | 'Cancelado'; result?: string; notes?: string; completedAt?: string }
export interface Activity { id: string; at: string; text: string }
export interface Database { version: 3; revision: string; contacts: Contact[]; opportunities: Opportunity[]; followups: Followup[]; activity: Activity[] }
// La clave permanece estable para encontrar los datos de la primera etapa.
export const STORAGE_KEY = 'impulsa.crm.v1';
export function validPhone(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return value === '' || (value.length <= 32 && /^\+?[\d ()-]+$/.test(value) && value.replace(/\D/g, '').length >= 7 && value.replace(/\D/g, '').length <= 15);
}
export function uid(): string { return Array.from(crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16).padStart(8, '0')).join(''); }
export function today(now = new Date()): string {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(k => p.find(v => v.type === k)!.value).join('-');
}
export function localDate(day: string): Date { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); }
export function validDay(day: unknown): day is string {
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const d = localDate(day); return d.getFullYear() === +day.slice(0, 4) && d.getMonth() + 1 === +day.slice(5, 7) && d.getDate() === +day.slice(8, 10);
}
export function offsetDay(day: string, offset: number): string {
  const d = localDate(day); d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const capitalize = (value: string) => value.charAt(0).toLocaleUpperCase('es-PE') + value.slice(1);
export const formatDate = (day: string) => capitalize(new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(localDate(day)));
export const formatInstant = (at: string) => {
  const instant = new Date(at);
  const date = capitalize(new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' }).format(instant));
  return `${date} · ${new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Lima' }).format(instant)}`;
};
export const money = (n: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(n);
export const isClosed = (o: Opportunity) => o.stage === 'Ganado' || o.stage === 'Perdido';
export const isFinancing = (o: Pick<Opportunity, 'productCategory'>) => o.productCategory === 'working_capital' || o.productCategory === 'equipment';
export const financingAction = (o: Opportunity) => isFinancing(o) && o.amount !== undefined ? t.confirmFinancingAction : undefined;
const oldAmountQuestions = [
  'Consultar monto necesario y destino del financiamiento', 'Consultar cuánto financiamiento necesita',
  'Conocer el equipo que necesita y el monto solicitado', 'Comprender el destino del financiamiento',
];
export function actionCorrections(db: Database): Followup[] {
  return db.followups.filter(f => f.status === 'Pendiente' && oldAmountQuestions.includes(f.action)
    && !!financingAction(db.opportunities.find(o => o.id === f.opportunityId)!));
}
export function classify(f: Followup, day = today()): 'Vencido' | 'Para hoy' | 'Próximo' | 'Realizado' | 'Cancelado' {
  return f.status !== 'Pendiente' ? f.status : f.date < day ? 'Vencido' : f.date === day ? 'Para hoy' : 'Próximo';
}
export function dailyList(db: Database, tab: string, query: string, day = today()): Followup[] {
  const q = normalize(query);
  return db.followups.filter(f => {
    const o = db.opportunities.find(v => v.id === f.opportunityId)!;
    const c = db.contacts.find(v => v.id === o.contactId)!;
    const inTab = tab === t.completed ? f.status === 'Realizado' : f.status === 'Pendiente' && (tab === t.upcoming ? f.date > day : f.date <= day);
    return inTab && normalize(`${c.name} ${c.business} ${o.name} ${f.action}`).includes(q);
  }).sort((a, b) => tab === t.completed ? (b.completedAt || '').localeCompare(a.completedAt || '') : a.date.localeCompare(b.date));
}
export const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-PE');
export function results(db: Database) {
  const count = (values: readonly string[], list: string[]) => values.map(label => ({ label, value: list.filter(v => v === label).length }));
  const won = db.opportunities.filter(o => o.stage === 'Ganado'); const lost = db.opportunities.filter(o => o.stage === 'Perdido');
  return { won: won.length, lost: lost.length, conversion: won.length + lost.length ? won.length / (won.length + lost.length) * 100 : null,
    open: db.opportunities.filter(o => !isClosed(o)).length,
    origins: count(origins, db.contacts.map(c => c.origin)), stages: count(stages, db.opportunities.map(o => o.stage)),
    losses: count(lossReasons, lost.map(o => o.lossReason!)).map(d => ({ ...d, label: lossReasonLabel(d.label) })),
    wonOrigins: count(origins, won.map(o => db.contacts.find(c => c.id === o.contactId)!.origin)) };
}
const text = (v: unknown) => typeof v === 'string' && v.length <= 500;
const required = (v: unknown) => text(v) && (v as string).trim().length > 0;
const instant = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) && Number.isFinite(Date.parse(v));
const oneOf = (v: unknown, values: readonly string[]) => typeof v === 'string' && values.includes(v);
export function validateDatabase(value: unknown): value is Database {
  try {
    const db = value as Database;
    if (!db || db.version !== 3 || !required(db.revision) || ![db.contacts, db.opportunities, db.followups, db.activity].every(Array.isArray)) return false;
    const all = [...db.contacts, ...db.opportunities, ...db.followups, ...db.activity];
    if (!all.every(x => x && required(x.id)) || new Set(all.map(x => x.id)).size !== all.length) return false;
    if (!db.contacts.every(c => required(c.name) && required(c.business) && validPhone(c.phone) && text(c.need) && oneOf(c.origin, origins) && oneOf(c.preferred, ['', ...channels]) && text(c.notes) && instant(c.createdAt))) return false;
    if (!db.opportunities.every(o => db.contacts.some(c => c.id === o.contactId) && required(o.name) && required(o.product) && oneOf(o.stage, stages) && instant(o.createdAt)
      && (o.productCategory === 'legacy' || financialProducts.some(p => p.value === o.productCategory && p.label === o.product))
      && (isFinancing(o) || o.productCategory === 'legacy' || o.amount === undefined)
      && (o.amount === undefined || (typeof o.amount === 'number' && Number.isFinite(o.amount) && o.amount >= 0 && o.amount <= 1e12 && Math.abs(o.amount * 100 - Math.round(o.amount * 100)) < 0.001))
      && (isClosed(o) ? validDay(o.closedAt) && o.closedAt >= today(new Date(o.createdAt)) : o.closedAt === undefined)
      && (o.stage === 'Perdido' ? oneOf(o.lossReason, lossReasons) && (o.lossNote === undefined || text(o.lossNote)) && (o.lossReason !== 'Otro' || required(o.lossNote)) : o.lossReason === undefined && o.lossNote === undefined))) return false;
    return db.followups.every(f => db.opportunities.some(o => o.id === f.opportunityId) && oneOf(f.channel, channels) && validDay(f.date) && required(f.action)
      && oneOf(f.status, ['Pendiente', 'Realizado', 'Cancelado']) && (f.status === 'Realizado' ? required(f.result) && instant(f.completedAt) && (f.notes === undefined || text(f.notes)) : f.result === undefined && f.completedAt === undefined && f.notes === undefined))
      && db.activity.every(a => instant(a.at) && required(a.text));
  } catch { return false; }
}
export function seed(day = today(), at = new Date().toISOString()): Database {
  const contacts: Contact[] = [
    ['Ana R.', 'Bodega Los Sauces', 'Comprar mercadería', 'Referido'],
    ['Luis M.', 'Cafetería La Esquina', 'Separar sus ahorros personales del dinero del negocio', 'Redes sociales'],
    ['Rosa C.', 'Taller Buen Camino', 'Adquirir maquinaria', 'Visita'],
    ['José P.', 'Comercio Sol Andino', 'Organizar los ingresos de su negocio', 'Campaña'],
    ['Elena V.', 'Bodega El Encuentro', 'Comprar mercadería para reponer su bodega', 'Otro'],
    ['Marco T.', 'Café Patio Azul', 'Gestionar los ingresos de su cafetería', 'Referido'],
  ].map(([name, business, need, origin], i) => ({ id: uid(), name, business, phone: `000 000 00${i + 1}`, need, origin: origin as Origin, preferred: '', notes: '', createdAt: at }));
  const products = [financialProducts[0], financialProducts[2], financialProducts[1], financialProducts[3], financialProducts[0], financialProducts[3]];
  const opportunityNames = ['Financiamiento de capital de trabajo', 'Cuenta de ahorro', 'Financiamiento para equipo', 'Cuenta para gestionar ingresos', 'Capital de trabajo para reponer mercadería', 'Cuenta para ingresos del café'];
  const opportunities = stages.map((stage, i): Opportunity => ({ id: uid(), contactId: contacts[i].id,
    name: opportunityNames[i], product: products[i].label, productCategory: products[i].value,
    ...([0, 2, 4].includes(i) ? { amount: [12000, 0, 24000, 0, 8000][i] } : {}), stage, createdAt: at,
    ...(stage === 'Ganado' ? { closedAt: day } : stage === 'Perdido' ? { closedAt: day, lossReason: 'No lo necesita por ahora' as LossReason, lossNote: '' } : {}) }));
  const followups: Followup[] = [
    { id: uid(), opportunityId: opportunities[0].id, channel: 'Llamada', date: offsetDay(day, -2), action: t.confirmFinancingAction, status: 'Pendiente' },
    { id: uid(), opportunityId: opportunities[1].id, channel: 'Mensaje', date: day, action: 'Conversar sobre sus necesidades de ahorro', status: 'Pendiente' },
    { id: uid(), opportunityId: opportunities[2].id, channel: 'Visita', date: offsetDay(day, 2), action: t.confirmFinancingAction, status: 'Pendiente' },
    { id: uid(), opportunityId: opportunities[3].id, channel: 'Llamada', date: offsetDay(day, 4), action: 'Explicar información general y confirmar su interés', status: 'Pendiente' },
    { id: uid(), opportunityId: opportunities[4].id, channel: 'Mensaje', date: day, action: 'Confirmar si desea continuar con la solicitud', status: 'Realizado', result: 'Manifestó que desea continuar; el asesor registró el cierre comercial de la demo.', notes: 'No representa aprobación ni desembolso de financiamiento.', completedAt: at },
  ];
  return { version: 3, revision: uid(), contacts, opportunities, followups, activity: [] };
}
export type Command =
  | { type: 'alignActions' }
  | { type: 'contact'; value: Contact }
  | { type: 'opportunity'; value: Opportunity; pending?: 'keep' | 'cancel' }
  | { type: 'followup'; value: Followup }
  | { type: 'cancel'; id: string }
  | { type: 'complete'; id: string; result: string; notes: string; decision: 'next' | 'finish'; next?: Followup };
export function transition(db: Database, command: Command, at = new Date().toISOString()): Database {
  let next: Database = { ...db, revision: uid() }; let message = '';
  const upsert = <T extends { id: string }>(list: T[], value: T): T[] => list.some(v => v.id === value.id) ? list.map(v => v.id === value.id ? value : v) : [...list, value];
  if (command.type === 'alignActions') {
    const ids = new Set(actionCorrections(db).map(f => f.id));
    if (!ids.size) throw new Error(t.invalidRecord);
    next.followups = db.followups.map(f => ids.has(f.id) ? { ...f, action: t.confirmFinancingAction } : f);
    message = `${t.actionsAligned} (${ids.size})`;
  } else if (command.type === 'contact') {
    const old = db.contacts.find(c => c.id === command.value.id);
    next.contacts = upsert(db.contacts, { ...command.value, createdAt: old ? old.createdAt : at }); message = `${t.contactSaved} ${command.value.name}`;
  } else if (command.type === 'opportunity') {
    const value = { ...command.value }; const old = db.opportunities.find(o => o.id === value.id);
    if (value.productCategory === 'legacy' && (!old || old.productCategory !== 'legacy' || value.product !== old.product || value.amount !== old.amount)) throw new Error(t.invalidRecord);
    value.createdAt = old ? old.createdAt : at;
    if (old && old.contactId !== value.contactId) throw new Error(t.invalidRecord);
    if (isClosed(value)) {
      value.closedAt = old && old.stage === value.stage ? old.closedAt : today(new Date(at));
      const pending = db.followups.filter(f => f.opportunityId === value.id && f.status === 'Pendiente');
      if ((!old || old.stage !== value.stage) && pending.length) {
        if (!command.pending) throw new Error(t.pendingDecision);
        if (command.pending === 'cancel') next.followups = db.followups.map(f => pending.some(p => p.id === f.id) ? { ...f, status: 'Cancelado' } : f);
      }
    } else delete value.closedAt;
    if (value.stage !== 'Perdido') { delete value.lossReason; delete value.lossNote; }
    next.opportunities = upsert(db.opportunities, value);
    message = old ? old.stage !== value.stage ? `${isClosed(old) && !isClosed(value) ? t.reopened : t.stageUpdated} ${value.name}: ${old.stage} → ${value.stage}${command.pending ? ` · ${command.pending === 'cancel' ? t.cancelPending : t.keep}` : ''}` : `${t.opportunitySaved} ${value.name}` : `${t.opportunityCreated} ${value.name}`;
  } else if (command.type === 'followup') {
    const old = db.followups.find(f => f.id === command.value.id);
    if (old && (old.status !== 'Pendiente' || old.opportunityId !== command.value.opportunityId)) throw new Error(t.terminalFollowup);
    const o = db.opportunities.find(o => o.id === command.value.opportunityId);
    if (!o || (!old && isClosed(o))) throw new Error(t.closedFollowup);
    next.followups = upsert(db.followups, { ...command.value, status: 'Pendiente' });
    message = `${old ? t.followupEdited : t.followupSaved} ${command.value.action}`;
  } else {
    const f = db.followups.find(f => f.id === command.id);
    if (!f || f.status !== 'Pendiente') throw new Error(t.terminalFollowup);
    if (command.type === 'cancel') {
      next.followups = db.followups.map(v => v.id === f.id ? { ...v, status: 'Cancelado' } : v); message = `${t.followupCancelled} ${f.action}`;
    } else {
      if (!['next', 'finish'].includes(command.decision) || (command.decision === 'finish' && command.next)) throw new Error(t.nextDecision);
      next.followups = db.followups.map(v => v.id === f.id ? { ...v, status: 'Realizado', result: command.result, notes: command.notes, completedAt: at } : v);
      if (command.decision === 'next') {
        const o = db.opportunities.find(o => o.id === f.opportunityId)!;
        if (isClosed(o)) throw new Error(t.closedFollowup);
        if (!command.next || command.next.opportunityId !== f.opportunityId || command.next.date < today(new Date(at)) || command.next.status !== 'Pendiente') throw new Error(t.invalidRecord);
        next.followups = [...next.followups, command.next];
      }
      message = `${t.followupDone} ${f.action} · ${command.decision === 'next' ? t.nextYes : t.nextNo}`;
    }
  }
  next.activity = [{ id: uid(), at, text: message.slice(0, 500) }, ...db.activity];
  if (!validateDatabase(next)) throw new Error(t.invalidRecord);
  return next;
}
// Migraciones explícitas: v1 → v2 añade teléfono vacío; v2 → v3 marca productos
// anteriores sin clasificar. No interpreta precios anteriores como solicitudes.
// Conserva todos los valores; la lectura nunca escribe ni carga otra semilla.
export function decode(raw: string): Database {
  let value = JSON.parse(raw);
  if (value && value.version === 1 && Array.isArray(value.contacts)) {
    value = { ...value, version: 2, contacts: value.contacts.map((c: Partial<Contact> | null) => ({ ...c, phone: c?.phone === undefined ? '' : c.phone })) };
  }
  if (value && value.version === 2 && Array.isArray(value.opportunities)) {
    value = { ...value, version: 3, opportunities: value.opportunities.map((o: Partial<Opportunity> | null) => ({ ...o, productCategory: 'legacy' })) };
  }
  if (!validateDatabase(value)) throw new Error(t.storageInvalid);
  return value;
}
