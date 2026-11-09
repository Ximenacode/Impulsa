import React from 'react';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@material-ui/core';
import { classify, Followup, formatDate, formatInstant, isClosed, isFinancing, money, Opportunity } from './model';
import EventNoteOutlined from '@material-ui/icons/EventNoteOutlined';
import { Modal, useWorkspace } from './context';
import { lossReasonLabel, shortProductLabel, t } from './texts';

export function OpportunityCard({ opportunity: o, compact = false }: { opportunity: Opportunity; compact?: boolean }) {
  const { db, open } = useWorkspace(); const c = db.contacts.find(c => c.id === o.contactId)!;
  const next = db.followups.filter(f => f.opportunityId === o.id && f.status === 'Pendiente').sort((a, b) => a.date.localeCompare(b.date))[0];
  return <Paper variant="outlined" className="record opportunity-record">
    <div className="record-heading"><h3><Button className="title-button" onClick={() => open({ kind: 'opportunityDetail', id: o.id })}>{o.name}</Button></h3>{!compact && <Chip size="small" className={`stage stage-${o.stage === 'Ganado' ? 'won' : o.stage === 'Perdido' ? 'lost' : 'open'}`} label={o.stage} />}</div>
    <p className="record-person"><strong>{c.name}</strong> · {c.business}</p><div className="record-context"><span className="record-product" title={o.product}>{shortProductLabel(o.productCategory)}</span>{isFinancing(o) && <span className="record-amount">{o.amount === undefined ? t.noAmount : `${t.requestedAmount}: ${money(o.amount)}`}</span>}</div>
    <div className={`opportunity-next ${!next ? 'no-next' : ''}`}><span>{t.nextActionLabel}</span><p>{next ? next.action : t.noNext}</p>{next && <time dateTime={next.date}>{formatDate(next.date)}</time>}</div>
    <div className="actions"><Button color="primary" onClick={() => open({ kind: 'opportunity', id: o.id })}>{t.changeStage}</Button>
      {!isClosed(o) && <Button onClick={() => open({ kind: 'followup', opportunityId: o.id })}>{t.newFollowup}</Button>}</div>
  </Paper>;
}
export function FollowupCard({ followup: f }: { followup: Followup }) {
  const { db, day, open } = useWorkspace(); const o = db.opportunities.find(o => o.id === f.opportunityId)!; const c = db.contacts.find(c => c.id === o.contactId)!;
  return <Paper variant="outlined" className="record followup-record">
    <div className="record-heading"><h3><Button className="title-button" onClick={() => open({ kind: 'followupDetail', id: f.id })}>{f.action}</Button></h3>
      <Chip size="small" className={classify(f, day) === 'Vencido' ? 'overdue' : ''} label={classify(f, day)} /></div>
    <p className="record-person"><strong>{c.name}</strong> · {c.business}</p><p className="record-subject">{o.name} <span className="inline-stage">{o.stage}</span></p><div className="record-date"><EventNoteOutlined aria-hidden="true" /><time dateTime={f.date}>{formatDate(f.date)}</time><span className="channel-label">{f.channel}</span></div>
    {f.status === 'Realizado' && <p><strong>{t.result}:</strong> {f.result}</p>}
    {f.status === 'Pendiente' && <div className="actions"><Button color="primary" variant="outlined" onClick={() => open({ kind: 'complete', id: f.id })}>{t.complete}</Button>
      <Button onClick={() => open({ kind: 'followup', id: f.id })}>{t.reschedule}</Button>
      <Button onClick={() => open({ kind: 'cancel', id: f.id })}>{t.cancelFollowup}</Button></div>}
  </Paper>;
}
function Info({ label, children }: { label: string; children: React.ReactNode }) { return <div><dt>{label}</dt><dd>{children || '—'}</dd></div>; }
export function Details({ modal, close }: { modal: Modal; close: () => void }) {
  const { db, open } = useWorkspace();
  const followup = modal.kind === 'followupDetail' ? db.followups.find(f => f.id === modal.id) : undefined;
  const opportunity = db.opportunities.find(o => o.id === (followup ? followup.opportunityId : modal.kind === 'opportunityDetail' ? modal.id : ''));
  const contact = db.contacts.find(c => c.id === (opportunity ? opportunity.contactId : modal.id))!;
  const related = db.opportunities.filter(o => o.contactId === contact.id);
  const history = db.followups.filter(f => opportunity ? f.opportunityId === opportunity.id : related.some(o => o.id === f.opportunityId)).sort((a, b) => b.date.localeCompare(a.date));
  const title = followup?.action || opportunity?.name || `${contact.name} · ${contact.business}`;
  return <Dialog open onClose={close} fullWidth maxWidth="md" aria-labelledby="detail-title">
    <DialogTitle id="detail-title">{title}</DialogTitle><DialogContent>
      <h3 className="detail-section-title">{t.contactIdentity}</h3>
      <dl className="details"><Info label={t.contact}>{contact.name}</Info><Info label={t.business}>{contact.business}</Info><Info label={t.phone}>{contact.phone || t.noPhone}</Info><Info label={t.need}>{contact.need}</Info>
        <Info label={t.origin}>{contact.origin}</Info><Info label={t.preferred}>{contact.preferred || t.noPreference}</Info><Info label={t.notes}>{contact.notes}</Info>
        <Info label={t.created}>{formatInstant(contact.createdAt)}</Info></dl>
        {opportunity && <><h3 className="detail-section-title">{t.businessActivity}</h3><dl className="details"><Info label={t.opportunity}>{opportunity.name}</Info><Info label={t.product}>{opportunity.product}</Info><Info label={t.stage}>{opportunity.stage}</Info>
          {isFinancing(opportunity) && <Info label={t.requestedAmount}>{opportunity.amount === undefined ? t.noAmount : money(opportunity.amount)}</Info>}<Info label={`${t.created} · ${t.opportunity}`}>{formatInstant(opportunity.createdAt)}</Info>
          {opportunity.closedAt && <Info label={t.closed}>{formatDate(opportunity.closedAt)}</Info>}
          {opportunity.stage === 'Perdido' && <><Info label={t.loss}>{lossReasonLabel(opportunity.lossReason!)}</Info><Info label={t.lossNote}>{opportunity.lossNote}</Info></>}</dl></>}
        {followup && <><h3 className="detail-section-title">{t.followupPlan}</h3><dl className="details"><Info label={t.action}>{followup.action}</Info><Info label={t.date}>{formatDate(followup.date)}</Info><Info label={t.channel}>{followup.channel}</Info><Info label={t.status}>{followup.status}</Info>
          {followup.completedAt && <><Info label={t.result}>{followup.result}</Info><Info label={t.resultNotes}>{followup.notes}</Info><Info label={t.completed}>{formatInstant(followup.completedAt)}</Info></>}</dl></>}
      {opportunity && ['Ganado', 'Propuesta enviada'].includes(opportunity.stage) && <p className="view-help">{t.stageDisclaimer}</p>}
      <div className="actions"><Button onClick={() => open({ kind: 'contact', id: contact.id })}>{t.edit} {t.contact.toLocaleLowerCase('es-PE')}</Button>
        {modal.kind !== 'contactDetail' && <Button onClick={() => open({ kind: 'contactDetail', id: contact.id })}>{t.linkedContact}</Button>}
        {opportunity && <Button onClick={() => open({ kind: 'opportunity', id: opportunity.id })}>{t.changeStage}</Button>}
        {followup && <Button onClick={() => open({ kind: 'opportunityDetail', id: followup.opportunityId })}>{t.linkedOpportunity}</Button>}
        {!opportunity && <Button color="primary" onClick={() => open({ kind: 'opportunity', contactId: contact.id })}>{t.newOpportunity}</Button>}
        {opportunity && !isClosed(opportunity) && <Button color="primary" onClick={() => open({ kind: 'followup', opportunityId: opportunity.id })}>{t.newFollowup}</Button>}
        {followup?.status === 'Pendiente' && <><Button color="primary" onClick={() => open({ kind: 'complete', id: followup.id })}>{t.complete}</Button><Button onClick={() => open({ kind: 'followup', id: followup.id })}>{t.reschedule}</Button><Button onClick={() => open({ kind: 'cancel', id: followup.id })}>{t.cancelFollowup}</Button></>}
      </div>
      {opportunity && isClosed(opportunity) && <p>{t.closedHelp}</p>}
      {!opportunity && <><h3>{t.related}</h3>{related.length ? related.map(o => <OpportunityCard key={o.id} opportunity={o} />) : <p>{t.empty}</p>}</>}
      {!opportunity && <><h3>{t.contactFollowups}</h3>{history.length ? history.map(f => <FollowupCard key={f.id} followup={f} />) : <p>{t.noFollowups}</p>}</>}
      {opportunity && !followup && <><h3>{t.history}</h3>{history.length ? history.map(f => <FollowupCard key={f.id} followup={f} />) : <p>{t.noFollowups}</p>}</>}
    </DialogContent><DialogActions><Button autoFocus onClick={close}>{t.close}</Button></DialogActions>
  </Dialog>;
}
