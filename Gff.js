const renderDetails = (risk) => {
  const prob    = PROBABILITY_LEVELS[risk.probability];
  const finImp  = IMPACT_LEVELS[risk.financialImpact];
  const nfinImp = IMPACT_LEVELS[risk.nonFinancialImpact];
  const level   = getRiskLevel(risk.riskScore);

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

          <!-- Рядок 6-7: Втрати та захід -->
          <div class="risk-details__grid risk-details__grid--3">
            <div class="risk-details__group">
              <p class="risk-details__label">Фактичні втрати за 3 роки</p>
              <p class="risk-details__value">${risk.actualLosses}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Номер плану заходу</p>
              <p class="risk-details__value">${risk.measureNumber}</p>
            </div>
          </div>

        </div>
      </td>
    </tr>
  `;
};
