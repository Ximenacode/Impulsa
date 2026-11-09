import React from 'react';
import { Avatar, Button, Chip } from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { Followup, classify, formatDate, isFinancing, money } from './model';
import { useWorkspace } from './context';
import { stages, t } from './texts';

export default function NextStep({ followup: f }: { followup?: Followup }) {
  const { db, day, open } = useWorkspace();
  if (!f) {
    return <aside className="next-step stage-overview" aria-label={t.nextStep}>
      <h2>Oportunidades por etapa</h2><ul>{stages.map((stage, i) => {
        const count = db.opportunities.filter(o => o.stage === stage).length;
        return <li key={stage} className={`stage-summary stage-summary-${i}`}><div><span className="summary-dot" aria-hidden="true" /><span>{stage}</span><strong>{count}</strong></div><div className="stage-track" aria-hidden="true"><span style={{ width: `${db.opportunities.length ? count / db.opportunities.length * 100 : 0}%` }} /></div></li>;
      })}</ul><p className="panel-description">{t.selectFollowup}</p>
    </aside>;
  }
  const o = db.opportunities.find(o => o.id === f.opportunityId)!; const c = db.contacts.find(c => c.id === o.contactId)!;
  return <aside className="next-step selected-detail" aria-label={t.nextStep}>
    <div className="next-step-heading"><span className="panel-kicker">{t.nextStep}</span><Chip size="small" label={classify(f, day)} className={classify(f, day) === 'Vencido' ? 'overdue' : ''} /></div>
    <div className="next-person"><Avatar>{c.name.split(' ').map(n => n[0]).join('')}</Avatar><div><h2>{c.name}</h2><p>{c.business}</p></div></div>
    <div className="next-product"><span>{t.product}</span><strong>{o.productCategory === 'legacy' ? t.legacyProduct : o.product}</strong></div>
    <dl className="next-details"><div><dt>{t.need}</dt><dd>{c.need || t.noNeed}</dd></div><div className="next-stage"><dt>{t.stage}</dt><dd><Chip size="small" label={o.stage} /></dd></div>
      {isFinancing(o) && <div className="amount-line"><dt>{t.requestedAmount}</dt><dd>{o.amount === undefined ? t.noAmount : money(o.amount)}</dd></div>}
    </dl>
    <div className="next-action"><span>{t.nextActionLabel}</span><h3>{f.action}</h3><p><time dateTime={f.date}>{formatDate(f.date)}</time> · {f.channel}</p></div>
    {['Ganado', 'Propuesta enviada'].includes(o.stage) && <p className="view-help">{t.stageDisclaimer}</p>}
    {f.status === 'Pendiente' && <Button color="primary" variant="contained" fullWidth endIcon={<ArrowForward />} onClick={() => open({ kind: 'complete', id: f.id })}>{t.registerFollowup}</Button>}
    {f.status === 'Realizado' && <p className="completed-result"><strong>{t.result}:</strong> {f.result}</p>}
    <Button className="full-record" fullWidth onClick={() => open({ kind: 'followupDetail', id: f.id })}>{t.fullRecord}</Button>
  </aside>;
}
