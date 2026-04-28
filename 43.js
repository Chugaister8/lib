let filtered = state.risks.filter(r => {
  const q = state.searchQuery.toLowerCase();

  const matchSearch = !q ||
    r.riskName.toLowerCase().includes(q)  ||
    r.direction.toLowerCase().includes(q) ||
    (r.riskOwner || '').toLowerCase().includes(q);

  const matchDirection = !state.filterDirection ||
    r.direction === state.filterDirection;

  const matchLevel = !state.filterLevel ||
    getRiskLevel(r.riskScore).label === state.filterLevel;

  const matchStatus = !state.filterStatus ||
    r.status === state.filterStatus;

  const matchOwner = !state.filterOwner ||
    r.riskOwner === state.filterOwner;

  return matchSearch && matchDirection && matchLevel && matchStatus && matchOwner;
});
