<!-- Рядок 6: Втрати -->
<div class="risk-details__grid risk-details__grid--3">
  <div class="risk-details__group">
    <p class="risk-details__label">Фактичні втрати за 3 роки</p>
    <p class="risk-details__value">${risk.actualLosses}</p>
  </div>
  <div class="risk-details__group">
    <p class="risk-details__label">Номери планів заходів</p>
    <p class="risk-details__value">
      ${measures.length > 0
        ? measures.map(m =>
            `<span class="measure-id-badge">${m.id}</span>`
          ).join('')
        : '—'
      }
    </p>
  </div>
</div>
