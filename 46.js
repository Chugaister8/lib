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

<!-- ← Додай після цього блоку -->
${risk.sourceAssessment ? `
  <div class="risk-details__grid risk-details__grid--1">
    <div class="risk-details__group">
      <p class="risk-details__label">Джерело</p>
      <p class="risk-details__value">
        <span class="material-symbols-rounded" style="font-size:1rem;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20;color:var(--color-primary)">assessment</span>
        Тематична оцінка
        <button
          class="btn btn--ghost btn--sm risk-assessment-link"
          data-action="go-to-assessment"
          data-assessment-id="${risk.sourceAssessment}">
          ${risk.sourceAssessment}
          <span class="material-symbols-rounded">open_in_new</span>
        </button>
      </p>
    </div>
  </div>
` : ''}
