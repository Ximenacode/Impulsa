import React from 'react';
import { Opportunity } from './model';
import { stages, t } from './texts';
import { OpportunityCard } from './Records';
import { useWorkspace } from './context';

export default function Kanban({ opportunities }: { opportunities: Opportunity[] }) {
  const { open } = useWorkspace();
  return <><p className="view-help" id="kanban-help">{t.boardHelp}</p>
    <div className="kanban-scroll" role="region" aria-label={t.board} aria-describedby="kanban-help" tabIndex={0}>
      <div className="kanban-board">{stages.map((stage, i) => {
        const list = opportunities.filter(o => o.stage === stage);
        return <section className={`kanban-column column-${i}`} key={stage} aria-labelledby={`column-${i}`}
          onDragOver={e => { if (e.dataTransfer.types.includes('application/x-impulsa-opportunity')) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } }}
          onDrop={e => {
            const id = e.dataTransfer.getData('application/x-impulsa-opportunity');
            const o = opportunities.find(o => o.id === id);
            if (o && o.stage !== stage) { e.preventDefault(); open({ kind: 'opportunity', id, targetStage: stage }); }
          }}>
          <header className="column-heading"><h2 id={`column-${i}`}><span className="stage-dot" aria-hidden="true" />{stage}</h2><span className="column-count" aria-label={`${list.length} ${t.nav[2].toLocaleLowerCase('es-PE')}`}>{list.length}</span></header>
          {list.length ? list.map(o => <div key={o.id} className="kanban-item" draggable onDragStart={e => { e.dataTransfer.setData('application/x-impulsa-opportunity', o.id); e.dataTransfer.effectAllowed = 'move'; }}><OpportunityCard opportunity={o} compact /></div>) : <p className="column-empty">{t.noStageItems}</p>}
        </section>;
      })}</div>
    </div></>;
}
