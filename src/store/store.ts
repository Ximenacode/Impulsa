import { createStore } from 'redux';
import { load, Session } from '../impulsa/persistence';
import { t } from '../impulsa/texts';
let initial: Session;
try { initial = load(window.localStorage); }
catch { initial = { db: null, error: t.storageRead, raw: null }; }
export const store = createStore((state: Session = initial, action: { type: string; session?: Session }): Session =>
  action.type === 'impulsa/saved' && action.session ? action.session : state);
