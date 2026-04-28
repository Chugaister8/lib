/* ==================
   REVIEW BADGE
   ================== */
.risk-status-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.risk-review-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
}

.risk-review-badge .material-symbols-rounded {
  font-size: 1rem;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;
}

.risk-review-badge--overdue .material-symbols-rounded {
  color: var(--color-danger);
}

.risk-review-badge--soon .material-symbols-rounded {
  color: var(--color-warning);
}
