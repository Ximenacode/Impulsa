import React, { useEffect, useState } from 'react';
import { Avatar, Button, Paper, Tab, Tabs, TextField, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Search from '@material-ui/icons/Search';
import ViewColumnOutlined from '@material-ui/icons/ViewColumnOutlined';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import TodayOutlined from '@material-ui/icons/TodayOutlined';
import WarningOutlined from '@material-ui/icons/WarningOutlined';
import BusinessCenterOutlined from '@material-ui/icons/BusinessCenterOutlined';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import { useWorkspace } from './context';
import { classify, dailyList, formatDate, formatInstant, isClosed, normalize, results } from './model';
import { origins, stages, t } from './texts';
import { FollowupCard, OpportunityCard } from './Records';
import Calendar from './Calendar';
import Kanban from './Kanban';
import NextStep from './NextStep';
import DayAgenda from './DayAgenda';

export function Heading({ title, children }: { title: string; children?: React.ReactNode }) { return <div className="page-heading"><h1>{title}</h1><div className="actions">{children}</div></div>; }
export function Stat({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) { return <Paper variant="outlined" className="stat"><div className="stat-icon" aria-hidden="true">{icon || <BusinessCenterOutlined />}</div><div className="stat-body"><strong>{typeof value === 'number' ? new Intl.NumberFormat('es-PE').format(value) : value}</strong><span>{label}</span></div></Paper>; }
export function MyDay() {
  const { db, day, open } = useWorkspace(); const [tab, setTab] = useState(t.pending); const [q, setQ] = useState('');
  const list = dailyList(db, tab, q, day);
  const [selected, setSelected] = useState<string | null>(null);
  const mobile = useMediaQuery('(max-width: 767px)');
  const selectedFollowup = list.find(f => f.id === selected);
  useEffect(() => { if (selected && !list.some(f => f.id === selected)) setSelected(null); }, [list, selected]);
  const due = db.followups.filter(f => f.status === 'Pendiente' && f.date <= day).length;
  const overdue = db.followups.filter(f => f.status === 'Pendiente' && f.date < day).sort((a, b) => a.date.localeCompare(b.date));
  const selectItem = (f: typeof list[number]) => { setQ(''); setTab(f.date > day ? t.upcoming : t.pending); setSelected(f.id); };
  return <><p className="current-date"><TodayOutlined aria-hidden="true" /><time dateTime={day}>{formatDate(day)}</time></p>
    <Heading title={t.nav[0]}><Button color="primary" variant="contained" startIcon={<Add />} onClick={() => open({ kind: 'contact' })}>{t.newContact}</Button></Heading>
    <p className="page-description">{due} {due === 1 ? t.pendingSummarySingle : t.pendingSummary}</p>
    <div className="stats day-stats"><Stat icon={<TodayOutlined />} label={t.today} value={db.followups.filter(f => f.status === 'Pendiente' && f.date === day).length} /><Stat icon={<WarningOutlined />} label={t.overdue} value={overdue.length} /><Stat icon={<BusinessCenterOutlined />} label={t.open} value={db.opportunities.filter(o => !isClosed(o)).length} /></div>
    <section className={`urgent-strip ${overdue.length ? 'has-overdue' : ''}`} aria-label={t.urgent}><WarningOutlined aria-hidden="true" /><div><h2>{t.urgent}</h2><p>{overdue.length ? `${overdue.length} ${overdue.length === 1 ? t.urgentOverdueSingle : t.urgentOverdue}` : t.urgentClear}</p></div>{!!overdue.length && <Button onClick={() => selectItem(overdue[0])} endIcon={<ArrowForward />}>{t.showUrgent}</Button>}</section>
    <div className="day-layout"><section className="daily-list panel" aria-label={t.followups}><div className="section-heading"><h2>{tab === t.upcoming ? 'Próximos seguimientos' : tab === t.completed ? 'Seguimientos realizados' : 'Prioridades de hoy'}</h2><span>{list.length}</span></div><Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" aria-label={t.followups}>
      {[t.pending, t.upcoming, t.completed].map(label => <Tab key={label} value={label} label={label} id={`tab-${label}`} aria-controls="daily-panel" />)}
    </Tabs><div className="filters"><TextField id="record-search" label={t.search} value={q} onChange={e => setQ(e.target.value)} variant="outlined" size="small" InputProps={{ startAdornment: <Search className="search-icon" aria-hidden="true" /> }} /></div>
      <div className="daily-table-heading" aria-hidden="true"><span>Contacto</span><span>Negocio</span><span>Siguiente acción</span><span>Vencimiento</span><span /></div>
      <div id="daily-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>{list.length ? list.map(f => {
        const o = db.opportunities.find(o => o.id === f.opportunityId)!; const c = db.contacts.find(c => c.id === o.contactId)!;
        return <article key={f.id} className={`daily-row ${selected === f.id ? 'selected' : ''}`}><div className="daily-identity"><Avatar className="contact-avatar">{c.name.split(' ').map(n => n[0]).join('')}</Avatar><strong>{c.name}</strong></div>
          <span className="daily-business">{c.business}</span><p className="daily-action">{f.action}</p><div className="daily-due"><span className={`due-tag ${classify(f, day) === 'Vencido' ? 'due-overdue' : ''}`}>{classify(f, day)}</span><time dateTime={f.date}>{formatDate(f.date)}</time></div>
          <Button aria-pressed={selected === f.id} aria-controls={mobile ? undefined : 'next-step-panel'} aria-haspopup={mobile ? 'dialog' : undefined} onClick={() => setSelected(f.id)} endIcon={<ArrowForward />} aria-label={`${t.consult}: ${f.action}`}>{t.consult}</Button></article>;
      }) : <p className="empty">{t.empty}</p>}</div></section>{!mobile && <div id="next-step-panel"><NextStep followup={selectedFollowup} /></div>}</div>
    {mobile && <Dialog open={!!selectedFollowup} onClose={() => setSelected(null)} fullWidth aria-labelledby="next-step-title"><DialogTitle id="next-step-title">{t.nextStep}</DialogTitle><DialogContent><NextStep followup={selectedFollowup} /></DialogContent><DialogActions><Button onClick={() => setSelected(null)}>{t.close}</Button></DialogActions></Dialog>}
    <div className="day-bottom"><DayAgenda onSelect={selectItem} /><section className="activity panel"><div className="section-heading"><h2>{t.recent}</h2><CheckCircleOutline aria-hidden="true" /></div>{db.activity.length ? <ol>{db.activity.slice(0, 12).map(a => <li key={a.id}><p>{a.text}</p><time dateTime={a.at}>{formatInstant(a.at)}</time></li>)}</ol> : <p className="activity-empty">{t.noActivity}</p>}</section></div>
  </>;
}
export function Contacts() {
  const { db, open } = useWorkspace(); const [q, setQ] = useState(''); const [origin, setOrigin] = useState('');
  const list = db.contacts.filter(c => normalize(`${c.name} ${c.business}`).includes(normalize(q)) && (!origin || c.origin === origin));
  return <><Heading title={t.nav[1]}><Button color="primary" variant="contained" startIcon={<Add />} onClick={() => open({ kind: 'contact' })}>{t.newContact}</Button></Heading><p className="page-description">{t.contactsDescription}</p>
    <div className="filters"><TextField id="record-search" label={t.search} value={q} onChange={e => setQ(e.target.value)} variant="outlined" size="small" />
      <TextField id="origin-filter" select SelectProps={{ native: true }} label={t.origin} InputLabelProps={{ shrink: true }} value={origin} onChange={e => setOrigin(e.target.value)} variant="outlined" size="small"><option value="">{t.allOrigins}</option>{origins.map(o => <option key={o}>{o}</option>)}</TextField></div>
    <p className="result-count" aria-live="polite">{t.nav[1]}: {list.length}</p>
    {list.length ? <TableContainer component={Paper} variant="outlined" className="contacts-table"><Table aria-label={t.nav[1]}><TableHead><TableRow>
      {[t.contactIdentity, t.phone, t.origin, t.contactOpportunities, t.tableActions].map(label => <TableCell component="th" scope="col" key={label}>{label}</TableCell>)}</TableRow></TableHead><TableBody>
      {list.map(c => <TableRow key={c.id}><TableCell component="th" scope="row"><div className="contact-name"><Avatar>{c.name.split(' ').map(w => w[0]).join('')}</Avatar><div><strong>{c.name}</strong><p>{c.business}</p></div></div></TableCell>
        <TableCell data-label={t.phone}><span className="phone-value">{c.phone || t.noPhone}</span></TableCell><TableCell data-label={t.origin}>{c.origin}</TableCell><TableCell data-label={t.contactOpportunities}>{db.opportunities.filter(o => o.contactId === c.id).length}</TableCell>
        <TableCell><div className="actions"><Button color="primary" onClick={() => open({ kind: 'contactDetail', id: c.id })}>{t.detail}</Button><Button onClick={() => open({ kind: 'contact', id: c.id })}>{t.edit}</Button><Button onClick={() => open({ kind: 'opportunity', contactId: c.id })}>{t.newOpportunity}</Button></div></TableCell></TableRow>)}
    </TableBody></Table></TableContainer> : <p className="empty">{t.empty}</p>}
  </>;
}
export function Opportunities() {
  const { db, open } = useWorkspace(); const [stage, setStage] = useState(''); const [q, setQ] = useState('');
  const mobile = useMediaQuery('(max-width: 767px)'); const [view, setView] = useState(mobile ? t.list : t.board);
  useEffect(() => { if (mobile) setView(t.list); }, [mobile]);
  const list = db.opportunities.filter(o => {
    const c = db.contacts.find(c => c.id === o.contactId)!;
    return (!stage || o.stage === stage) && normalize(`${o.name} ${c.name} ${c.business}`).includes(normalize(q));
  });
  return <><Heading title={t.nav[2]}><Button color="primary" variant="contained" startIcon={<Add />} disabled={!db.contacts.length} onClick={() => open({ kind: 'opportunity' })}>{t.newOpportunity}</Button></Heading>
    <p className="page-description">{t.opportunitiesDescription}</p><p className="view-help">{t.stageDisclaimer}</p>{!db.contacts.length && <p>{t.contactFirst}</p>}
    <Tabs className="view-tabs" value={view} onChange={(_, value) => setView(value)} aria-label={t.opportunityView}><Tab value={t.board} label={t.board} icon={<ViewColumnOutlined />} id="board-tab" aria-controls="opportunity-panel" /><Tab value={t.list} label={t.list} icon={<FormatListBulleted />} id="opportunity-list-tab" aria-controls="opportunity-panel" /></Tabs>
    <div className="filters"><TextField id="record-search" label={t.search} value={q} onChange={e => setQ(e.target.value)} variant="outlined" size="small" /><TextField id="stage-filter" select SelectProps={{ native: true }} label={t.stage} value={stage} InputLabelProps={{ shrink: true }} onChange={e => setStage(e.target.value)} variant="outlined" size="small"><option value="">{t.allStages}</option>{stages.map(s => <option key={s}>{s}</option>)}</TextField></div>
    <p className="result-count" aria-live="polite">{t.nav[2]}: {list.length}</p><div id="opportunity-panel" role="tabpanel" aria-labelledby={view === t.board ? 'board-tab' : 'opportunity-list-tab'}>
    {view === t.board ? <Kanban opportunities={list} /> : <><p className="view-help">{t.stageHelp}</p>{list.map(o => <OpportunityCard key={o.id} opportunity={o} />)}{!list.length && <p className="empty">{t.empty}</p>}</>}</div>
  </>;
}
export function Agenda() {
  const { db, day, open } = useWorkspace(); const [date, setDate] = useState(''); const [view, setView] = useState(t.list);
  const list = db.followups.filter(f => !date || f.date === date).sort((a, b) => a.date.localeCompare(b.date));
  const canCreate = db.opportunities.some(o => !isClosed(o));
  return <><Heading title={t.nav[3]}><Button variant="contained" color="primary" startIcon={<Add />} disabled={!canCreate} onClick={() => open({ kind: 'followup' })}>{t.newFollowup}</Button></Heading><p className="page-description">{t.agendaDescription}</p>
    {!canCreate && <p>{t.opportunityFirst}</p>}<p className="view-help">{t.allDay}</p>
    <Tabs value={view} onChange={(_, v) => setView(v)} aria-label={t.nav[3]}><Tab value={t.list} label={t.list} id="agenda-list-tab" aria-controls="agenda-panel" /><Tab value={t.calendar} label={t.calendar} id="agenda-calendar-tab" aria-controls="agenda-panel" /></Tabs>
    <div className="filters"><TextField id="agenda-date" type="date" label={t.filterDate} InputLabelProps={{ shrink: true }} variant="outlined" size="small" value={date} onChange={e => setDate(e.target.value)} /><Button disabled={!date} onClick={() => setDate('')}>{t.clearDate}</Button></div>
    <p className="selected-date" aria-live="polite">{date ? `${t.selectedDay}: ${formatDate(date)}` : t.selectAllDates}</p>
    <div id="agenda-panel" role="tabpanel" aria-labelledby={view === t.list ? 'agenda-list-tab' : 'agenda-calendar-tab'}>
      {view === t.calendar ? <Calendar date={date || day} selectDate={setDate} /> : <>{list.map(f => <FollowupCard key={f.id} followup={f} />)}{!list.length && <p className="empty">{t.empty}</p>}</>}
    </div>
  </>;
}
function Chart({ title, data, max }: { title: string; data: { label: string; value: number }[]; max: number }) {
  if (data.every(d => d.value === 0)) return <Paper variant="outlined" className="chart"><h2>{title}</h2><p className="chart-empty">{t.noChartData}</p></Paper>;
  return <Paper variant="outlined" className="chart"><h2>{title}</h2><p>{t.chartScale} (0–{new Intl.NumberFormat('es-PE').format(max)})</p><ul>{data.map(d => <li key={d.label}><div><span>{d.label}</span><strong>{new Intl.NumberFormat('es-PE').format(d.value)}</strong></div><div className="bar-track" aria-hidden="true"><div style={{ width: `${d.value / max * 100}%` }} /></div></li>)}</ul></Paper>;
}
export function Results() {
  const { db } = useWorkspace(); const r = results(db);
  const max = Math.max(1, ...[...r.origins, ...r.stages, ...r.losses, ...r.wonOrigins].map(d => d.value));
  return <><Heading title={t.nav[4]} /><p className="page-description">{t.resultsDescription}</p><p className="view-help">{t.allTime}</p><div className="stats"><Stat label={t.won} value={r.won} /><Stat label={t.lost} value={r.lost} /><Stat label={t.open} value={r.open} /></div>
    <Paper variant="outlined" className="conversion"><h2>{t.conversion}</h2><strong>{r.conversion === null ? t.noClosed : `${new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 }).format(r.conversion)} %`}</strong><p>{t.conversionHelp}</p></Paper>
    <div className="charts"><Chart title={t.byOrigin} data={r.origins} max={max} /><Chart title={t.byStage} data={r.stages} max={max} /><Chart title={t.byLoss} data={r.losses} max={max} /><Chart title={t.wonByOrigin} data={r.wonOrigins} max={max} /></div>
  </>;
}
