import { actionCorrections, classify, dailyList, decode, financingAction, formatDate, formatInstant, isFinancing, offsetDay, results, seed, STORAGE_KEY, today, transition, uid, validateDatabase, validDay, validPhone, Followup } from './model';
import { load, persist, save } from './persistence';
import { t } from './texts';
const DAY = '2026-11-08'; const AT = '2026-11-08T15:00:00.000Z';
const sample = () => seed(DAY, AT);
beforeEach(() => localStorage.clear());

test('conversión usa solo oportunidades cerradas y agrupa valores reales', () => {
  const db = sample(); const r = results(db);
  expect(r.conversion).toBe(50); expect(r.won).toBe(1); expect(r.lost).toBe(1);
  expect(r.origins.reduce((s, v) => s + v.value, 0)).toBe(db.contacts.length);
  expect(r.wonOrigins.find(v => v.label === 'Otro')?.value).toBe(1);
  expect(results({ ...db, opportunities: db.opportunities.filter(o => !['Ganado', 'Perdido'].includes(o.stage)) }).conversion).toBeNull();
});
test('fechas del negocio siguen Perú incluso cerca de medianoche UTC', () => {
  expect(today(new Date('2026-11-09T02:00:00Z'))).toBe(DAY);
  expect(today(new Date('2026-11-09T06:00:00Z'))).toBe('2026-11-09');
  expect(offsetDay('2026-12-31', 1)).toBe('2027-01-01');
  expect(validDay('2026-02-30')).toBe(false); expect(validDay('2028-02-29')).toBe(true);
});
test('clasifica pendientes, conserva realizados y ordena listas con búsqueda', () => {
  const db = sample(); expect(classify(db.followups[0], DAY)).toBe('Vencido');
  expect(classify(db.followups[1], DAY)).toBe('Para hoy'); expect(classify(db.followups[2], DAY)).toBe('Próximo');
  expect(classify(db.followups[4], '2027-01-01')).toBe('Realizado');
  expect(dailyList(db, t.pending, '', DAY).map(f => f.date)).toEqual(['2026-11-06', DAY]);
  expect(dailyList(db, t.upcoming, '', DAY).map(f => f.date)).toEqual(['2026-11-10', '2026-11-12']);
  expect(dailyList(db, t.pending, 'CAFETERIA', DAY)).toHaveLength(1);
});
test('crear y editar contacto conserva identidad y creación; acepta varias oportunidades', () => {
  let db = sample(); const value = { ...db.contacts[0], id: uid(), name: 'Carla D.', createdAt: AT };
  db = transition(db, { type: 'contact', value }, AT);
  db = transition(db, { type: 'contact', value: { ...value, business: 'Bodega Prueba', createdAt: '2000-01-01T00:00:00Z' } }, AT);
  expect(db.contacts.find(c => c.id === value.id)?.createdAt).toBe(AT);
  const o = { ...db.opportunities[0], id: uid(), contactId: value.id };
  db = transition(db, { type: 'opportunity', value: o }, AT);
  db = transition(db, { type: 'opportunity', value: { ...o, id: uid() } }, AT);
  expect(db.opportunities.filter(o => o.contactId === value.id)).toHaveLength(2);
});
test('cerrar exige decidir pendientes, cancelar los conserva y reabrir limpia el cierre', () => {
  let db = sample(); const o = db.opportunities[0];
  expect(() => transition(db, { type: 'opportunity', value: { ...o, stage: 'Ganado' } }, AT)).toThrow(t.pendingDecision);
  db = transition(db, { type: 'opportunity', value: { ...o, stage: 'Ganado' }, pending: 'cancel' }, AT);
  expect(db.opportunities[0].closedAt).toBe(DAY); expect(db.followups[0].status).toBe('Cancelado');
  expect(db.followups).toHaveLength(5); expect(results(db).conversion).toBeCloseTo(200 / 3);
  db = transition(db, { type: 'opportunity', value: { ...db.opportunities[0], stage: 'Interesado' } }, AT);
  expect(db.opportunities[0].closedAt).toBeUndefined(); expect(db.activity[0].text).toContain(t.reopened);
  expect(db.followups[0].status).toBe('Cancelado');
});
test('pérdida requiere motivo y explicación para Otro; permite mantener pendientes', () => {
  let db = sample(); const o = db.opportunities[0];
  expect(() => transition(db, { type: 'opportunity', value: { ...o, stage: 'Perdido' }, pending: 'keep' }, AT)).toThrow();
  expect(() => transition(db, { type: 'opportunity', value: { ...o, stage: 'Perdido', lossReason: 'Otro' }, pending: 'keep' }, AT)).toThrow();
  db = transition(db, { type: 'opportunity', value: { ...o, stage: 'Perdido', lossReason: 'Otro', lossNote: 'Cambió su prioridad' }, pending: 'keep' }, AT);
  expect(db.followups[0].status).toBe('Pendiente'); expect(results(db).losses.find(r => r.label === 'Otro')?.value).toBe(1);
  db = transition(db, { type: 'opportunity', value: { ...db.opportunities[0], stage: 'Nuevo' } }, AT);
  expect(db.opportunities[0].lossReason).toBeUndefined(); expect(db.opportunities[0].lossNote).toBeUndefined();
});
test('completar y programar próxima acción es atómico; impide completar dos veces', () => {
  let db = sample(); const f = db.followups[0];
  const next: Followup = { id: uid(), opportunityId: f.opportunityId, channel: 'Mensaje', date: offsetDay(DAY, 1), action: 'Compartir propuesta', status: 'Pendiente' };
  expect(() => transition(db, { type: 'complete', id: f.id, result: '', notes: '', decision: 'next', next }, AT)).toThrow();
  expect(db.followups[0].status).toBe('Pendiente');
  db = transition(db, { type: 'complete', id: f.id, result: 'Pidió una propuesta', notes: 'Enviar mañana', decision: 'next', next }, AT);
  expect(db.followups[0]).toMatchObject({ status: 'Realizado', result: 'Pidió una propuesta', completedAt: AT });
  expect(db.followups[5]).toEqual(next);
  expect(() => transition(db, { type: 'complete', id: f.id, result: 'Otra vez', notes: '', decision: 'finish' }, AT)).toThrow(t.terminalFollowup);
  expect(dailyList(db, t.completed, '', DAY)[0].completedAt).toBe(AT);
});
test('reprograma sin duplicar, cancela sin eliminar y rechaza siguientes acciones pasadas', () => {
  let db = sample(); const f = db.followups[1];
  db = transition(db, { type: 'followup', value: { ...f, date: '2026-11-20' } }, AT);
  expect(db.followups).toHaveLength(5); expect(db.followups[1].date).toBe('2026-11-20');
  expect(() => transition(db, { type: 'complete', id: f.id, result: 'Resultado', notes: '', decision: 'next', next: { ...f, id: uid(), date: '2026-11-07' } }, AT)).toThrow();
  db = transition(db, { type: 'cancel', id: f.id }, AT); expect(db.followups[1].status).toBe('Cancelado');
  expect(() => transition(db, { type: 'followup', value: f }, AT)).toThrow();
});
test('cerradas no admiten nuevos seguimientos pero los mantenidos se pueden resolver', () => {
  let db = sample(); const o = db.opportunities[0]; const f = db.followups[0];
  db = transition(db, { type: 'opportunity', value: { ...o, stage: 'Ganado' }, pending: 'keep' }, AT);
  expect(() => transition(db, { type: 'followup', value: { ...f, id: uid() } }, AT)).toThrow(t.closedFollowup);
  db = transition(db, { type: 'complete', id: f.id, result: 'Entrega confirmada', notes: '', decision: 'finish' }, AT);
  expect(db.followups[0].status).toBe('Realizado');
});
test('la semilla es válida, tiene fechas relativas y no simula actividad', () => {
  const db = sample(); expect(validateDatabase(db)).toBe(true); expect(db.activity).toEqual([]);
  expect(new Set([...db.contacts, ...db.opportunities, ...db.followups].map(v => v.id)).size).toBe(17);
});
test('validación bloquea duplicados, relaciones rotas, montos inválidos y versiones futuras', () => {
  const db = sample();
  expect(validateDatabase({ ...db, version: 99 })).toBe(false);
  expect(validateDatabase({ ...db, contacts: [...db.contacts, db.contacts[0]] })).toBe(false);
  expect(validateDatabase({ ...db, opportunities: [{ ...db.opportunities[0], contactId: 'no-existe' }] })).toBe(false);
  expect(validateDatabase({ ...db, opportunities: [{ ...db.opportunities[0], amount: -1 }] })).toBe(false);
  expect(validateDatabase({ ...db, followups: [{ ...db.followups[0], date: '2026-02-30' }] })).toBe(false);
  expect(() => decode('{')).toThrow();
});
test('persistencia conserva cambios y semilla entre cargas', () => {
  let session = load(localStorage); const first = session.db!;
  session = persist(session, { type: 'contact', value: { ...first.contacts[0], business: 'Bodega Persistente' } }, localStorage);
  const restored = load(localStorage);
  expect(restored.db).toEqual(session.db); expect(restored.db?.contacts[0].business).toBe('Bodega Persistente');
  expect(restored.db?.followups[0].date).toBe(first.followups[0].date);
});
test.each(['{', JSON.stringify({ version: 9 }), 'null'])('datos inválidos no se sobrescriben: %s', raw => {
  localStorage.setItem(STORAGE_KEY, raw); const session = load(localStorage);
  expect(session.db).toBeNull(); expect(session.error).toBe(t.storageInvalid); expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  const reset = save(session, sample(), localStorage); expect(validateDatabase(reset.db)).toBe(true);
});
test('fallo de cuota preserva el estado y cambios de otra pestaña no se pisan', () => {
  const session = load(localStorage); const raw = localStorage.getItem(STORAGE_KEY);
  const broken = { getItem: () => raw, setItem: () => { throw new Error('quota'); } } as unknown as Storage;
  expect(() => persist(session, { type: 'contact', value: { ...session.db!.contacts[0], name: 'Cambio' } }, broken)).toThrow(t.storageWrite);
  expect(session.db!.contacts[0].name).not.toBe('Cambio'); expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sample()));
  expect(() => persist(session, { type: 'cancel', id: session.db!.followups[0].id }, localStorage)).toThrow(t.storageConflict);
});
test('la carga informa fallos de lectura y de escritura inicial', () => {
  const blocked = { getItem: () => { throw new Error('denied'); } } as unknown as Storage;
  expect(load(blocked)).toMatchObject({ db: null, error: t.storageRead });
  const full = { getItem: () => null, setItem: () => { throw new Error('quota'); } } as unknown as Storage;
  expect(load(full)).toMatchObject({ db: null, error: t.storageWrite });
});
test('migración v1 → v3 conserva todos los registros y no escribe hasta una acción explícita', () => {
  const current = sample();
  const legacy = { ...current, version: 1, contacts: current.contacts.map(({ phone, ...c }) => c), opportunities: current.opportunities.map(({ productCategory, ...o }) => o) };
  const raw = JSON.stringify(legacy); localStorage.setItem(STORAGE_KEY, raw);
  const session = load(localStorage);
  expect(session.migrated).toBe(true); expect(session.db!.version).toBe(3);
  expect(session.db!.contacts.map(c => c.phone)).toEqual(Array(6).fill(''));
  expect(session.db!.opportunities.map(({ productCategory, ...o }) => o)).toEqual(legacy.opportunities);
  expect(session.db!.opportunities.every(o => o.productCategory === 'legacy')).toBe(true);
  expect(session.db!.followups).toEqual(legacy.followups); expect(session.db!.activity).toEqual(legacy.activity);
  expect(session.db!.contacts.map(({ phone, ...c }) => c)).toEqual(legacy.contacts);
  expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  const saved = persist(session, { type: 'contact', value: { ...session.db!.contacts[0], phone: '000 123 456' } }, localStorage);
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).version).toBe(3);
  expect(load(localStorage).db).toEqual(saved.db);
});
test('teléfono es opcional, admite formato internacional y bloquea texto inválido sin sustituir registros', () => {
  expect(validPhone('')).toBe(true); expect(validPhone('+51 (000) 123-456')).toBe(true);
  expect(validPhone('123')).toBe(false); expect(validPhone('llámame')).toBe(false); expect(validPhone('+1234567890123456')).toBe(false);
  const db = sample(); const raw = JSON.stringify({ ...db, contacts: db.contacts.map((c, i) => i ? c : { ...c, phone: 'inválido' }) });
  localStorage.setItem(STORAGE_KEY, raw); expect(load(localStorage).db).toBeNull(); expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
});
test('demostración financiera separa productos y solo financiamientos tienen monto solicitado', () => {
  const db = sample(); expect(validateDatabase(db)).toBe(true);
  expect(new Set(db.opportunities.map(o => o.productCategory)).size).toBe(4);
  expect(db.opportunities.filter(isFinancing).every(o => typeof o.amount === 'number')).toBe(true);
  expect(db.opportunities.filter(o => !isFinancing(o)).every(o => o.amount === undefined)).toBe(true);
  expect(results(db)).toMatchObject({ won: 1, lost: 1, open: 4, conversion: 50 });
  expect(results(db)).not.toHaveProperty('amount');
  const account = db.opportunities.find(o => o.productCategory === 'savings')!;
  expect(() => transition(db, { type: 'opportunity', value: { ...account, amount: 300 } }, AT)).toThrow(t.invalidRecord);
  expect(db.opportunities.find(o => o.stage === 'Ganado')).not.toHaveProperty('approvedAt');
});
test('v2 se conserva sin convertir un precio antiguo en monto solicitado', () => {
  const db = sample(); const legacy = { ...db, version: 2, opportunities: db.opportunities.map(({ productCategory, ...o }, i) => i ? o : { ...o, name: 'Carta digital', product: 'Diseño de carta', amount: 650 }) };
  const raw = JSON.stringify(legacy); localStorage.setItem(STORAGE_KEY, raw);
  const session = load(localStorage); const o = session.db!.opportunities[0];
  expect(o).toMatchObject({ name: 'Carta digital', product: 'Diseño de carta', amount: 650, productCategory: 'legacy' });
  expect(isFinancing(o)).toBe(false); expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  expect(results(session.db!).conversion).toBe(50);
  const saved = persist(session, { type: 'contact', value: { ...session.db!.contacts[0], name: 'Nombre editado' } }, localStorage);
  expect(saved.db!.opportunities[0]).toEqual(o);
  expect(() => transition(saved.db!, { type: 'opportunity', value: { ...o, id: uid() } }, AT)).toThrow();
});
test('fechas usan día y mes en español, solo con la inicial del día en mayúscula', () => {
  expect(formatDate(DAY)).toBe('Domingo, 8 de noviembre de 2026');
  expect(formatInstant('2026-11-09T02:00:00.000Z')).toBe('Domingo, 8 de noviembre de 2026 · 21:00');
});
test('un monto registrado sugiere confirmar; la corrección explícita conserva fechas, contactos, oportunidades y acciones propias', () => {
  const db = sample(); db.followups[0].action = 'Consultar monto necesario y destino del financiamiento';
  db.followups[2].action = 'Conocer el equipo que necesita y el monto solicitado';
  expect(financingAction(db.opportunities[0])).toBe(t.confirmFinancingAction);
  expect(financingAction({ ...db.opportunities[0], amount: undefined })).toBeUndefined();
  expect(financingAction(db.opportunities[1])).toBeUndefined();
  expect(actionCorrections(db)).toHaveLength(2);
  const original = JSON.parse(JSON.stringify(db));
  const next = transition(db, { type: 'alignActions' }, AT);
  expect(db).toEqual(original); expect(next.contacts).toEqual(db.contacts); expect(next.opportunities).toEqual(db.opportunities);
  expect(next.followups.map(f => ({ ...f, action: '' }))).toEqual(db.followups.map(f => ({ ...f, action: '' })));
  expect(next.followups[0].action).toBe(t.confirmFinancingAction); expect(next.followups[2].action).toBe(t.confirmFinancingAction);
  expect(next.followups[1]).toEqual(db.followups[1]); expect(next.followups[4]).toEqual(db.followups[4]);
  const personal = { ...db, followups: db.followups.map(f => ({ ...f, action: 'Revisar las dudas que anotó el cliente' })) };
  expect(actionCorrections(personal)).toHaveLength(0);
});
