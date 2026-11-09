import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './ImpulsaApp';
import { store } from '../store/store';
import { load } from './persistence';
import { decode, formatDate, localDate, offsetDay, STORAGE_KEY, today } from './model';
import { t } from './texts';

jest.setTimeout(120000);

beforeEach(() => {
  localStorage.clear(); store.dispatch({ type: 'impulsa/saved', session: load(localStorage) }); window.history.replaceState({}, '', '/');
});
const mount = () => render(<Provider store={store}><App /></Provider>);
const field = (label: string, value: string) => {
  const dialog = screen.queryByRole('dialog');
  const scope = dialog ? within(dialog) : screen;
  fireEvent.change(scope.getByLabelText(new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)), { target: { value } });
};
const saveForm = async () => {
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.save }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
};

test('recorrido conectado en español: contacto, oportunidad, reprogramar, completar, siguiente acción, cierre y recarga', async () => {
  const rendered = mount();
  userEvent.click(screen.getByRole('button', { name: t.newContact }));
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.save }));
  expect(await screen.findAllByText(t.required)).toHaveLength(2);
  expect(screen.getByLabelText(/^Nombre/)).toHaveFocus();
  field(t.nameLabel, 'Carla D.'); field(t.business, 'Bodega de prueba'); field(t.phoneLabel, '000 123 456'); field(t.optionalNeed, 'Comprar mercadería');
  await saveForm();
  userEvent.click(screen.getByRole('link', { name: t.nav[1] }));
  field(t.search, 'Carla');
  userEvent.click(screen.getByRole('button', { name: t.edit }));
  field(t.business, 'Bodega de prueba editada'); await saveForm();
  expect(screen.getByText('Bodega de prueba editada')).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: t.newOpportunity }));
  expect(within(screen.getByRole('dialog')).getByLabelText(/^Contacto/)).toHaveValue(store.getState().db!.contacts.find(c => c.name === 'Carla D.')!.id);
  field(t.opportunityName, 'Capital para comprar mercadería'); field(t.product, 'working_capital'); field(t.amount, '560'); await saveForm();
  userEvent.click(screen.getByRole('link', { name: t.nav[2] }));
  field(t.search, 'Carla'); userEvent.click(screen.getByRole('button', { name: t.newFollowup }));
  field(t.action, 'Revisar el registro actual'); field(t.date, today()); await saveForm();
  userEvent.click(screen.getByRole('link', { name: t.nav[3] }));
  field(t.filterDate, today());
  const action = screen.getByRole('button', { name: 'Revisar el registro actual' });
  const card = action.closest('.record') as HTMLElement;
  userEvent.click(within(card).getByRole('button', { name: t.reschedule }));
  const nextDay = offsetDay(today(), 1); field(t.date, nextDay); await saveForm();
  expect(screen.queryByRole('button', { name: 'Revisar el registro actual' })).not.toBeInTheDocument();
  field(t.filterDate, nextDay);
  const newCard = screen.getByRole('button', { name: 'Revisar el registro actual' }).closest('.record') as HTMLElement;
  userEvent.click(within(newCard).getByRole('button', { name: t.complete }));
  field(t.result, 'Solicitó una propuesta'); field(t.nextDecision, 'next'); field(t.nextAction, 'Compartir propuesta'); field(t.nextDate, nextDay); await saveForm();
  expect(screen.getByRole('button', { name: 'Compartir propuesta' })).toBeInTheDocument();
  userEvent.click(screen.getByRole('link', { name: t.nav[2] })); field(t.search, 'Carla');
  userEvent.click(screen.getByRole('button', { name: t.changeStage })); field(t.stage, 'Ganado');
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.save }));
  expect(await screen.findByText(t.required)).toBeInTheDocument();
  field(t.pendingDecision, 'cancel'); await saveForm();
  const saved = decode(localStorage.getItem(STORAGE_KEY)!); const won = saved.opportunities.find(o => o.name === 'Capital para comprar mercadería')!;
  expect(won.stage).toBe('Ganado'); expect(won.closedAt).toBe(today());
  expect(saved.followups.filter(f => f.opportunityId === won.id).map(f => f.status)).toEqual(['Realizado', 'Cancelado']);
  userEvent.click(screen.getByRole('link', { name: t.nav[4] })); expect(screen.getByText('66.7 %')).toBeInTheDocument();
  rendered.unmount(); store.dispatch({ type: 'impulsa/saved', session: load(localStorage) }); window.history.replaceState({}, '', '/contactos'); mount();
  field(t.search, 'Carla'); expect(screen.getByText('Bodega de prueba editada')).toBeInTheDocument(); expect(screen.getByText('000 123 456')).toBeInTheDocument();
}, 120000);

test('pérdida solicita motivo y Otro requiere explicación; conserva pendientes', async () => {
  window.history.replaceState({}, '', '/oportunidades'); mount(); field(t.search, 'Ana');
  userEvent.click(screen.getByRole('button', { name: t.changeStage })); field(t.stage, 'Perdido');
  field(t.pendingDecision, 'keep'); field(t.loss, 'Otro');
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.save }));
  expect(await screen.findByText(t.required)).toBeInTheDocument();
  field(t.lossNote, 'Cambió el alcance del negocio'); await saveForm();
  expect(store.getState().db!.opportunities[0].lossNote).toBe('Cambió el alcance del negocio');
  expect(store.getState().db!.followups[0].status).toBe('Pendiente');
});
test('navegación por teclado y modal conservan foco; descartar exige decisión', async () => {
  mount(); const trigger = screen.getByRole('button', { name: t.newContact }); trigger.focus(); userEvent.click(trigger);
  await waitFor(() => expect(screen.getByLabelText(/^Nombre/)).toHaveFocus());
  userEvent.tab(); expect(screen.getByLabelText(/^Negocio/)).toHaveFocus();
  field(t.business, 'Bodega sin guardar'); userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.cancel }));
  expect(await screen.findByRole('dialog', { name: t.leaveTitle })).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: t.continueEditing }));
  await waitFor(() => expect(screen.queryByRole('dialog', { name: t.leaveTitle })).not.toBeInTheDocument());
  expect(screen.getByLabelText(/^Negocio/)).toHaveValue('Bodega sin guardar');
  userEvent.click(screen.getByRole('button', { name: t.cancel })); userEvent.click(screen.getByRole('button', { name: t.discard }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await waitFor(() => expect(trigger).toHaveFocus());
});
test('fallos de guardado conservan valores y errores visibles dentro del formulario', async () => {
  mount(); userEvent.click(screen.getByRole('button', { name: t.newContact })); field(t.nameLabel, 'Prueba S.'); field(t.business, 'Taller de prueba');
  const mock = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  try {
    userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.save }));
    expect(within(screen.getByRole('dialog')).getByRole('alert')).toHaveTextContent(t.storageWrite);
    expect(screen.getByLabelText(/^Nombre/)).toHaveValue('Prueba S.'); expect(screen.getByLabelText(/^Negocio/)).toHaveValue('Taller de prueba');
  } finally { mock.mockRestore(); }
  await saveForm(); expect(store.getState().db!.contacts.some(c => c.name === 'Prueba S.')).toBe(true);
});
test('calendario localizado abre el seguimiento y permite volver a la lista', async () => {
  window.history.replaceState({}, '', '/agenda'); mount();
  userEvent.click(screen.getByRole('tab', { name: t.calendar }));
  const month = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(localDate(today()));
  expect(screen.getByText(month)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: t.previousMonth })).toBeInTheDocument();
  const event = await screen.findByRole('button', { name: /Cafetería La Esquina: Conversar sobre sus necesidades/ });
  userEvent.click(event);
  expect(await screen.findByRole('dialog')).toHaveTextContent('Cafetería La Esquina');
  expect(within(screen.getByRole('dialog')).getByRole('button', { name: t.complete })).toBeInTheDocument();
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.close }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  userEvent.click(screen.getByRole('tab', { name: t.list })); expect(screen.getByRole('tabpanel')).toHaveTextContent('Cafetería La Esquina');
});
test('datos inválidos se mantienen hasta confirmar el restablecimiento', async () => {
  const raw = '{datos dañados'; localStorage.setItem(STORAGE_KEY, raw);
  store.dispatch({ type: 'impulsa/saved', session: load(localStorage) }); mount();
  expect(screen.getByRole('alert')).toHaveTextContent(t.storageInvalid);
  const resetButton = () => within(screen.getByRole('main')).getByRole('button', { name: t.reset });
  userEvent.click(resetButton()); expect(screen.getByRole('dialog')).toHaveTextContent(t.resetWarning);
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.cancel }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  userEvent.click(resetButton()); userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.reset }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(decode(localStorage.getItem(STORAGE_KEY)!).contacts).toHaveLength(6);
  expect(screen.getByRole('heading', { name: t.nav[0] })).toBeInTheDocument();
});
test('Kanban agrupa seis etapas y el control de cambio mueve el registro sin duplicarlo', async () => {
  window.history.replaceState({}, '', '/oportunidades'); mount();
  const board = screen.getByRole('region', { name: t.board });
  expect(within(board).getAllByRole('heading', { level: 2 })).toHaveLength(6);
  const column = within(board).getByRole('region', { name: 'Nuevo' });
  expect(within(column).getByText(t.confirmFinancingAction)).toBeInTheDocument();
  expect(within(column).getByText(formatDate(offsetDay(today(), -2)))).toBeInTheDocument();
  const id = store.getState().db!.opportunities[0].id;
  userEvent.click(within(column).getByRole('button', { name: t.changeStage }));
  field(t.stage, 'Interesado'); await saveForm();
  const destination = within(board).getByRole('region', { name: 'Interesado' });
  expect(within(destination).getByRole('button', { name: 'Financiamiento de capital de trabajo' })).toBeInTheDocument();
  expect(within(column).queryByRole('button', { name: 'Financiamiento de capital de trabajo' })).not.toBeInTheDocument();
  expect(store.getState().db!.opportunities.filter(o => o.id === id)).toHaveLength(1);
  userEvent.click(screen.getByRole('tab', { name: t.list })); field(t.stage, 'Interesado');
  expect(screen.getByRole('button', { name: 'Financiamiento de capital de trabajo' })).toBeInTheDocument();
});
test('arrastrar una tarjeta a Perdido pide revisar el cierre antes de guardar', async () => {
  window.history.replaceState({}, '', '/oportunidades'); mount();
  const id = store.getState().db!.opportunities[0].id;
  fireEvent.drop(screen.getByRole('region', { name: 'Perdido' }), { dataTransfer: { getData: () => id } });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(within(screen.getByRole('dialog')).getByLabelText(/^Etapa/)).toHaveValue('Perdido');
  expect(store.getState().db!.opportunities[0].stage).toBe('Nuevo');
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.save }));
  expect(await screen.findAllByText(t.required)).toHaveLength(2);
  field(t.loss, 'No lo necesita por ahora'); field(t.pendingDecision, 'keep'); await saveForm();
  expect(store.getState().db!.opportunities[0].stage).toBe('Perdido');
  expect(store.getState().db!.followups[0].status).toBe('Pendiente');
});
test('Mi día selecciona una fila y limpia el panel si deja de cumplir el filtro', () => {
  mount(); const f = store.getState().db!.followups[0];
  const trigger = screen.getByRole('button', { name: `${t.consult}: ${f.action}` });
  userEvent.click(trigger); expect(trigger).toHaveAttribute('aria-pressed', 'true');
  const panel = screen.getByRole('complementary', { name: t.nextStep });
  expect(panel).toHaveTextContent('Bodega Los Sauces'); expect(panel).toHaveTextContent('Financiamiento para capital de trabajo');
  expect(within(panel).getByRole('button', { name: t.registerFollowup })).toBeInTheDocument();
  field(t.search, 'no coincide con ningún negocio');
  expect(screen.getByRole('complementary', { name: t.nextStep })).toHaveTextContent(t.selectFollowup);
});
test('el número inválido muestra el error junto al campo y la ficha conserva el número guardado', async () => {
  window.history.replaceState({}, '', '/contactos'); mount(); field(t.search, 'Ana');
  userEvent.click(screen.getByRole('button', { name: t.edit })); field(t.phoneLabel, '123');
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.save }));
  expect(await screen.findByText(t.invalidPhone)).toBeInTheDocument();
  expect(screen.getByLabelText(/^Número de contacto/)).toHaveValue('123');
  field(t.phoneLabel, '000 234 567'); await saveForm();
  userEvent.click(screen.getByRole('button', { name: t.detail }));
  expect(screen.getByRole('dialog')).toHaveTextContent('000 234 567');
  expect(screen.getByRole('dialog')).toHaveTextContent(t.contactFollowups);
});
test('en móvil se ofrece lista de oportunidades y el detalle de Mi día abre en diálogo', async () => {
  const original = window.matchMedia;
  window.matchMedia = jest.fn().mockImplementation(query => ({ matches: /max-width:\s*767px/.test(query), media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn() }));
  let rendered: ReturnType<typeof mount> | undefined;
  try {
    window.history.replaceState({}, '', '/oportunidades'); rendered = mount();
    expect(screen.getByRole('tab', { name: t.list })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText(t.stage)).toBeInTheDocument();
    rendered.unmount(); rendered = undefined;
    window.history.replaceState({}, '', '/'); rendered = mount();
    const action = store.getState().db!.followups[0].action;
    userEvent.click(screen.getByRole('button', { name: `${t.consult}: ${action}` }));
    expect(screen.getByRole('dialog', { name: t.nextStep })).toHaveTextContent('Bodega Los Sauces');
    userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.close }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  } finally { rendered?.unmount(); window.matchMedia = original; }
});
test('el monto solicitado aparece para financiamiento y se elimina al elegir una cuenta', async () => {
  window.history.replaceState({}, '', '/oportunidades'); mount();
  userEvent.click(screen.getByRole('button', { name: t.newOpportunity }));
  const contactId = store.getState().db!.contacts[0].id;
  field(t.contact, contactId); field(t.opportunityName, 'Cuenta para gestionar los ingresos');
  field(t.product, 'working_capital'); field(t.amount, '15000');
  expect(screen.getByLabelText(/^Monto solicitado/)).toHaveValue(15000);
  field(t.product, 'business_account'); expect(screen.queryByLabelText(/^Monto solicitado/)).not.toBeInTheDocument();
  await saveForm();
  const saved = store.getState().db!.opportunities.find(o => o.name === 'Cuenta para gestionar los ingresos')!;
  expect(saved.productCategory).toBe('business_account'); expect(saved.amount).toBeUndefined();
  const card = screen.getByRole('button', { name: saved.name }).closest('.record') as HTMLElement;
  expect(card).not.toHaveTextContent('Monto solicitado');
  userEvent.click(within(card).getByRole('button', { name: saved.name }));
  expect(screen.getByRole('dialog')).not.toHaveTextContent('Monto solicitado');
});
test('la demo financiera se carga solo tras una confirmación y no hay definiciones extensas', async () => {
  const db = store.getState().db!;
  const old = { ...db, version: 2, opportunities: db.opportunities.map(({ productCategory, ...o }, i) => i ? o : { ...o, name: 'Carta digital', product: 'Diseño de carta', amount: 650 }) };
  const raw = JSON.stringify(old); localStorage.setItem(STORAGE_KEY, raw);
  store.dispatch({ type: 'impulsa/saved', session: load(localStorage) });
  window.history.replaceState({}, '', '/oportunidades'); mount();
  expect(screen.getByText(t.legacyBanner)).toBeInTheDocument(); expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  const card = screen.getByRole('button', { name: 'Carta digital' }).closest('.record') as HTMLElement;
  expect(card).not.toHaveTextContent('Es el menú'); expect(card).not.toHaveTextContent('650');
  const button = () => within(screen.getByRole('main')).getByRole('button', { name: t.reset });
  userEvent.click(button()); userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.cancel }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  userEvent.click(button()); userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.reset }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.queryByRole('button', { name: 'Carta digital' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Financiamiento de capital de trabajo' })).toBeInTheDocument();
  expect(store.getState().db!.opportunities.every(o => o.productCategory !== 'legacy')).toBe(true);
  userEvent.click(screen.getByRole('link', { name: t.nav[4] }));
  expect(screen.getByText('50 %')).toBeInTheDocument(); expect(screen.getByText(t.conversionHelp)).toBeInTheDocument();
  expect(screen.queryByText('Monto de oportunidades ganadas')).not.toBeInTheDocument();
});
test('revisar próximas acciones no cambia registros hasta confirmar y persiste solo la corrección elegida', async () => {
  const db = store.getState().db!;
  const previous = { ...db, followups: db.followups.map((f, i) => i === 0 ? { ...f, action: 'Consultar monto necesario y destino del financiamiento' } : f) };
  const raw = JSON.stringify(previous); localStorage.setItem(STORAGE_KEY, raw);
  store.dispatch({ type: 'impulsa/saved', session: load(localStorage) }); mount();
  expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  userEvent.click(screen.getByRole('button', { name: t.reviewActions }));
  expect(screen.getByRole('dialog')).toHaveTextContent(t.confirmFinancingAction);
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.cancel }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument()); expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  userEvent.click(screen.getByRole('button', { name: t.reviewActions }));
  userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t.alignActions }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  const updated = decode(localStorage.getItem(STORAGE_KEY)!);
  expect(updated.followups[0].action).toBe(t.confirmFinancingAction); expect(updated.contacts).toEqual(previous.contacts); expect(updated.opportunities).toEqual(previous.opportunities);
  expect(updated.followups.slice(1)).toEqual(previous.followups.slice(1)); expect(load(localStorage).db).toEqual(updated);
});
test('urgentes selecciona una acción sin escribir en el almacenamiento', () => {
  mount(); const raw = localStorage.getItem(STORAGE_KEY);
  userEvent.click(screen.getByRole('button', { name: t.showUrgent }));
  expect(screen.getByRole('complementary', { name: t.nextStep })).toHaveTextContent('Ana R.');
  expect(screen.getByRole('button', { name: t.registerFollowup })).toBeInTheDocument();
  expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
});

test('agenda semanal navega por fechas reales, abre el seguimiento y no cambia los datos guardados', () => {
  mount(); const raw = localStorage.getItem(STORAGE_KEY);
  const agenda = within(screen.getByRole('region', { name: 'Próximos contactos' }));
  expect(agenda.getByText('Cafetería La Esquina')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Oportunidades por etapa' })).toBeInTheDocument();
  userEvent.click(agenda.getByRole('button', { name: 'Semana siguiente' }));
  expect(agenda.getByText(formatDate(offsetDay(today(), 7)))).toBeInTheDocument();
  expect(agenda.getByText('No hay seguimientos pendientes para este día.')).toBeInTheDocument();
  userEvent.click(agenda.getByRole('button', { name: 'Hoy' }));
  userEvent.click(agenda.getByRole('button', { name: /Abrir seguimiento de Luis M/ }));
  expect(screen.getByRole('complementary', { name: t.nextStep })).toHaveTextContent('Cafetería La Esquina');
  expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
});
