// Знайди:
${residualScore ? `
  ...деталі залишкового ризику...
` : `
  <div class="risk-residual__empty">
    <span class="material-symbols-rounded">pending</span>
    <p>Залишковий ризик не оцінено. Заповніть після виконання заходів.</p>
    <button class="btn btn--secondary btn--sm" data-action="assess-residual" data-risk-id="${risk.id}">
      <span class="material-symbols-rounded">add</span>
      Оцінити залишковий ризик
    </button>
  </div>
`}

// Заміни на:
${(() => {
  const doneMeasures  = measures.filter(m => m.status === 'DONE').length;
  const hasAnyMeasure = measures.length > 0;
  const canAssess     = doneMeasures > 0;

  if (residualScore) {
    return `
      <div class="risk-details__grid risk-details__grid--4">
        <div class="risk-details__group">
          <p class="risk-details__label">Залишкова імовірність</p>
          <p class="risk-details__value">
            ${risk.residualProbability} —
            ${badge(PROBABILITY_LEVELS[risk.residualProbability]?.label, PROBABILITY_LEVELS[risk.residualProbability]?.class)}
          </p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Залишковий вплив</p>
          <p class="risk-details__value">
            ${risk.residualImpact} —
            ${badge(IMPACT_LEVELS[risk.residualImpact]?.label, IMPACT_LEVELS[risk.residualImpact]?.class)}
          </p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Залишковий рівень (бал)</p>
          <p class="risk-details__value">
            ${residualScore} — ${badge(residualLevel.label, residualLevel.class)}
          </p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Зниження ризику</p>
          <p class="risk-details__value risk-details__value--success">
            <span class="material-symbols-rounded" style="font-size:1rem">trending_down</span>
            ${risk.riskScore - residualScore} балів
            (${Math.round(((risk.riskScore - residualScore) / risk.riskScore) * 100)}%)
          </p>
        </div>
      </div>
      <div style="margin-top:var(--spacing-sm)">
        <button class="btn btn--ghost btn--sm" data-action="assess-residual" data-risk-id="${risk.id}">
          <span class="material-symbols-rounded">edit</span>
          Переоцінити
        </button>
        ${risk.residualDate ? `
          <span style="font-size:var(--font-size-xs);color:var(--color-text-muted);margin-left:var(--spacing-sm)">
            Оцінено: ${new Date(risk.residualDate).toLocaleDateString('uk-UA')}
          </span>
        ` : ''}
      </div>
    `;
  }

  if (!hasAnyMeasure) {
    return `
      <div class="risk-residual__empty">
        <span class="material-symbols-rounded">block</span>
        <p>Спочатку додайте заходи мінімізації ризику.</p>
      </div>
    `;
  }

  if (!canAssess) {
    return `
      <div class="risk-residual__empty">
        <span class="material-symbols-rounded">hourglass_empty</span>
        <div>
          <p>Залишковий ризик можна оцінити після виконання хоча б одного заходу.</p>
          <p style="font-size:var(--font-size-xs);color:var(--color-text-muted);margin-top:4px">
            Виконано ${doneMeasures} з ${measures.length} заходів
          </p>
        </div>
      </div>
    `;
  }

  return `
    <div class="risk-residual__empty">
      <span class="material-symbols-rounded">pending</span>
      <div>
        <p>Залишковий ризик не оцінено.</p>
        <p style="font-size:var(--font-size-xs);color:var(--color-text-muted);margin-top:4px">
          Виконано ${doneMeasures} з ${measures.length} заходів
        </p>
      </div>
      <button class="btn btn--secondary btn--sm" data-action="assess-residual" data-risk-id="${risk.id}">
        <span class="material-symbols-rounded">add</span>
        Оцінити залишковий ризик
      </button>
    </div>
  `;
})()}
