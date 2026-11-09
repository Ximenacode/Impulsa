import React, { useEffect, useState } from 'react';
import { Avatar, Button, IconButton } from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { useWorkspace } from './context';
import { Followup, formatDate, localDate, offsetDay } from './model';

export default function DayAgenda({ onSelect }: { onSelect: (f: Followup) => void }) {
  const { db, day } = useWorkspace();
  const [start, setStart] = useState(day); const [date, setDate] = useState(day);
  useEffect(() => { setStart(day); setDate(day); }, [day]);
  const pending = db.followups.filter(f => f.status === 'Pendiente');
  const items = pending.filter(f => f.date === date);
  const move = (offset: number) => { setStart(offsetDay(start, offset)); setDate(offsetDay(date, offset)); };
  return <section className="day-agenda panel" aria-label="Próximos contactos">
    <div className="section-heading"><h2>Próximos contactos</h2><Button size="small" onClick={() => { setStart(day); setDate(day); }}>Hoy</Button></div>
    <div className="week-strip"><IconButton aria-label="Semana anterior" onClick={() => move(-7)}><ChevronLeft /></IconButton>
      <div className="week-days">{Array.from({ length: 7 }, (_, i) => offsetDay(start, i)).map(value => {
        const count = pending.filter(f => f.date === value).length;
        return <button key={value} type="button" className={`week-day ${date === value ? 'selected' : ''}`} aria-pressed={date === value} aria-label={`Ver seguimientos del ${formatDate(value)}${count ? `, ${count} pendientes` : ''}`} onClick={() => setDate(value)}>
          <span>{new Intl.DateTimeFormat('es-PE', { weekday: 'short' }).format(localDate(value)).replace('.', '')}</span><strong>{localDate(value).getDate()}</strong><span className={`day-dot ${count ? 'has-items' : ''}`} aria-hidden="true" />
        </button>;
      })}</div><IconButton aria-label="Semana siguiente" onClick={() => move(7)}><ChevronRight /></IconButton></div>
    <p className="agenda-chosen-date"><time dateTime={date}>{formatDate(date)}</time></p>
    <div className="agenda-contacts">{items.length ? items.map(f => {
      const o = db.opportunities.find(o => o.id === f.opportunityId)!; const c = db.contacts.find(c => c.id === o.contactId)!;
      return <Button key={f.id} className="agenda-contact" aria-label={`Abrir seguimiento de ${c.name}: ${f.action}`} onClick={() => onSelect(f)}>
        <Avatar>{c.name.split(' ').map(n => n[0]).join('')}</Avatar><span className="agenda-contact-person"><strong>{c.name}</strong><span>{c.business}</span></span><span className="agenda-contact-action">{f.action}</span><ArrowForward aria-hidden="true" />
      </Button>;
    }) : <p className="agenda-day-empty">No hay seguimientos pendientes para este día.</p>}</div>
  </section>;
}
