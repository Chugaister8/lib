// Додай функцію перевірки статусу ризику:
const updateRiskStatus = (riskId) => {
  const measures = state.measures[riskId] || [];
  if (measures.length === 0) return;

  const allDone      = measures.every(m => m.status === 'DONE');
  const allCancelled = measures.every(m => m.status === 'CANCELLED');
  const hasCancelled = measures.some(m => m.status === 'CANCELLED');
  const hasOverdue   = measures.some(m =>
    m.status !== 'DONE' &&
    m.status !== 'CANCELLED' &&
    new Date(m.deadline) < new Date()
  );

  state.risks = state.risks.map(r => {
    if (r.id !== riskId) return r;

    let newStatus = r.status;

    if (allDone)                          newStatus = 'MITIGATED';
    else if (allCancelled)                newStatus = 'CLOSED';
    else if (hasOverdue)                  newStatus = 'ACTIVE';
    else if (measures.some(m =>
      m.status === 'IN_PROGRESS'))        newStatus = 'MONITORED';

    return { ...r, status: newStatus };
  });
};
