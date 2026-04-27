/* ==================
   SOURCE BADGE
   ================== */
.risk-name__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.risk-source-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.625rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  background-color: var(--color-primary-subtle);
  padding: 1px 6px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  width: fit-content;
}

.risk-source-badge .material-symbols-rounded {
  font-size: 0.75rem;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;
}
