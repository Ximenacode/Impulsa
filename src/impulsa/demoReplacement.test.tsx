import React from 'react';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './ImpulsaApp';
import { decode, seed, STORAGE_KEY, today, uid } from './model';
import { load, Session } from './persistence';
import { t } from './texts';

jest.setTimeout(120000);
const oldTitles = ['Control de inventario', 'Carta digital', 'Catálogo de servicios', 'Registro de pedidos'];
const oldWords = /Control de inventario|Carta digital|Catálogo de servicios|Registro de pedidos|catálogo anterior|inventario anterior|Producto anterior sin clasificar/;
const expectedCases = [
  ['Ana R.', 'Bodega Los Sauces', 'Comprar mercadería', 'Financiamiento de capital de trabajo', 'working_capital', 'Confirmar monto y destino del financiamiento'],
  ['Luis M.', 'Cafetería La Esquina', 'Separar sus ahorros personales del dinero del negocio', 'Cuenta de ahorro', 'savings', 'Conversar sobre sus necesidades de ahorro'],
  ['Rosa C.', 'Taller Buen Camino', 'Adquirir maquinaria', 'Financiamiento para equipo', 'equipment', 'Confirmar monto y destino del financiamiento'],
  ['José P.', 'Comercio Sol Andino', 'Organizar los ingresos de su negocio', 'Cuenta para gestionar ingresos', 'business_account', 'Explicar información general y confirmar su interés'],
];
function legacyRaw() {
  const db = seed();
  return JSON.stringify({ ...db, version: 2,
    contacts: db.contacts.map((c, i) => ({ ...c, need: oldTitles[i] || 'Consultar catálogo anterior' })),
    opportunities: db.opportunities.map(({ productCategory, ...o }, i) => ({ ...o, name: oldTitles[i] || 'Servicio de diseño anterior', product: 'Diseño de catálogo anterior', amount: 650 })),
    followups: db.followups.map(f => ({ ...f, action: 'Consultar catálogo anterior e inventario anterior', ...(f.status === 'Realizado' ? { result: 'Recibió catálogo anterior', notes: 'Historial de inventario anterior' } : {}) })),
    activity: [{ id: uid(), at: new Date().toISOString(), text: 'Actividad sobre catálogo anterior' }],
  });
}
// Un Provider independiente detecta el error de despachar a un store importado
// distinto del que está mostrando la interfaz (también relevante al recargar).
const sessionStore = (initial: Session): Store<Session> => createStore((state: Session = initial, action: { type: string; session?: Session }): Session => action.type === 'impulsa/saved' && action.session ? action.session : state);
const mount = (s: ReturnType<typeof sessionStore>) => render(<Provider store={s}><App /></Provider>);
beforeEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/'); });
const openConfirmation = () => userEvent.click(within(screen.getByRole('main')).getByRole('button', { name: t.reset }));
const confirm = () => userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.reset }));

async function checkFiveScreens() {
  userEvent.click(screen.getByRole('link', { name: t.nav[0] }));
  expect(screen.getByRole('button', { name: `${t.consult}: ${expectedCases[0][5]}` })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: `${t.consult}: ${expectedCases[1][5]}` })).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: `${t.consult}: ${expectedCases[0][5]}` }));
  expect(screen.getByRole('complementary', { name: t.nextStep })).toHaveTextContent('Comprar mercadería');
  userEvent.click(screen.getByRole('tab', { name: t.upcoming }));
  expect(screen.getByRole('button', { name: `${t.consult}: ${expectedCases[2][5]}` })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: `${t.consult}: ${expectedCases[3][5]}` })).toBeInTheDocument();
  expect(screen.getByRole('main')).not.toHaveTextContent(oldWords);

  userEvent.click(screen.getByRole('link', { name: t.nav[1] }));
  for (const [name, business, need, opportunity, , action] of expectedCases) {
    const row = screen.getByText(name).closest('tr') as HTMLElement;
    expect(row).toHaveTextContent(business);
    userEvent.click(within(row).getByRole('button', { name: t.detail }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent(need); expect(dialog).toHaveTextContent(opportunity); expect(dialog).toHaveTextContent(action);
    expect(dialog).not.toHaveTextContent(oldWords);
    userEvent.click(within(dialog).getByRole('button', { name: t.close }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  }

  userEvent.click(screen.getByRole('link', { name: t.nav[2] }));
  for (const [, , , opportunity] of expectedCases) expect(screen.getByRole('button', { name: opportunity })).toBeInTheDocument();
  expect(screen.getByRole('main')).not.toHaveTextContent(oldWords);

  userEvent.click(screen.getByRole('link', { name: t.nav[3] }));
  for (const [name, , , , , action] of expectedCases) { const card = screen.getByText(name, { exact: false }).closest('.record') as HTMLElement; expect(within(card).getByRole('button', { name: action })).toBeInTheDocument(); }
  expect(screen.getByRole('main')).not.toHaveTextContent(oldWords);

  userEvent.click(screen.getByRole('link', { name: t.nav[4] }));
  expect(screen.getByText('50 %')).toBeInTheDocument();
  expect(screen.getByText(t.won).closest('.stat')).toHaveTextContent('1');
  expect(screen.getByText(t.lost).closest('.stat')).toHaveTextContent('1');
  expect(screen.getByText(t.open).closest('.stat')).toHaveTextContent('4');
  expect(screen.getByRole('main')).not.toHaveTextContent(oldWords);
  expect(screen.queryByText(t.legacyBanner)).not.toBeInTheDocument();
}

test('carga confirmada reemplaza el grafo heredado y los cinco módulos conservan los casos tras reconstruir la sesión', async () => {
  const old = legacyRaw(); localStorage.setItem(STORAGE_KEY, old);
  const initial = load(localStorage); const store = sessionStore(initial); let view = mount(store);
  expect(screen.getByText(t.legacyBanner)).toBeInTheDocument(); expect(localStorage.getItem(STORAGE_KEY)).toBe(old);
  openConfirmation(); expect(screen.getByRole('dialog')).toHaveTextContent(t.resetWarning);
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.cancel }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(localStorage.getItem(STORAGE_KEY)).toBe(old); expect(store.getState()).toEqual(initial);
  openConfirmation(); confirm();
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  const savedRaw = localStorage.getItem(STORAGE_KEY)!; const saved = decode(savedRaw);
  expect(store.getState().db).toEqual(saved); expect(savedRaw).not.toMatch(oldWords);
  for (const [name, business, need, title, category, action] of expectedCases) {
    const c = saved.contacts.find(c => c.name === name)!; expect(c).toMatchObject({ business, need });
    const o = saved.opportunities.find(o => o.contactId === c.id)!; expect(o).toMatchObject({ name: title, productCategory: category });
    expect(saved.followups.find(f => f.opportunityId === o.id)?.action).toBe(action);
  }
  expect(saved.opportunities.every(o => o.productCategory !== 'legacy')).toBe(true);
  expect(saved.activity).toHaveLength(1); expect(saved.activity[0].text).toBe(t.demoReset);
  expect(saved.followups.find(f => f.status === 'Realizado')!.notes).toContain('No representa aprobación');
  await checkFiveScreens();
  view.unmount(); window.history.replaceState({}, '', '/');
  const restored = load(localStorage); expect(restored.db).toEqual(saved);
  view = mount(sessionStore(restored)); await checkFiveScreens();
  expect(localStorage.getItem(STORAGE_KEY)).toBe(savedRaw);
  expect(restored.db!.followups[1].date).toBe(today()); view.unmount();
});

test('un fallo de guardado muestra error en la confirmación y conserva estado, datos e historial hasta reintentar', async () => {
  const old = legacyRaw(); localStorage.setItem(STORAGE_KEY, old);
  const initial = load(localStorage); const store = sessionStore(initial); mount(store); openConfirmation();
  const failure = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  try {
    confirm(); expect(within(screen.getByRole('dialog')).getByRole('alert')).toHaveTextContent(t.demoLoadError);
    expect(store.getState()).toEqual(initial); expect(localStorage.getItem(STORAGE_KEY)).toBe(old);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  } finally { failure.mockRestore(); }
  confirm(); await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(store.getState().db!.opportunities.every(o => o.productCategory !== 'legacy')).toBe(true);
  expect(load(localStorage).db).toEqual(store.getState().db);
});
