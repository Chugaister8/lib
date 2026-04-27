const renderRow = (risk) => {
  const level  = getRiskLevel(risk.riskScore);
  const prob   = PROBABILITY_LEVELS[risk.probability];
  const status = RISK_STATUSES[risk.status];
  const isOpen = state.expandedRow === risk.id;

  // ← додай
  const fromAssessment = risk.sourceAssessment
    ? `<span class="risk-source-badge" title="З тематичної оцінки ${risk.sourceAssessment}">
         <span class="material-symbols-rounded">assessment</span>
         ${risk.sourceAssessment}
       </span>`
    : '';

  return `
    <tr class="table__row table__row--clickable ${isOpen ? 'table__row--selected' : ''}"
      data-risk-id="${risk.id}">
      <td class="table__td table__td--id">${risk.id}</td>
      <td class="table__td">
        <div class="risk-name">
          <span class="material-symbols-rounded risk-name__chevron ${isOpen ? 'risk-name__chevron--open' : ''}">
            chevron_right
          </span>
          <div class="risk-name__content">
            <span class="risk-name__text">${risk.riskName}</span>
            ${fromAssessment}
          </div>
        </div>
      </td>
      ...решта колонок без змін...
  `;
};
