const renderDetails = (risk) => {
  const prob     = PROBABILITY_LEVELS[risk.probability];
  const finImp   = IMPACT_LEVELS[risk.financialImpact];
  const nfinImp  = IMPACT_LEVELS[risk.nonFinancialImpact];
  const level    = getRiskLevel(risk.riskScore);
  const measures = state.measures[risk.id] || [];

  // Прогрес заходів
  const totalMeasures = measures.length;
  const doneMeasures  = measures.filter(m => m.status === 'DONE').length;
  const progressPct   = totalMeasures > 0
    ? Math.round((doneMeasures / totalMeasures) * 100)
    : 0;

  // Дата перегляду
  const reviewDate    = risk.reviewDate ? new Date(risk.reviewDate) : null;
  const isOverdueReview = reviewDate && reviewDate < new Date();
  const reviewDateStr = reviewDate
    ? reviewDate.toLocaleDateString('uk-UA')
    : '—';

  // Залишковий ризик
  const residualScore = risk.residualProbability && risk.residualImpact
    ? risk.residualProbability * risk.residualImpact
    : null;
  const residualLevel = residualScore ? getRiskLevel(residualScore) : null;

  return `
    <tr class="risk-details-row" id="details-${risk.id}">
      <td colspan="8" class="risk-details-cell">
        <div class="risk-details">

          <!-- Рядок 1: Інструмент -->
          <div class="risk-details__grid risk-details__grid--1">
            <div class="risk-details__group">
              <p class="risk-details__label">Інструмент ідентифікації ризику</p>
              <p class="risk-details__value">${risk.instrument}</p>
            </div>
          </div>

          <!-- Рядок 2: Процес -->
          <div class="risk-details__grid risk-details__grid--3">
            <div class="risk-details__group">
              <p class="risk-details__label">Назва процесу</p>
              <p class="risk-details__value">${risk.processName}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Опис процесу</p>
              <p class="risk-details__value">${risk.processDesc}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Назва ВНД та дата затвердження</p>
              <p class="risk-details__value">${risk.vndName}</p>
            </div>
          </div>

          <!-- Рядок 3: Ризик -->
          <div class="risk-details__grid risk-details__grid--3">
            <div class="risk-details__group">
              <p class="risk-details__label">Опис ризику</p>
              <p class="risk-details__value">${risk.riskDesc}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Джерело інформації</p>
              <p class="risk-details__value">${risk.infoSource}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Опис інформації з джерела</p>
              <p class="risk-details__value">${risk.infoSourceDesc}</p>
            </div>
          </div>

          <!-- Рядок 4: Бали -->
          <div class="risk-details__grid risk-details__grid--4">
            <div class="risk-details__group">
              <p class="risk-details__label">Імовірність (бал)</p>
              <p class="risk-details__value">
                ${risk.probability} — ${badge(prob.label, prob.class)}
              </p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Фінансовий вплив (бал)</p>
              <p class="risk-details__value">
                ${risk.financialImpact} — ${badge(finImp.label, finImp.class)}
              </p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Нефінансовий вплив (бал)</p>
              <p class="risk-details__value">
                ${risk.nonFinancialImpact} — ${badge(nfinImp.label, nfinImp.class)}
              </p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Рівень ризику (бал)</p>
              <p class="risk-details__value">
                ${risk.riskScore} — ${badge(level.label, level.class)}
              </p>
            </div>
          </div>

          <!-- Рядок 5: Опис рівня -->
          <div class="risk-details__grid risk-details__grid--1">
            <div class="risk-details__group">
              <p class="risk-details__label">Опис рівня ризику</p>
              <p class="risk-details__value">${risk.riskLevelDesc}</p>
            </div>
          </div>

          <!-- Рядок 6: Втрати + Власник + Перегляд -->
          <div class="risk-details__grid risk-details__grid--3">
            <div class="risk-details__group">
              <p class="risk-details__label">Фактичні втрати за 3 роки</p>
              <p class="risk-details__value">${risk.actualLosses}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Власник ризику</p>
              <p class="risk-details__value">
                <span class="material-symbols-rounded" style="font-size:1rem;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20">group</span>
                ${risk.riskOwner || '—'}
              </p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Дата наступного перегляду</p>
              <p class="risk-details__value ${isOverdueReview ? 'risk-details__value--danger' : ''}">
                <span class="material-symbols-rounded" style="font-size:1rem;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20">
                  ${isOverdueReview ? 'event_busy' : 'event_available'}
                </span>
                ${reviewDateStr}
                ${isOverdueReview ? badge('Перегляд прострочено', 'badge--danger') : ''}
              </p>
            </div>
          </div>

          <!-- Заходи мінімізації -->
          <div class="risk-measures">
            <div class="risk-measures__header">
              <p class="risk-measures__title">
                <span class="material-symbols-rounded">task_alt</span>
                Заходи мінімізації
                ${totalMeasures > 0 ? `
                  <span class="badge badge--primary">${totalMeasures}</span>
                ` : ''}
              </p>
              <button
                class="btn btn--primary btn--sm"
                data-action="add-measure"
                data-risk-id="${risk.id}">
                <span class="material-symbols-rounded">add</span>
                Додати захід
              </button>
            </div>

            ${totalMeasures > 0 ? `
              <!-- Прогрес -->
              <div class="risk-progress">
                <div class="risk-progress__header">
                  <span class="risk-progress__label">Прогрес виконання</span>
                  <span class="risk-progress__count">
                    ${doneMeasures} з ${totalMeasures} виконано
                  </span>
                </div>
                <div class="risk-progress__track">
                  <div
                    class="risk-progress__fill ${progressPct === 100 ? 'risk-progress__fill--done' : ''}"
                    style="width: ${progressPct}%">
                  </div>
                </div>
                <span class="risk-progress__pct">${progressPct}%</span>
              </div>

              <div class="risk-measures__list">
                ${measures.map(m => renderMeasureCard(m)).join('')}
              </div>
            ` : `
              <div class="risk-measures__empty">
                <span class="material-symbols-rounded">playlist_add</span>
                <p>Заходів ще немає. Додайте перший захід мінімізації.</p>
              </div>
            `}
          </div>

          <!-- Залишковий ризик -->
          <div class="risk-residual">
            <div class="risk-residual__header">
              <p class="risk-residual__title">
                <span class="material-symbols-rounded">shield</span>
                Залишковий ризик
              </p>
            </div>

            ${residualScore ? `
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
          </div>

        </div>
      </td>
    </tr>
  `;
};
