const renderRow = (risk) => {
  const level  = getRiskLevel(risk.riskScore);
  const prob   = PROBABILITY_LEVELS[risk.probability];
  const status = RISK_STATUSES[risk.status];
  const isOpen = state.expandedRow === risk.id;

  const fromAssessment = risk.sourceAssessment
    ? `<span class="risk-source-badge" title="З тематичної оцінки ${risk.sourceAssessment}">
         <span class="material-symbols-rounded">assessment</span>
         ${risk.sourceAssessment}
       </span>`
    : '';

  const reviewIndicator = (() => {
    if (!risk.reviewDate) return '';
    const reviewDate = new Date(risk.reviewDate);
    const now        = new Date();
    const daysLeft   = Math.ceil((reviewDate - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return `<span class="risk-review-badge risk-review-badge--overdue" title="Перегляд прострочено">
        <span class="material-symbols-rounded">event_busy</span>
      </span>`;
    }
    if (daysLeft <= 30) {
      return `<span class="risk-review-badge risk-review-badge--soon" title="Перегляд через ${daysLeft} днів">
        <span class="material-symbols-rounded">event_upcoming</span>
      </span>`;
    }
    return '';
  })();

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
      <td class="table__td">${risk.direction}</td>
      <td class="table__td table__td--center">
        ${badge(risk.probability, prob.class)}
      </td>
      <td class="table__td table__td--center">
        <strong>${risk.riskScore}</strong>
      </td>
      <td class="table__td">
        ${badge(level.label, level.class)}
      </td>
      <td class="table__td">
        <div class="risk-status-cell">
          ${badge(status.label, status.class)}
          ${reviewIndicator}
        </div>
      </td>
      <td class="table__td table__td--actions">
        <div class="table__actions">
          ${iconBtn('edit',         'Редагувати', 'edit'  )}
          ${iconBtn('content_copy', 'Копіювати',  'copy'  )}
          ${iconBtn('delete',       'Видалити',   'delete')}
        </div>
      </td>
    </tr>
    ${isOpen ? renderDetails(risk) : ''}
  `;
};
