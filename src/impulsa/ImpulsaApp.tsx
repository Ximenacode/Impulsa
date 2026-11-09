import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Switch, useLocation } from 'react-router-dom';
import { useSelector, useStore } from 'react-redux';
import { Avatar, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, ThemeProvider } from '@material-ui/core';
import WbSunnyOutlined from '@material-ui/icons/WbSunnyOutlined';
import PeopleOutline from '@material-ui/icons/PeopleOutline';
import ViewColumnOutlined from '@material-ui/icons/ViewColumnOutlined';
import EventNoteOutlined from '@material-ui/icons/EventNoteOutlined';
import BarChartOutlined from '@material-ui/icons/BarChartOutlined';
import TrendingUp from '@material-ui/icons/TrendingUp';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Replay from '@material-ui/icons/Replay';
import { browserStorage, persist, replaceWithFinancialDemo, Session } from './persistence';
import { actionCorrections, Command, STORAGE_KEY, today } from './model';
import { Modal, WorkspaceContext } from './context';
import { t } from './texts';
import { Agenda, Contacts, MyDay, Opportunities, Results } from './Pages';
import RecordForms from './RecordForms';
import { Details } from './Records';
import './impulsa.css';
import { theme } from './theme';

const paths = ['/', '/contactos', '/oportunidades', '/agenda', '/resultados'];
const navIcons = [WbSunnyOutlined, PeopleOutline, ViewColumnOutlined, EventNoteOutlined, BarChartOutlined];
function FocusPage() { const location = useLocation(); useEffect(() => { document.getElementById('main')?.focus(); }, [location.pathname]); return null; }
export default function ImpulsaApp() {
  const sessionStore = useStore<Session>();
  const session = useSelector((state: Session) => state);
  const corrections = session.db ? actionCorrections(session.db) : [];
  const [modal, setModal] = useState<Modal | null>(null); const [notice, setNotice] = useState(''); const [error, setError] = useState(''); const [day, setDay] = useState(today());
  const returnFocus = useRef<HTMLElement | null>(null);
  const open = (m: Modal) => { if (!modal) returnFocus.current = document.activeElement as HTMLElement; setModal(m); };
  const close = () => { setModal(null); setTimeout(() => { if (returnFocus.current?.isConnected) returnFocus.current.focus(); else document.getElementById('main')?.focus(); }, 0); };
  useEffect(() => {
    const refreshDay = () => setDay(today()); const timer = window.setInterval(refreshDay, 60000);
    const changed = (e: StorageEvent) => { if (e.key === STORAGE_KEY || e.key === null) setError(t.storageConflict); };
    window.addEventListener('storage', changed); window.addEventListener('focus', refreshDay);
    return () => { window.clearInterval(timer); window.removeEventListener('storage', changed); window.removeEventListener('focus', refreshDay); };
  }, []);
  const commit = (command: Command, success: string) => {
    try { sessionStore.dispatch({ type: 'impulsa/saved', session: persist(sessionStore.getState(), command, browserStorage()) }); setError(''); setNotice(success); return true; }
    catch (e) { setError(e instanceof Error ? e.message : t.storageWrite); return false; }
  };
  const reset = () => {
    setNotice('');
    try { const updated = replaceWithFinancialDemo(sessionStore.getState(), browserStorage()); sessionStore.dispatch({ type: 'impulsa/saved', session: updated }); setError(''); setNotice(t.demoReset); close(); }
    catch (e) { setError(e instanceof Error ? e.message : t.storageWrite); }
  };
  const resetDialog = modal?.kind === 'reset' && <Dialog open onClose={close} aria-labelledby="reset-title"><DialogTitle id="reset-title">{t.resetTitle}</DialogTitle><DialogContent><p>{t.resetWarning}</p>{error && <p role="alert" className="error">{error}</p>}</DialogContent><DialogActions><Button autoFocus onClick={close}>{t.cancel}</Button><Button onClick={reset} color="primary">{t.reset}</Button></DialogActions></Dialog>;
  return <ThemeProvider theme={theme}><CssBaseline /><BrowserRouter><FocusPage />
    <a className="skip-link" href="#main">{t.skip}</a>
    <div className="app-shell"><aside className="sidebar">
      <Link to="/" className="brand"><span className="brand-symbol"><TrendingUp aria-hidden="true" /></span>{t.name}</Link>
      <p className="sidebar-caption">{t.workspaceLabel}</p>
      <nav aria-label={t.name}>{paths.map((path, i) => { const Icon = navIcons[i]; return <NavLink exact to={path} key={path} activeClassName="active"><Icon aria-hidden="true" /><span>{t.nav[i]}</span></NavLink>; })}</nav>
      <div className="sidebar-bottom"><Button className="reset-link" startIcon={<Replay />} onClick={() => open({ kind: 'reset' })}>{t.reset}</Button>
      <div className="advisor"><Avatar>AD</Avatar><div><span>{t.advisor}</span><small>{t.profileRole}</small></div></div></div>
    </aside><div className="workspace"><header className="app-header"><span>{t.description}</span><Button className="demo-badge" size="small" startIcon={<InfoOutlined />} onClick={() => open({ kind: 'demo' })} aria-label={t.demoExplanation}>{t.demo}</Button></header><main id="main" tabIndex={-1}>
      {(error || session.error) && <div className="error storage-error" role="alert">{error || session.error}</div>}
      {session.migrated && !session.db?.opportunities.some(o => o.productCategory === 'legacy') && <p className="info-banner" role="status">{t.migrated}</p>}
      {session.db?.opportunities.some(o => o.productCategory === 'legacy') && <div className="info-banner"><p>{t.legacyBanner}</p><Button onClick={() => open({ kind: 'reset' })}>{t.reset}</Button></div>}
      {!!corrections.length && <div className="info-banner action-review"><span>{t.alignNotice} ({corrections.length})</span><Button onClick={() => open({ kind: 'alignActions' })}>{t.reviewActions}</Button></div>}
      {session.db ? <WorkspaceContext.Provider value={{ db: session.db, day, open, commit }}>
        <Switch><Route exact path="/" component={MyDay} /><Route path="/contactos" component={Contacts} /><Route path="/oportunidades" component={Opportunities} /><Route path="/agenda" component={Agenda} /><Route path="/resultados" component={Results} /><Route><h1>{t.unknownPage}</h1><Link to="/">{t.home}</Link></Route></Switch>
        {modal && ['contact', 'opportunity', 'followup', 'complete'].includes(modal.kind) && <RecordForms key={`${modal.kind}-${modal.id || modal.contactId || modal.opportunityId || 'new'}`} modal={modal} close={close} errorMessage={error} />}
        {modal && ['contactDetail', 'opportunityDetail', 'followupDetail'].includes(modal.kind) && <Details modal={modal} close={close} />}
        {modal?.kind === 'cancel' && <Dialog open onClose={close} aria-labelledby="cancel-title"><DialogTitle id="cancel-title">{t.cancelQuestion}</DialogTitle><DialogContent><p>{session.db.followups.find(f => f.id === modal.id)?.action}</p><p>{t.cancelHelp}</p>{error && <p role="alert" className="error">{error}</p>}</DialogContent><DialogActions><Button autoFocus onClick={close}>{t.close}</Button><Button onClick={() => { if (commit({ type: 'cancel', id: modal.id! }, t.followupCancelled)) close(); }}>{t.cancelFollowup}</Button></DialogActions></Dialog>}
      </WorkspaceContext.Provider> : <><h1>{t.name}</h1><p>{session.error}</p><Button variant="contained" color="primary" onClick={() => open({ kind: 'reset' })}>{t.reset}</Button></>}
      <footer><a href="https://github.com/mihailnesterov/crm-with-leads" target="_blank" rel="noreferrer">{t.footer}</a></footer>
    </main></div></div>{resetDialog}
    {modal?.kind === 'alignActions' && <Dialog open onClose={close} fullWidth maxWidth="sm" aria-labelledby="align-title"><DialogTitle id="align-title">{t.alignTitle}</DialogTitle><DialogContent><p>{t.alignHelp}</p>{corrections.map(f => {
      const o = session.db!.opportunities.find(o => o.id === f.opportunityId)!; const c = session.db!.contacts.find(c => c.id === o.contactId)!;
      return <section className="action-comparison" key={f.id}><h3>{c.name} · {c.business}</h3><p><strong>{t.before}:</strong> {f.action}</p><p><strong>{t.after}:</strong> {t.confirmFinancingAction}</p></section>;
    })}{error && <p role="alert" className="error">{error}</p>}</DialogContent><DialogActions><Button autoFocus onClick={close}>{t.cancel}</Button><Button color="primary" variant="contained" onClick={() => { if (commit({ type: 'alignActions' }, t.actionsAligned)) close(); }}>{t.alignActions}</Button></DialogActions></Dialog>}
    {modal?.kind === 'demo' && <Dialog open onClose={close} aria-labelledby="demo-title"><DialogTitle id="demo-title">{t.demoExplanation}</DialogTitle><DialogContent><p>{t.demoInfo}</p><p>{t.advisor} · {t.profileRole}</p></DialogContent><DialogActions><Button onClick={() => open({ kind: 'reset' })}>{t.reset}</Button><Button autoFocus color="primary" onClick={close}>{t.close}</Button></DialogActions></Dialog>}
    <Snackbar open={!!notice} message={notice} autoHideDuration={6000} onClose={(_, reason) => { if (reason !== 'clickaway') setNotice(''); }} action={<Button color="inherit" onClick={() => setNotice('')} aria-label={t.notificationClose}>{t.close}</Button>} />
  </BrowserRouter></ThemeProvider>;
}
