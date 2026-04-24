// src/scripts/components/RiskForm.js

import { getRiskLevel } from '../data/risks.mock.js';

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

const RISK_DIRECTIONS = [
  'Фінансова діяльність',
  'Операційна діяльність',
  'Кадрова діяльність',
  'ІТ та кібербезпека',
  'Compliance',
  'Репутаційні ризики',
];

const RISK_INSTRUMENTS = [
  'Інтерв\'ю',
  'Анкетування',
  'Аналіз документів',
  'Спостереження',
  'Мозковий штурм',
];

const generateId = () => {
  const year = new Date().getFullYear();
  const num  = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  return `R-${year}-${num}`;
};

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
const renderScorePreview = (probability, financialImpact, nonFinancialImpact) => {
  const impact = Math.max(financialImpact, nonFinancialImpact);
  const score  = probability && impact ? probability * impact : 0;
  const level  = score ? getRiskLevel(score) : null;

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
        <span class="risk-form__score-label">Рівень ризику</span>
        <span class="risk-form__score-value risk-form__score-value--total">
          ${score || '—'}
          ${level ? `<span class="badge ${level.class}">${level.label}</span>` : ''}
        </span>
      </div>
    </div>
  `;
};

/* ==================
   RENDER FORM
   ================== */
const renderForm = (data = {}) => {
  const id = data.id || generateId();

  return `
    <div class="modal-overlay" id="risk-form-modal">
      <div class="modal modal--lg">

        <div class="modal__header">
          <div class="modal__title-wrapper">
            <h2 class="modal__title">${data.edit ? 'Редагувати ризик' : 'Додати ризик'}</h2>
            <p class="modal__subtitle">ID: <strong>${id}</strong></p>
          </div>
          <button class="modal__close" id="risk-form-close">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <div class="modal__body">
          <form class="risk-form" id="risk-form" novalidate>
            <input type="hidden" name="id" value="${id}" />

            <!-- Блок 1: Ідентифікація -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Ідентифікація ризику</h3>
              <div class="risk-form__grid">

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">
                    Інструмент ідентифікації ризику
                    <span class="risk-form__required">*</span>
                  </label>
                  <select class="risk-form__select" name="instrument" required>
                    <option value="">Оберіть інструмент</option>
                    ${RISK_INSTRUMENTS.map(i => `
                      <option value="${i}" ${data.instrument === i ? 'selected' : ''}>${i}</option>
                    `).join('')}
                  </select>
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">
                    Напрям діяльності
                    <span class="risk-form__required">*</span>
                  </label>
                  <select class="risk-form__select" name="direction" required>
                    <option value="">Оберіть напрям</option>
                    ${RISK_DIRECTIONS.map(d => `
                      <option value="${d}" ${data.direction === d ? 'selected' : ''}>${d}</option>
                    `).join('')}
                  </select>
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">
                    Назва процесу
                    <span class="risk-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    class="risk-form__input"
                    name="processName"
                    value="${data.processName || ''}"
                    placeholder="Введіть назву процесу"
                    required
                  />
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">Опис процесу</label>
                  <textarea
                    class="risk-form__textarea"
                    name="processDesc"
                    placeholder="Опишіть процес"
                    rows="2"
                  >${data.processDesc || ''}</textarea>
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">
                    Назва ВНД підприємства та дата затвердження
                  </label>
                  <input
                    type="text"
                    class="risk-form__input"
                    name="vndName"
                    value="${data.vndName || ''}"
                    placeholder="Назва документу від дд.мм.рррр"
                  />
                </div>

              </div>
            </div>

            <!-- Блок 2: Опис ризику -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Опис ризику</h3>
              <div class="risk-form__grid">

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">
                    Назва ризику
                    <span class="risk-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    class="risk-form__input"
                    name="riskName"
                    value="${data.riskName || ''}"
                    placeholder="Введіть назву ризику"
                    required
                  />
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">
                    Опис ризику
                    <span class="risk-form__required">*</span>
                  </label>
                  <textarea
                    class="risk-form__textarea"
                    name="riskDesc"
                    placeholder="Опишіть ризик"
                    rows="3"
                    required
                  >${data.riskDesc || ''}</textarea>
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">Джерело інформації про ризик</label>
                  <input
                    type="text"
                    class="risk-form__input"
                    name="infoSource"
                    value="${data.infoSource || ''}"
                    placeholder="Назва джерела"
                  />
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">Опис інформації з джерела</label>
                  <textarea
                    class="risk-form__textarea"
                    name="infoSourceDesc"
                    placeholder="Опис інформації"
                    rows="2"
                  >${data.infoSourceDesc || ''}</textarea>
                </div>

              </div>
            </div>

            <!-- Блок 3: Оцінка -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Оцінка ризику</h3>

              <div id="score-preview">
                ${renderScorePreview(
                  data.probability        || 0,
                  data.financialImpact    || 0,
                  data.nonFinancialImpact || 0
                )}
              </div>

              <div class="risk-form__field risk-form__field--full">
                <label class="risk-form__label">
                  Значення імовірності ризику
                  <span class="risk-form__required">*</span>
                </label>
                ${renderRadioGroup('probability', PROBABILITY_OPTIONS, data.probability)}
              </div>

              <div class="risk-form__field risk-form__field--full">
                <label class="risk-form__label">
                  Значення фінансового впливу ризику
                  <span class="risk-form__required">*</span>
                </label>
                ${renderRadioGroup('financialImpact', FINANCIAL_IMPACT_OPTIONS, data.financialImpact)}
              </div>

              <div class="risk-form__field risk-form__field--full">
                <label class="risk-form__label">
                  Значення нефінансового впливу ризику
                  <span class="risk-form__required">*</span>
                </label>
                ${renderRadioGroup('nonFinancialImpact', NON_FINANCIAL_IMPACT_OPTIONS, data.nonFinancialImpact)}
              </div>

              <div class="risk-form__field risk-form__field--full">
                <label class="risk-form__label">
                  Опис рівня ризику
                  <span class="risk-form__required">*</span>
                </label>
                <textarea
                  class="risk-form__textarea"
                  name="riskLevelDesc"
                  placeholder="Імовірність — вкажіть чим обґрунтовано значення. Вплив фінансовий — вкажіть цифру втрат. Вплив нефінансовий — вкажіть вплив на підприємство."
                  rows="3"
                  required
                >${data.riskLevelDesc || ''}</textarea>
              </div>

            </div>

            <!-- Блок 4: Додаткова інформація -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Додаткова інформація</h3>
              <div class="risk-form__grid">

                <div class="risk-form__field">
                  <label class="risk-form__label">Фактичні втрати за останні 3 роки</label>
                  <input
                    type="text"
                    class="risk-form__input"
                    name="actualLosses"
                    value="${data.actualLosses || ''}"
                    placeholder="Сума або 'Відсутні'"
                  />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">Номер плану заходу</label>
                  <input
                    type="text"
                    class="risk-form__input"
                    name="measureNumber"
                    value="${data.measureNumber || ''}"
                    placeholder="ПЗ-РРРР-###"
                  />
                </div>

              </div>
            </div>

          </form>
        </div>

        <div class="modal__footer modal__footer--between">
          <p class="risk-form__required-note">
            <span class="risk-form__required">*</span> Обов'язкові поля
          </p>
          <div style="display:flex;gap:var(--spacing-sm)">
            <button class="btn btn--ghost" id="risk-form-cancel">Скасувати</button>
            <button class="btn btn--primary" id="risk-form-submit">
              <span class="material-symbols-rounded">save</span>
              ${data.edit ? 'Зберегти зміни' : 'Додати ризик'}
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
};

/* ==================
   VALIDATION
   ================== */
const validateForm = (formData) => {
  const errors = [];
  if (!formData.get('instrument'))        errors.push('Оберіть інструмент ідентифікації');
  if (!formData.get('direction'))         errors.push('Оберіть напрям діяльності');
  if (!formData.get('processName'))       errors.push('Введіть назву процесу');
  if (!formData.get('riskName'))          errors.push('Введіть назву ризику');
  if (!formData.get('riskDesc'))          errors.push('Введіть опис ризику');
  if (!formData.get('probability'))       errors.push('Оберіть значення імовірності');
  if (!formData.get('financialImpact'))   errors.push('Оберіть фінансовий вплив');
  if (!formData.get('nonFinancialImpact'))errors.push('Оберіть нефінансовий вплив');
  if (!formData.get('riskLevelDesc'))     errors.push('Введіть опис рівня ризику');
  return errors;
};

/* ==================
   COLLECT DATA
   ================== */
const collectFormData = (form) => {
  const fd                 = new FormData(form);
  const probability        = Number(fd.get('probability'));
  const financialImpact    = Number(fd.get('financialImpact'));
  const nonFinancialImpact = Number(fd.get('nonFinancialImpact'));
  const impact             = Math.max(financialImpact, nonFinancialImpact);
  const riskScore          = probability * impact;

  return {
    id:                 fd.get('id'),
    instrument:         fd.get('instrument'),
    direction:          fd.get('direction'),
    processName:        fd.get('processName'),
    processDesc:        fd.get('processDesc'),
    vndName:            fd.get('vndName'),
    riskName:           fd.get('riskName'),
    riskDesc:           fd.get('riskDesc'),
    infoSource:         fd.get('infoSource'),
    infoSourceDesc:     fd.get('infoSourceDesc'),
    probability,
    financialImpact,
    nonFinancialImpact,
    riskScore,
    riskLevelDesc:      fd.get('riskLevelDesc'),
    actualLosses:       fd.get('actualLosses') || 'Відсутні',
    measureNumber:      fd.get('measureNumber') || '—',
    edrpou:             '12345678',
    status:             'ACTIVE',
  };
};

/* ==================
   UPDATE SCORE
   ================== */
const updateScorePreview = (form) => {
  const probability        = Number(form.querySelector('[name="probability"]:checked')?.value        || 0);
  const financialImpact    = Number(form.querySelector('[name="financialImpact"]:checked')?.value    || 0);
  const nonFinancialImpact = Number(form.querySelector('[name="nonFinancialImpact"]:checked')?.value || 0);

  const preview = document.getElementById('score-preview');
  if (preview) {
    preview.innerHTML = renderScorePreview(probability, financialImpact, nonFinancialImpact);
  }
};

/* ==================
   ERRORS
   ================== */
const showFormErrors = (errors) => {
  let toast = document.getElementById('form-errors-toast');
  if (toast) toast.remove();

  toast = document.createElement('div');
  toast.id        = 'form-errors-toast';
  toast.className = 'risk-form__errors';
  toast.innerHTML = `
    <span class="material-symbols-rounded">error</span>
    <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
  `;

  document.querySelector('.modal__body')?.prepend(toast);
  toast.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => toast?.remove(), 5000);
};

/* ==================
   REMOVE MODAL
   ================== */
const removeModal = () => {
  document.getElementById('risk-form-modal')?.remove();
  document.body.style.overflow = '';
};

/* ==================
   BIND EVENTS
   ================== */
const bindFormEvents = (onSubmit) => {
  const modal = document.getElementById('risk-form-modal');
  const form  = document.getElementById('risk-form');
  if (!modal || !form) return;

  // Close
  document.getElementById('risk-form-close')
    ?.addEventListener('click', removeModal);
  document.getElementById('risk-form-cancel')
    ?.addEventListener('click', removeModal);

  // Overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) removeModal();
  });

  // Escape
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
      updateScorePreview(form);
    });
  });

  // Submit
  document.getElementById('risk-form-submit')
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
export const openRiskForm = (onSubmit, data = {}) => {
  removeModal();
  document.body.insertAdjacentHTML('beforeend', renderForm(data));
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    document.getElementById('risk-form-modal')
      ?.classList.add('modal--open');
  });

  bindFormEvents(onSubmit);
};
