import { Database, decode, seed, STORAGE_KEY, Command, today, transition, uid, validateDatabase } from './model';
import { t } from './texts';
export interface Session { db: Database | null; error: string; raw: string | null; migrated?: boolean }
export function browserStorage(): Storage {
  try { return window.localStorage; } catch { throw new Error(t.storageRead); }
}
export function load(storage: Storage): Session {
  let raw: string | null;
  try { raw = storage.getItem(STORAGE_KEY); } catch { return { db: null, error: t.storageRead, raw: null }; }
  if (raw !== null) {
    try { return { db: decode(raw), error: '', raw, migrated: [1, 2].includes(JSON.parse(raw).version) }; } catch { return { db: null, error: t.storageInvalid, raw }; }
  }
  const db = seed();
  try { const serialized = JSON.stringify(db); storage.setItem(STORAGE_KEY, serialized); return { db, error: '', raw: serialized }; }
  catch { return { db: null, error: t.storageWrite, raw: null }; }
}
export function persist(session: Session, command: Command, storage: Storage): Session {
  if (!session.db) throw new Error(session.error || t.storageInvalid);
  const db = transition(session.db, command);
  return save(session, db, storage);
}
export function save(session: Session, db: Database, storage: Storage): Session {
  const raw = JSON.stringify(db);
  try {
    if (storage.getItem(STORAGE_KEY) !== session.raw) throw new Error(t.storageConflict);
    storage.setItem(STORAGE_KEY, raw);
  } catch (e) { if (e instanceof Error && e.message === t.storageConflict) throw e; throw new Error(t.storageWrite); }
  return { db, error: '', raw };
}
// Solo se invoca desde la confirmación de carga. Sustituye el conjunto completo;
// no mezcla contactos, relaciones o actividad de las demostraciones anteriores.
export function replaceWithFinancialDemo(session: Session, storage: Storage, day = today(), at = new Date().toISOString()): Session {
  const db = seed(day, at);
  db.activity = [{ id: uid(), at, text: t.demoReset }];
  if (!validateDatabase(db) || db.opportunities.some(o => o.productCategory === 'legacy')) throw new Error(t.invalidRecord);
  try { return save(session, db, storage); }
  catch (e) {
    if (e instanceof Error && e.message === t.storageWrite) throw new Error(t.demoLoadError);
    throw e;
  }
}
