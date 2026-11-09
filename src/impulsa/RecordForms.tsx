import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { channels, financialProducts, lossReasonLabel, lossReasons, origins, stages, t } from './texts';
import { Channel, Contact, financingAction, Followup, isClosed, isFinancing, LossReason, Opportunity, Origin, ProductCategory, Stage, today, uid, validDay, validPhone } from './model';
import { Modal, useWorkspace } from './context';

type Values = { [key: string]: string };
interface Field { key: string; label: string; required?: boolean; options?: { value: string; label: string }[]; type?: string; help?: string; multiline?: boolean; disabled?: boolean; min?: string }
const options = (values: readonly string[]) => values.map(value => ({ value, label: value }));
const blankFollowup = (opportunityId: string): Followup => ({ id: uid(), opportunityId, channel: 'Llamada', date: today(), action: '', status: 'Pendiente' });

export default function RecordForms({ modal, close, errorMessage }: { modal: Modal; close: () => void; errorMessage?: string }) {
  const { db, commit } = useWorkspace();
  const contact = db.contacts.find(c => c.id === modal.id);
  const opportunity = db.opportunities.find(o => o.id === (modal.kind === 'opportunity' ? modal.id : modal.opportunityId));
  const followup = db.followups.find(f => f.id === modal.id);
  const initial: Values = modal.kind === 'contact' ? {
    name: contact?.name || '', business: contact?.business || '', phone: contact?.phone || '', need: contact?.need || '', origin: contact?.origin || 'Referido', preferred: contact?.preferred || '', notes: contact?.notes || '',
  } : modal.kind === 'opportunity' ? {
    contactId: opportunity?.contactId || modal.contactId || '', name: opportunity?.name || '', productCategory: opportunity?.productCategory || '', amount: !opportunity || !isFinancing(opportunity) || opportunity.amount === undefined ? '' : String(opportunity.amount), stage: modal.targetStage || opportunity?.stage || 'Nuevo', lossReason: opportunity?.lossReason || '', lossNote: opportunity?.lossNote || '', pending: '',
  } : modal.kind === 'followup' ? {
    opportunityId: followup?.opportunityId || modal.opportunityId || '', date: followup?.date || today(), channel: followup?.channel || 'Llamada', action: followup?.action || '',
  } : { result: '', notes: '', decision: '', date: today(), channel: 'Llamada', action: '' };
  const [v, setV] = useState<Values>(initial);
  const [errors, setErrors] = useState<Values>({}); const [failure, setFailure] = useState('');
  const [discard, setDiscard] = useState(false);
  const actionOpportunity = db.opportunities.find(o => o.id === (modal.kind === 'followup' ? v.opportunityId : followup?.opportunityId));
  const suggested = actionOpportunity ? financingAction(actionOpportunity) : undefined;
  const dirty = Object.keys(initial).some(k => initial[k] !== v[k]);
  const requestClose = () => dirty ? setDiscard(true) : close();
  const fields: Field[] = [];
  if (modal.kind === 'contact') fields.push(
    { key: 'name', label: t.nameLabel, required: true, help: t.shortNameHelp },
    { key: 'business', label: t.business, required: true, help: t.businessHelp }, { key: 'phone', label: t.phoneLabel, type: 'tel', help: t.phoneHelp }, { key: 'need', label: t.optionalNeed, help: t.needHelp },
    { key: 'origin', label: t.origin, required: true, options: options(origins), help: t.originHelp },
    { key: 'preferred', label: t.preferred, options: [{ value: '', label: t.noPreference }, ...options(channels)] },
    { key: 'notes', label: t.notes, multiline: true });
  const pending = db.followups.filter(f => f.opportunityId === opportunity?.id && f.status === 'Pendiente');
  const changingToClosed = modal.kind === 'opportunity' && ['Ganado', 'Perdido'].includes(v.stage) && v.stage !== opportunity?.stage;
  if (modal.kind === 'opportunity') {
    fields.push({ key: 'contactId', label: t.contact, required: true, disabled: !!opportunity,
      options: db.contacts.map(c => ({ value: c.id, label: `${c.name} · ${c.business}` })) },
    { key: 'name', label: t.opportunityName, required: true, help: t.opportunityNameHelp }, { key: 'productCategory', label: t.product, required: true, help: opportunity?.productCategory === 'legacy' ? t.legacyProductHelp : t.productHelp,
      options: [...financialProducts, ...(opportunity?.productCategory === 'legacy' ? [{ value: 'legacy', label: `${t.legacyProduct}: ${opportunity.product}` }] : [])] });
    if (v.productCategory === 'working_capital' || v.productCategory === 'equipment') fields.push({ key: 'amount', label: t.amount, type: 'number', help: t.amountHelp });
    fields.push({ key: 'stage', label: t.stage, required: true, options: options(stages), help: t.stageFieldHelp });
    if (v.stage === 'Perdido') fields.push({ key: 'lossReason', label: t.loss, required: true, options: lossReasons.map(value => ({ value, label: lossReasonLabel(value) })) },
      { key: 'lossNote', label: t.lossNote, required: v.lossReason === 'Otro', multiline: true });
    if (changingToClosed && pending.length) fields.push({ key: 'pending', label: `${t.pendingDecision} (${pending.length})`, required: true,
      options: [{ value: 'keep', label: t.keep }, { value: 'cancel', label: t.cancelPending }] });
  }
  if (modal.kind === 'followup') fields.push(
    { key: 'opportunityId', label: t.opportunity, required: true, disabled: !!followup,
      options: db.opportunities.filter(o => !isClosed(o) || o.id === followup?.opportunityId).map(o => ({ value: o.id, label: `${o.name} · ${db.contacts.find(c => c.id === o.contactId)!.business}` })) },
    { key: 'channel', label: t.channel, required: true, options: options(channels) },
    { key: 'date', label: t.date, required: true, type: 'date', help: t.allDay }, { key: 'action', label: t.action, required: true, help: t.actionHelp });
  if (modal.kind === 'complete') {
    const o = db.opportunities.find(o => o.id === followup?.opportunityId)!;
    fields.push({ key: 'result', label: t.result, required: true, multiline: true, help: t.resultHelp }, { key: 'notes', label: t.resultNotes, multiline: true },
      { key: 'decision', label: t.nextDecision, required: true, help: isClosed(o) ? t.closedHelp : undefined,
        options: [...(!isClosed(o) ? [{ value: 'next', label: t.nextYes }] : []), { value: 'finish', label: t.nextNo }] });
    if (v.decision === 'next') fields.push({ key: 'date', label: t.nextDate, type: 'date', required: true, min: today() },
      { key: 'channel', label: t.nextChannel, required: true, options: options(channels) }, { key: 'action', label: t.nextAction, required: true, help: t.nextActionHelp });
  }
  const submit = (event: React.FormEvent) => {
    event.preventDefault(); const e: Values = {};
    fields.forEach(f => {
      const value = (v[f.key] || '').trim();
      if (f.required && !value) e[f.key] = t.required;
      else if (value && f.options && !f.options.some(o => o.value === value)) e[f.key] = t.invalidOption;
      else if (value && f.type === 'date' && (!validDay(value) || (f.min && value < f.min))) e[f.key] = t.invalidDate;
      else if (f.key === 'amount' && value && (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) > 1e12)) e[f.key] = t.invalidAmount;
      else if (f.key === 'phone' && !validPhone(value)) e[f.key] = t.invalidPhone;
    });
    setErrors(e); setFailure('');
    if (Object.keys(e).length) { document.getElementById(`field-${Object.keys(e)[0]}`)?.focus(); return; }
    const trimmed = Object.fromEntries(Object.entries(v).map(([k, value]) => [k, value.trim()]));
    let success = false;
    if (modal.kind === 'contact') {
      const value: Contact = { id: contact?.id || uid(), name: trimmed.name, business: trimmed.business, phone: trimmed.phone, need: trimmed.need, origin: trimmed.origin as Origin, preferred: trimmed.preferred, notes: trimmed.notes, createdAt: contact?.createdAt || new Date().toISOString() };
      success = commit({ type: 'contact', value }, t.contactSaved);
    } else if (modal.kind === 'opportunity') {
      const product = financialProducts.find(p => p.value === trimmed.productCategory);
      const value: Opportunity = { id: opportunity?.id || uid(), contactId: trimmed.contactId, name: trimmed.name, product: product?.label || opportunity?.product || '', productCategory: trimmed.productCategory as ProductCategory, stage: trimmed.stage as Stage, createdAt: opportunity?.createdAt || new Date().toISOString(),
        ...(trimmed.productCategory === 'legacy' ? opportunity?.amount === undefined ? {} : { amount: opportunity.amount } : ['working_capital', 'equipment'].includes(trimmed.productCategory) && trimmed.amount !== '' ? { amount: Number(trimmed.amount) } : {}),
        ...(trimmed.stage === 'Perdido' ? { lossReason: trimmed.lossReason as LossReason, lossNote: trimmed.lossNote } : {}) };
      success = commit({ type: 'opportunity', value, pending: trimmed.pending ? trimmed.pending as 'keep' | 'cancel' : undefined }, opportunity ? opportunity.stage !== value.stage ? t.stageUpdated : t.opportunitySaved : t.opportunityCreated);
    } else if (modal.kind === 'followup') {
      success = commit({ type: 'followup', value: { ...(followup || blankFollowup(trimmed.opportunityId)), opportunityId: trimmed.opportunityId, date: trimmed.date, action: trimmed.action, channel: trimmed.channel as Channel } }, followup ? t.followupEdited : t.followupSaved);
    } else if (modal.kind === 'complete' && followup) {
      success = commit({ type: 'complete', id: followup.id, result: trimmed.result, notes: trimmed.notes, decision: trimmed.decision as 'next' | 'finish',
        ...(trimmed.decision === 'next' ? { next: { ...blankFollowup(followup.opportunityId), date: trimmed.date, action: trimmed.action, channel: trimmed.channel as Channel } } : {}) }, t.followupDone);
    }
    if (success) close(); else setFailure(t.storageWrite);
  };
  const title = modal.kind === 'contact' ? contact ? `${t.edit}: ${contact.name}` : t.newContact : modal.kind === 'opportunity' ? opportunity ? t.changeStage : t.newOpportunity : modal.kind === 'followup' ? followup ? t.reschedule : t.newFollowup : t.complete;
  return <>
    <Dialog open onClose={requestClose} fullWidth maxWidth="sm" aria-labelledby="record-title" disableBackdropClick>
      <form onSubmit={submit} noValidate>
        <DialogTitle id="record-title">{title}</DialogTitle>
        <DialogContent>
          <p className="form-intro">{t.requiredHelp}</p>
          <p className="form-intro">{modal.kind === 'contact' ? t.contactFormHelp : modal.kind === 'opportunity' ? t.opportunityFormHelp : modal.kind === 'followup' ? t.followupFormHelp : t.completionFormHelp}</p>
          {modal.kind === 'complete' && followup && <p>{followup.action} · {db.opportunities.find(o => o.id === followup.opportunityId)!.name}</p>}
          {(failure || errorMessage) && <p role="alert" className="error">{errorMessage || failure}</p>}
          <div className="form-fields">{fields.map((f, i) => <React.Fragment key={f.key}>
            {((modal.kind === 'contact' && (i === 0 || f.key === 'need')) || (modal.kind === 'opportunity' && (i === 0 || f.key === 'stage')) || (modal.kind === 'followup' && i === 0)) && <h3 className="form-section-title">{modal.kind === 'contact' ? i === 0 ? t.contactIdentity : t.commercialContext : modal.kind === 'opportunity' ? i === 0 ? t.opportunity : t.stage : t.followupPlan}</h3>}
            <TextField className={`form-field field-${f.key}`} id={`field-${f.key}`} name={f.key} label={f.label} value={v[f.key] || ''} required={f.required}
            onChange={event => { const value = event.target.value; setV({ ...v, [f.key]: value }); setErrors({ ...errors, [f.key]: '' }); }}
            disabled={f.disabled} autoFocus={i === 0} type={f.type || 'text'} select={!!f.options} SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }} inputProps={{ maxLength: f.key === 'phone' ? 32 : f.multiline ? 500 : 200, ...(f.type === 'number' ? { min: 0, max: 1e12, step: '0.01' } : {}), ...(f.min ? { min: f.min } : {}) }}
            fullWidth margin="normal" variant="outlined" multiline={f.multiline} rows={f.multiline ? 3 : undefined}
            error={!!errors[f.key]} helperText={errors[f.key] || f.help}>
            {f.options && <option value="">{f.key === 'preferred' ? t.noPreference : t.choose}</option>}
            {f.options?.filter(o => o.value !== '').map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </TextField>{f.key === 'action' && suggested && v.action !== suggested && <div className="suggested-action"><span>{t.actionSuggestion}: {suggested}</span><Button color="primary" onClick={() => setV({ ...v, action: suggested })}>{t.useSuggestion}</Button></div>}</React.Fragment>)}</div>
          {modal.kind === 'opportunity' && changingToClosed && <div className="consequence-note"><p>{t.closingHelp}</p>{v.pending && <p>{v.pending === 'cancel' ? t.cancelPendingHelp : t.keepHelp}</p>}</div>}
          {modal.kind === 'opportunity' && opportunity && isClosed(opportunity) && !['Ganado', 'Perdido'].includes(v.stage) && <p className="consequence-note">{t.reopenedHelp}</p>}
        </DialogContent>
        <DialogActions><Button onClick={requestClose}>{t.cancel}</Button><Button type="submit" color="primary" variant="contained">{t.save}</Button></DialogActions>
      </form>
    </Dialog>
    <Dialog open={discard} onClose={() => setDiscard(false)} aria-labelledby="discard-title"><DialogTitle id="discard-title">{t.leaveTitle}</DialogTitle><DialogContent>{t.unsaved}</DialogContent><DialogActions><Button autoFocus onClick={() => setDiscard(false)}>{t.continueEditing}</Button><Button onClick={close}>{t.discard}</Button></DialogActions></Dialog>
  </>;
}
