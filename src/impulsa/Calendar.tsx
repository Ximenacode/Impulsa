import React from 'react';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import { Button, Paper } from '@material-ui/core';
import { useWorkspace } from './context';
import { classify, localDate, offsetDay, today } from './model';
import { t } from './texts';

// Conserva Scheduler de la base. Toda edición pasa por los mismos formularios
// vinculados; no se permiten eventos sueltos ni eliminación desde el calendario.
export default function Calendar({ date, selectDate }: { date: string; selectDate: (d: string) => void }) {
  const { db, open, day } = useWorkspace();
  const data = db.followups.filter(f => f.status !== 'Cancelado').map(f => {
    const o = db.opportunities.find(o => o.id === f.opportunityId)!;
    const c = db.contacts.find(c => c.id === o.contactId)!;
    const startDate = localDate(f.date); startDate.setHours(0, 0, 0, 0);
    const endDate = localDate(offsetDay(f.date, 1)); endDate.setHours(0, 0, 0, 0);
    return { id: f.id, title: `${classify(f, day)} · ${c.business}: ${f.action}`, urgency: classify(f, day), startDate, endDate, allDay: true };
  });
  const Appointment = (props: Appointments.AppointmentProps) => <Appointments.Appointment {...props} style={props.data.urgency === 'Vencido' ? { backgroundColor: 'var(--danger)', color: '#fff' } : { backgroundColor: 'var(--primary)', color: 'var(--action-ink)' }}>
    <button className="calendar-event-button" type="button" title={props.data.title} onClick={() => open({ kind: 'followupDetail', id: String(props.data.id) })}>{props.data.title}</button>
  </Appointments.Appointment>;
  const Cell = (props: MonthView.TimeTableCellProps) => {
    const target = localDate(date); const d = props.startDate;
    const selected = d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth() && d.getDate() === target.getDate();
    return <MonthView.TimeTableCell {...props} style={selected ? { backgroundColor: 'var(--soft)', boxShadow: 'inset 0 3px 0 var(--primary)' } : undefined} />;
  };
  const changeMonth = (offset: number) => {
    const d = localDate(date); d.setDate(1); d.setMonth(d.getMonth() + offset);
    selectDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`);
  };
  return <Paper variant="outlined" className="calendar"><div className="calendar-navigation"><Button onClick={() => changeMonth(-1)}>{t.previousMonth}</Button>
    <strong aria-live="polite">{new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(localDate(date))}</strong>
    <Button onClick={() => changeMonth(1)}>{t.nextMonth}</Button><Button onClick={() => selectDate(today())}>{t.calendarToday}</Button></div>
    <Scheduler data={data} locale="es-PE" firstDayOfWeek={1} height="auto">
    <ViewState currentDate={localDate(date)} />
    <MonthView displayName={t.calendar} timeTableCellComponent={Cell} />
    <Appointments appointmentComponent={Appointment} />
  </Scheduler></Paper>;
}
