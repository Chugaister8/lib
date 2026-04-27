// src/scripts/components/ResidualRiskForm.js

import { PROBABILITY_LEVELS, IMPACT_LEVELS, getRiskLevel } from '../data/risks.mock.js';

const PROBABILITY_OPTIONS = [
  { value: 1, label: '1 — Низький',      desc: 'Реалізація можлива від 3х років або ризик не реалізовувався' },
  { value: 2, label: '2 — Середній',     desc: 'Реалізація можлива від 1 до 3 років або реалізовувався 1-3 роки' },
  { value: 3, label: '3 — Високий',      desc: 'Реалізація можлива від 6 до 12 місяців або реалізовувався 12 місяців' },
  { value: 4, label: '4 — Дуже високий', desc: 'Реалізація можлива протягом 6 місяців або реалізовувався 6 місяців' },
];

const FINANCIAL_IMPACT_OPTIONS = [
  { value: 1, label: '1 — Низький',      desc: 'Вплив < 50 / 300 / 1000 т.грн' },
  { value: 2, label: '2 — Середній',     desc: '50-300 т.грн / 300-1000 т.грн / 1-5 млн грн' },
  { value: 3, label: '3 — Високий',      desc: 'від 300 т.грн / 1 млн / 5 млн до 1% річного доходу' },
  { value: 4, label: '4 — Дуже високий', desc: 'Перевищує 1% річного доходу підприємства' },
  { value: 5, label: '5 — Критичний',    desc: 'Перевищує 10% загальних активів або річного доходу' },
];

const NON_FINANCIAL_IMPACT_OPTIONS = [
  { value: 1, label: '1 — Низький',      desc: 'Вплив відсутній або мінімальний' },
  { value: 2, label: '2 — Середній',     desc: 'Вплив присутній, потрібні мінімальні зміни' },
  { value: 3, label: '3 — Високий',      desc: 'Вплив високий, зміни необхідні' },
  { value: 4, label: '4 — Дуже високий', desc: 'Зупинка або унеможливлення функціонування' },
  { value: 5, label: '5 — Критичний',    desc: 'Загибель працівників, серйозна шкода середовищу' },
];

/* ==================
   RADIO CARDS
   ================== */
const renderRadioGroup = (name, options, selectedValue) => `
  <div class="risk-form__radio-cards">
    ${options.map(opt => `
      <label class="risk-form__radio-card ${Number(selectedValue) === opt.value ? 'risk-form__radio-card--selected' : ''}">
        <input
          type="radio"
          name="${name}"
          value="${opt.value}"
          ${Number(selectedValue) === opt.value ? 'checked' : ''}
          class="risk-form__radio-input"
        />
        <span class="risk-form__radio-card-value risk-form__radio-card-value--${opt.value}">
          ${opt.value}
        </span>
        <span class="risk-form__radio-card-label">${opt.label.split('—')[1].trim()}</span>
        <span class="risk-form__radio-card-desc">${opt.desc}</span>
      </label>
    `).join('')}
  </div>
`;

/* ==================
   SCORE PREVIEW
   ================== */
const renderScorePreview = (probability, financialImpact, nonFinancialImpact, originalScore) => {
  const impact = Math.max(financialImpact, nonFinancialImpact);
  const score  = probability && impact ? probability * impact : 0;
  const level  = score ? getRiskLevel(score) : null;
  const diff   = originalScore && score ? originalScore - score : null;

  return `
    <div class="risk-form__score">
      <div class="risk-form__score-item">
        <span class="risk-form__score-label">Імовірність</span>
        <span class="risk-form__score-value">${probability || '—'}</span>
      </div>
      <span class="risk-form__score-sep">×</span>
      <div class="risk-form__score-item">
        <span class="risk-form__score-label">Вплив (макс.)</span>
        <span class="risk-form__score-value">${impact || '—'}</span>
      </div>
      <span class="risk-form__score-sep">=</span>
      <div class="risk-form__score-item">
        <span class="risk-form__score-label">Залишковий рівень</span>
        <span class="risk-form__score-value risk-form__score-value--total">
          ${score || '—'}
          ${level ? `<span class="badge ${level.class}">${level.label}</span>` : ''}
        </span>
      </div>
      ${diff !== null ? `
        <div class="risk-form__score-item">
          <span class="risk-form__score-label">Зниження</span>
          <span class="risk-form__score-value" style="color: var(--color-success)">
            <span class="material-symbols-rounded" style="font-size:1rem">trending_down</span>
            ${diff} (${Math.round((diff / originalScore) * 100)}%)
          </span>
        </div>
      ` : ''}
    </div>
  `;
};

/* ==================
   RENDER FORM
   ================== */
const renderForm = (risk, data = {}) => `
  <div class="modal-overlay" id="residual-form-modal">
    <div class="modal modal--lg">

      <div class="modal__header">
        <div class="modal__title-wrapper">
          <h2 class="modal__title">Оцінка залишкового ризику</h2>
          <p class="modal__subtitle">${risk.riskName}</p>
        </div>
        <button class="modal__close" id="residual-form-close">
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>

      <div class="modal__body">

        <!-- Поточний рівень ризику -->
        <div class="residual-form__current">
          <p class="residual-form__current-label">Поточний рівень ризику</p>
          <div class="residual-form__current-values">
            <div class="residual-form__current-item">
              <span class="residual-form__current-title">Імовірність</span>
              <span class="residual-form__current-value">${risk.probability}</span>
            </div>
            <span class="risk-form__score-sep">×</span>
            <div class="residual-form__current-item">
              <span class="residual-form__current-title">Вплив (макс.)</span>
              <span class="residual-form__current-value">
                ${Math.max(risk.financialImpact, risk.nonFinancialImpact)}
              </span>
            </div>
            <span class="risk-form__score-sep">=</span>
            <div class="residual-form__current-item">
              <span class="residual-form__current-title">Рівень</span>
              <span class="residual-form__current-value">
                ${risk.riskScore}
                <span class="badge ${getRiskLevel(risk.riskScore).class}">
                  ${getRiskLevel(risk.riskScore).label}
                </span>
              </span>
            </div>
          </div>
        </div>

        <form class="risk-form" id="residual-form" novalidate>
          <input type="hidden" name="riskId" value="${risk.id}" />

          <!-- Score preview -->
          <div id="residual-score-preview">
            ${renderScorePreview(
              data.residualProbability        || 0,
              data.residualFinancialImpact    || 0,
              data.residualNonFinancialImpact || 0,
              risk.riskScore
            )}
          </div>

          <!-- Залишкова імовірність -->
          <div class="risk-form__field risk-form__field--full">
            <label class="risk-form__label">
              Залишкова імовірність після заходів
              <span class="risk-form__required">*</span>
            </label>
            ${renderRadioGroup('residualProbability', PROBABILITY_OPTIONS, data.residualProbability)}
          </div>

          <!-- Залишковий фінансовий вплив -->
          <div class="risk-form__field risk-form__field--full">
            <label class="risk-form__label">
              Залишковий фінансовий вплив
              <span class="risk-form__required">*</span>
            </label>
            ${renderRadioGroup('residualFinancialImpact', FINANCIAL_IMPACT_OPTIONS, data.residualFinancialImpact)}
          </div>

          <!-- Залишковий нефінансовий вплив -->
          <div class="risk-form__field risk-form__field--full">
            <label class="risk-form__label">
              Залишковий нефінансовий вплив
              <span class="risk-form__required">*</span>
            </label>
            ${renderRadioGroup('residualNonFinancialImpact', NON_FINANCIAL_IMPACT_OPTIONS, data.residualNonFinancialImpact)}
          </div>

          <!-- Обґрунтування -->
          <div class="risk-form__field risk-form__field--full">
            <label class="risk-form__label">
              Обґрунтування залишкового рівня
              <span class="risk-form__required">*</span>
            </label>
            <textarea
              class="risk-form__textarea"
              name="residualDesc"
              placeholder="Опишіть чому ризик знизився після виконання заходів"
              rows="3"
              required
            >${data.residualDesc || ''}</textarea>
          </div>

          <!-- Дата оцінки -->
          <div class="risk-form__field">
            <label class="risk-form__label">Дата оцінки</label>
            <input
              type="date"
              class="risk-form__input"
              name="residualDate"
              value="${data.residualDate || new Date().toISOString().split('T')[0]}"
            />
          </div>

        </form>
      </div>

      <div class="modal__footer modal__footer--between">
        <p class="risk-form__required-note">
          <span class="risk-form__required">*</span> Обов'язкові поля
        </p>
        <div style="display:flex;gap:var(--spacing-sm)">
          <button class="btn btn--ghost" id="residual-form-cancel">Скасувати</button>
          <button class="btn btn--primary" id="residual-form-submit">
            <span class="material-symbols-rounded">save</span>
            Зберегти оцінку
          </button>
        </div>
      </div>

    </div>
  </div>
`;

/* ==================
   VALIDATION
   ================== */
const validateForm = (formData) => {
  const errors = [];
  if (!formData.get('residualProbability'))        errors.push('Оберіть залишкову імовірність');
  if (!formData.get('residualFinancialImpact'))    errors.push('Оберіть залишковий фінансовий вплив');
  if (!formData.get('residualNonFinancialImpact')) errors.push('Оберіть залишковий нефінансовий вплив');
  if (!formData.get('residualDesc'))               errors.push('Введіть обґрунтування');
  return errors;
};

/* ==================
   COLLECT DATA
   ================== */
const collectFormData = (form) => {
  const fd                      = new FormData(form);
  const residualProbability        = Number(fd.get('residualProbability'));
  const residualFinancialImpact    = Number(fd.get('residualFinancialImpact'));
  const residualNonFinancialImpact = Number(fd.get('residualNonFinancialImpact'));
  const residualImpact             = Math.max(residualFinancialImpact, residualNonFinancialImpact);

  return {
    residualProbability,
    residualFinancialImpact,
    residualNonFinancialImpact,
    residualImpact,
    residualScore: residualProbability * residualImpact,
    residualDesc:  fd.get('residualDesc'),
    residualDate:  fd.get('residualDate'),
  };
};

/* ==================
   UPDATE SCORE
   ================== */
const updateScorePreview = (form, originalScore) => {
  const probability        = Number(form.querySelector('[name="residualProbability"]:checked')?.value        || 0);
  const financialImpact    = Number(form.querySelector('[name="residualFinancialImpact"]:checked')?.value    || 0);
  const nonFinancialImpact = Number(form.querySelector('[name="residualNonFinancialImpact"]:checked')?.value || 0);

  const preview = document.getElementById('residual-score-preview');
  if (preview) {
    preview.innerHTML = renderScorePreview(probability, financialImpact, nonFinancialImpact, originalScore);
  }
};

/* ==================
   ERRORS
   ================== */
const showFormErrors = (errors) => {
  let toast = document.getElementById('residual-errors-toast');
  if (toast) toast.remove();

  toast = document.createElement('div');
  toast.id        = 'residual-errors-toast';
  toast.className = 'risk-form__errors';
  toast.innerHTML = `
    <span class="material-symbols-rounded">error</span>
    <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
  `;

  document.querySelector('#residual-form-modal .modal__body')?.prepend(toast);
  toast.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => toast?.remove(), 5000);
};

/* ==================
   REMOVE MODAL
   ================== */
const removeModal = () => {
  document.getElementById('residual-form-modal')?.remove();
  document.body.style.overflow = '';
};

/* ==================
   BIND EVENTS
   ================== */
const bindFormEvents = (risk, onSubmit) => {
  const modal = document.getElementById('residual-form-modal');
  const form  = document.getElementById('residual-form');
  if (!modal || !form) return;

  document.getElementById('residual-form-close')
    ?.addEventListener('click', removeModal);
  document.getElementById('residual-form-cancel')
    ?.addEventListener('click', removeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) removeModal();
  });

  const onEscape = (e) => {
    if (e.key === 'Escape') {
      removeModal();
      document.removeEventListener('keydown', onEscape);
    }
  };
  document.addEventListener('keydown', onEscape);

  // Radio cards
  form.querySelectorAll('.risk-form__radio-input').forEach(input => {
    input.addEventListener('change', () => {
      const group = input.closest('.risk-form__radio-cards');
      group?.querySelectorAll('.risk-form__radio-card').forEach(c =>
        c.classList.remove('risk-form__radio-card--selected')
      );
      input.closest('.risk-form__radio-card')
        ?.classList.add('risk-form__radio-card--selected');
      updateScorePreview(form, risk.riskScore);
    });
  });

  // Submit
  document.getElementById('residual-form-submit')
    ?.addEventListener('click', () => {
      const errors = validateForm(new FormData(form));
      if (errors.length) {
        showFormErrors(errors);
        return;
      }
      const data = collectFormData(form);
      onSubmit(data);
      removeModal();
    });
};

/* ==================
   OPEN FORM
   ================== */
export const openResidualRiskForm = (risk, onSubmit, data = {}) => {
  removeModal();
  document.body.insertAdjacentHTML('beforeend', renderForm(risk, data));
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    document.getElementById('residual-form-modal')
      ?.classList.add('modal--open');
  });

  bindFormEvents(risk, onSubmit);
};
