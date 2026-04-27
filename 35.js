/* ==================
   THEMATIC RISK ITEM SECTIONS
   ================== */
.thematic-risk-item__section {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.thematic-risk-item__section-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--spacing-sm);
}

/* ==================
   THEMATIC MEASURES LIST
   ================== */
.thematic-measures-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.thematic-measure-card {
  background-color: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.thematic-measure-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.thematic-measure-card__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.thematic-measure-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.thematic-measure-card__footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.thematic-measure-card__footer span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.thematic-measure-card__footer .material-symbols-rounded {
  font-size: 0.875rem;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
}

/* ==================
   MEASURE BLOCK IN FORM
   ================== */
.thematic-measure-block {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.thematic-measure-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.thematic-measure-block__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.thematic-measure-block__title .material-symbols-rounded {
  font-size: 1rem;
  color: var(--color-primary);
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;
}
