// src/scripts/components/ThematicAssessmentForm.js

import {
  ASSESSMENT_STATUSES,
  IMPACT_METHODS,
  generateAssessmentId,
  generateThematicRiskId,
} from '../data/thematic.mock.js';

import {
  PROBABILITY_LEVELS,
  IMPACT_LEVELS,
  getRiskLevel,
} from '../data/risks.mock.js';

const RISK_INSTRUMENTS = [
  'Інтерв\'ю',
  'Анкетування',
  'Аналіз документів',
  'Спостереження',
  'Мозковий штурм',
];

const RISK_DIRECTIONS = [
  'Фінансова діяльність',
  'Операційна діяльність',
  'Кадрова діяльність',
  'ІТ та кібербезпека',
  'Compliance',
  'Репутаційні ризики',
];

const PROBABILITY_OPTIONS = [
  { value: 1, label: '1 — Низький',      desc: 'Реалізація можлива від 3х років або ризик не реалізовувався' },
  { value: 2, label: '2 — Середній',     desc: 'Реалізація можлива від 1 до 3 років' },
  { value: 3, label: '3 — Високий',      desc: 'Реалізація можлива від 6 до 12 місяців' },
  { value: 4, label: '4 — Дуже високий', desc: 'Реалізація можлива протягом 6 місяців' },
];

const FINANCIAL_IMPACT_OPTIONS = [
  { value: 1, label: '1 — Низький',      desc: 'Вплив < 50 / 300 / 1000 т.грн' },
  { value: 2, label: '2 — Середній',     desc: '50-300 т.грн / 300-1000 т.грн / 1-5 млн грн' },
  { value: 3, label: '3 — Високий',      desc: 'від 300 т.грн до 1% річного доходу' },
  { value: 4, label: '4 — Дуже високий', desc: 'Перевищує 1% річного доходу' },
  { value: 5, label: '5 — Критичний',    desc: 'Перевищує 10% загальних активів' },
];

const NON_FINANCIAL_IMPACT_OPTIONS = [
  { value: 1, label: '1 — Низький',      desc: 'Вплив відсутній або мінімальний' },
  { value: 2, label: '2 — Середній',     desc: 'Вплив присутній, потрібні мінімальні зміни' },
  { value: 3, label: '3 — Високий',      desc: 'Вплив високий, зміни необхідні' },
  { value: 4, label: '4 — Дуже високий', desc: 'Зупинка або унеможливлення функціонування' },
  { value: 5, label: '5 — Критичний',    desc: 'Загибель працівників, серйозна шкода' },
];

/* ==================
   STATE
   ================== */
let formState = {
  risks: [],
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
const renderScorePreview = (riskIndex, probability, financialImpact, nonFinancialImpact) => {
  const impact = Math.max(financialImpact, nonFinancialImpact);
  const score  = probability && impact ? probability * impact : 0;
  const level  = score ? getRiskLevel(score) : null;

  return `
    <div class="risk-form__score" id="score-preview-${riskIndex}">
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
   RENDER RISK BLOCK
   ================== */
const renderRiskBlock = (risk, index) => `
  <div class="thematic-risk-block" data-risk-index="${index}" id="risk-block-${index}">

    <div class="thematic-risk-block__header">
      <p class="thematic-risk-block__title">
        <span class="material-symbols-rounded">warning</span>
        Ризик ${index + 1}
        ${risk.id ? `<span class="thematic-risk-block__id">${risk.id}</span>` : ''}
      </p>
      <button
        type="button"
        class="btn btn--ghost btn--icon btn--sm"
        data-action="remove-risk"
        data-index="${index}"
        title="Видалити ризик">
        <span class="material-symbols-rounded">delete</span>
      </button>
    </div>

    <div class="risk-form__grid">

      <!-- Інструмент -->
      <div class="risk-form__field risk-form__field--full">
        <label class="risk-form__label">
          Інструмент ідентифікації ризику
          <span class="risk-form__required">*</span>
        </label>
        <select class="risk-form__select" name="risk_${index}_instrument" required>
          <option value="">Оберіть інструмент</option>
          ${RISK_INSTRUMENTS.map(i => `
            <option value="${i}" ${risk.instrument === i ? 'selected' : ''}>${i}</option>
          `).join('')}
        </select>
      </div>

      <!-- Напрям + Процес -->
      <div class="risk-form__field">
        <label class="risk-form__label">
          Напрям діяльності
          <span class="risk-form__required">*</span>
        </label>
        <select class="risk-form__select" name="risk_${index}_direction" required>
          <option value="">Оберіть напрям</option>
          ${RISK_DIRECTIONS.map(d => `
            <option value="${d}" ${risk.direction === d ? 'selected' : ''}>${d}</option>
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
          name="risk_${index}_processName"
          value="${risk.processName || ''}"
          placeholder="Назва процесу"
          required
        />
      </div>

      <!-- Опис процесу -->
      <div class="risk-form__field risk-form__field--full">
        <label class="risk-form__label">Опис процесу</label>
        <textarea
          class="risk-form__textarea"
          name="risk_${index}_processDesc"
          placeholder="Опис процесу"
          rows="2"
        >${risk.processDesc || ''}</textarea>
      </div>

      <!-- ВНД -->
      <div class="risk-form__field">
        <label class="risk-form__label">Назва внутрішнього документу</label>
        <input
          type="text"
          class="risk-form__input"
          name="risk_${index}_vndName"
          value="${risk.vndName || ''}"
          placeholder="Назва документу"
        />
      </div>

      <div class="risk-form__field">
        <label class="risk-form__label">№ наказу про введення в дію</label>
        <input
          type="text"
          class="risk-form__input"
          name="risk_${index}_vndOrderNumber"
          value="${risk.vndOrderNumber || ''}"
          placeholder="№ наказу"
        />
      </div>

      <div class="risk-form__field">
        <label class="risk-form__label">Дата наказу про введення в дію</label>
        <input
          type="date"
          class="risk-form__input"
          name="risk_${index}_vndOrderDate"
          value="${risk.vndOrderDate || ''}"
        />
      </div>

      <!-- Ризик -->
      <div class="risk-form__field risk-form__field--full">
        <label class="risk-form__label">
          Назва ризику
          <span class="risk-form__required">*</span>
        </label>
        <input
          type="text"
          class="risk-form__input"
          name="risk_${index}_riskName"
          value="${risk.riskName || ''}"
          placeholder="Назва ризику"
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
          name="risk_${index}_riskDesc"
          placeholder="Опис ризику"
          rows="2"
          required
        >${risk.riskDesc || ''}</textarea>
      </div>

      <!-- Джерело -->
      <div class="risk-form__field">
        <label class="risk-form__label">Джерело інформації про ризик</label>
        <input
          type="text"
          class="risk-form__input"
          name="risk_${index}_infoSource"
          value="${risk.infoSource || ''}"
          placeholder="Джерело"
        />
      </div>

      <div class="risk-form__field">
        <label class="risk-form__label">Опис інформації з джерела</label>
        <textarea
          class="risk-form__textarea"
          name="risk_${index}_infoSourceDesc"
          placeholder="Опис"
          rows="2"
        >${risk.infoSourceDesc || ''}</textarea>
      </div>

    </div>

    <!-- Оцінка -->
    <div class="thematic-risk-block__section">
      <p class="thematic-risk-block__section-title">Оцінка ризику</p>

      ${renderScorePreview(index, risk.probability || 0, risk.financialImpact || 0, risk.nonFinancialImpact || 0)}

      <div class="risk-form__field risk-form__field--full">
        <label class="risk-form__label">
          Імовірність ризику
          <span class="risk-form__required">*</span>
        </label>
        ${renderRadioGroup(`risk_${index}_probability`, PROBABILITY_OPTIONS, risk.probability)}
      </div>

      <div class="risk-form__field risk-form__field--full">
        <label class="risk-form__label">
          Фінансовий вплив
          <span class="risk-form__required">*</span>
        </label>
        ${renderRadioGroup(`risk_${index}_financialImpact`, FINANCIAL_IMPACT_OPTIONS, risk.financialImpact)}
      </div>

      <div class="risk-form__field risk-form__field--full">
        <label class="risk-form__label">
          Нефінансовий вплив
          <span class="risk-form__required">*</span>
        </label>
        ${renderRadioGroup(`risk_${index}_nonFinancialImpact`, NON_FINANCIAL_IMPACT_OPTIONS, risk.nonFinancialImpact)}
      </div>

      <div class="risk-form__field risk-form__field--full">
        <label class="risk-form__label">
          Опис рівня ризику
          <span class="risk-form__required">*</span>
        </label>
        <textarea
          class="risk-form__textarea"
          name="risk_${index}_riskLevelDesc"
          placeholder="Імовірність — обґрунтуйте. Вплив фінансовий — вкажіть цифру. Вплив нефінансовий — опишіть."
          rows="3"
          required
        >${risk.riskLevelDesc || ''}</textarea>
      </div>

    </div>

    <!-- Заходи -->
    <div class="thematic-risk-block__section">
      <p class="thematic-risk-block__section-title">Заходи мінімізації</p>

      <div class="risk-form__grid">

        <div class="risk-form__field risk-form__field--full">
          <label class="risk-form__label">Існуючі заходи контролю</label>
          <textarea
            class="risk-form__textarea"
            name="risk_${index}_existingControls"
            placeholder="Опишіть існуючі заходи контролю"
            rows="2"
          >${risk.existingControls || ''}</textarea>
        </div>

        <div class="risk-form__field">
          <label class="risk-form__label">
            Метод впливу на ризик
            <span class="risk-form__required">*</span>
          </label>
          <select class="risk-form__select" name="risk_${index}_impactMethod" required>
            <option value="">Оберіть метод</option>
            ${IMPACT_METHODS.map(m => `
              <option value="${m}" ${risk.impactMethod === m ? 'selected' : ''}>${m}</option>
            `).join('')}
          </select>
        </div>

        <div class="risk-form__field risk-form__field--full">
          <label class="risk-form__label">
            Заходи впливу на ризик
            <span class="risk-form__required">*</span>
          </label>
          <input
            type="text"
            class="risk-form__input"
            name="risk_${index}_measureTitle"
            value="${risk.measureTitle || ''}"
            placeholder="Назва заходу"
            required
          />
        </div>

        <div class="risk-form__field risk-form__field--full">
          <label class="risk-form__label">Опис заходу</label>
          <textarea
            class="risk-form__textarea"
            name="risk_${index}_measureDesc"
            placeholder="Детальний опис заходу"
            rows="2"
          >${risk.measureDesc || ''}</textarea>
        </div>

        <div class="risk-form__field">
          <label class="risk-form__label">
            Відповідальний підрозділ
            <span class="risk-form__required">*</span>
          </label>
          <input
            type="text"
            class="risk-form__input"
            name="risk_${index}_responsible"
            value="${risk.responsible || ''}"
            placeholder="Підрозділ"
            required
          />
        </div>

        <div class="risk-form__field">
          <label class="risk-form__label">
            Строк виконання заходу
            <span class="risk-form__required">*</span>
          </label>
          <input
            type="date"
            class="risk-form__input"
            name="risk_${index}_deadline"
            value="${risk.deadline || ''}"
            required
          />
        </div>

      </div>
    </div>

  </div>
`;

/* ==================
   RENDER FORM
   ================== */
const renderForm = (data = {}) => {
  const id = data.id || generateAssessmentId();

  return `
    <div class="modal-overlay" id="thematic-form-modal">
      <div class="modal modal--xl">

        <div class="modal__header">
          <div class="modal__title-wrapper">
            <h2 class="modal__title">
              ${data.edit ? 'Редагувати тематичну оцінку' : 'Провести тематичну оцінку ризиків'}
            </h2>
            <p class="modal__subtitle">ID: <strong>${id}</strong></p>
          </div>
          <button class="modal__close" id="thematic-form-close">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <div class="modal__body">
          <form class="risk-form" id="thematic-form" novalidate>
            <input type="hidden" name="id" value="${id}" />

            <!-- Загальна інформація -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Загальна інформація</h3>
              <div class="risk-form__grid">

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">
                    Назва тематичного оцінювання
                    <span class="risk-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    class="risk-form__input"
                    name="title"
                    value="${data.title || ''}"
                    placeholder="Назва оцінки"
                    required
                  />
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">
                    Ризик-координатор (ПІБ)
                    <span class="risk-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    class="risk-form__input"
                    name="coordinator"
                    value="${data.coordinator || 'Admin'}"
                    placeholder="ПІБ координатора"
                    required
                  />
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">Опис висновку з ризиків</label>
                  <textarea
                    class="risk-form__textarea"
                    name="description"
                    placeholder="Загальний опис висновку"
                    rows="3"
                  >${data.description || ''}</textarea>
                </div>

              </div>
            </div>

            <!-- Ризики -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Ризики</h3>

              <div id="thematic-risks-list">
                ${formState.risks.map((r, i) => renderRiskBlock(r, i)).join('')}
              </div>

              <button
                type="button"
                class="btn btn--secondary btn--sm"
                id="add-thematic-risk"
                style="margin-top: var(--spacing-md)">
                <span class="material-symbols-rounded">add</span>
                Додати ризик
              </button>

            </div>

          </form>
        </div>

        <div class="modal__footer modal__footer--between">
          <p class="risk-form__required-note">
            <span class="risk-form__required">*</span> Обов'язкові поля
          </p>
          <div style="display:flex;gap:var(--spacing-sm)">
            <button class="btn btn--ghost" id="thematic-form-cancel">Скасувати</button>
            <button class="btn btn--secondary" id="thematic-form-draft">
              <span class="material-symbols-rounded">save</span>
              Зберегти чернетку
            </button>
            <button class="btn btn--primary" id="thematic-form-submit">
              <span class="material-symbols-rounded">check_circle</span>
              Зберегти оцінку
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
};

/* ==================
   COLLECT RISK DATA
   ================== */
const collectRiskData = (form, index) => {
  const fd = new FormData(form);

  const probability        = Number(fd.get(`risk_${index}_probability`)        || 0);
  const financialImpact    = Number(fd.get(`risk_${index}_financialImpact`)    || 0);
  const nonFinancialImpact = Number(fd.get(`risk_${index}_nonFinancialImpact`) || 0);
  const impact             = Math.max(financialImpact, nonFinancialImpact);
  const riskScore          = probability * impact;

  return {
    id:                  formState.risks[index]?.id || generateThematicRiskId(),
    instrument:          fd.get(`risk_${index}_instrument`)       || '',
    direction:           fd.get(`risk_${index}_direction`)        || '',
    processName:         fd.get(`risk_${index}_processName`)      || '',
    processDesc:         fd.get(`risk_${index}_processDesc`)      || '',
    vndName:             fd.get(`risk_${index}_vndName`)          || '',
    vndOrderNumber:      fd.get(`risk_${index}_vndOrderNumber`)   || '',
    vndOrderDate:        fd.get(`risk_${index}_vndOrderDate`)     || '',
    riskName:            fd.get(`risk_${index}_riskName`)         || '',
    riskDesc:            fd.get(`risk_${index}_riskDesc`)         || '',
    infoSource:          fd.get(`risk_${index}_infoSource`)       || '',
    infoSourceDesc:      fd.get(`risk_${index}_infoSourceDesc`)   || '',
    probability,
    financialImpact,
    nonFinancialImpact,
    riskScore,
    riskLevelDesc:       fd.get(`risk_${index}_riskLevelDesc`)    || '',
    existingControls:    fd.get(`risk_${index}_existingControls`) || '',
    impactMethod:        fd.get(`risk_${index}_impactMethod`)     || '',
    measureTitle:        fd.get(`risk_${index}_measureTitle`)     || '',
    measureDesc:         fd.get(`risk_${index}_measureDesc`)      || '',
    responsible:         fd.get(`risk_${index}_responsible`)      || '',
    deadline:            fd.get(`risk_${index}_deadline`)         || '',
  };
};

/* ==================
   COLLECT FORM DATA
   ================== */
const collectFormData = (form, status) => {
  const fd = new FormData(form);

  const risks = formState.risks.map((_, i) => collectRiskData(form, i));

  return {
    id:          fd.get('id'),
    title:       fd.get('title'),
    coordinator: fd.get('coordinator'),
    description: fd.get('description'),
    status,
    risks,
    createdAt:   new Date().toISOString(),
  };
};

/* ==================
   VALIDATION
   ================== */
const validateForm = (form) => {
  const errors = [];
  const fd     = new FormData(form);

  if (!fd.get('title'))       errors.push('Введіть назву тематичного оцінювання');
  if (!fd.get('coordinator')) errors.push('Введіть ПІБ ризик-координатора');

  if (formState.risks.length === 0) {
    errors.push('Додайте хоча б один ризик');
    return errors;
  }

  formState.risks.forEach((_, i) => {
    if (!fd.get(`risk_${i}_instrument`))  errors.push(`Ризик ${i + 1}: оберіть інструмент`);
    if (!fd.get(`risk_${i}_direction`))   errors.push(`Ризик ${i + 1}: оберіть напрям`);
    if (!fd.get(`risk_${i}_processName`)) errors.push(`Ризик ${i + 1}: введіть назву процесу`);
    if (!fd.get(`risk_${i}_riskName`))    errors.push(`Ризик ${i + 1}: введіть назву ризику`);
    if (!fd.get(`risk_${i}_riskDesc`))    errors.push(`Ризик ${i + 1}: введіть опис ризику`);
    if (!fd.get(`risk_${i}_probability`)) errors.push(`Ризик ${i + 1}: оберіть імовірність`);
    if (!fd.get(`risk_${i}_financialImpact`))    errors.push(`Ризик ${i + 1}: оберіть фінансовий вплив`);
    if (!fd.get(`risk_${i}_nonFinancialImpact`)) errors.push(`Ризик ${i + 1}: оберіть нефінансовий вплив`);
    if (!fd.get(`risk_${i}_riskLevelDesc`))      errors.push(`Ризик ${i + 1}: введіть опис рівня ризику`);
    if (!fd.get(`risk_${i}_impactMethod`))       errors.push(`Ризик ${i + 1}: оберіть метод впливу`);
    if (!fd.get(`risk_${i}_measureTitle`))       errors.push(`Ризик ${i + 1}: введіть захід`);
    if (!fd.get(`risk_${i}_responsible`))        errors.push(`Ризик ${i + 1}: введіть відповідальний підрозділ`);
    if (!fd.get(`risk_${i}_deadline`))           errors.push(`Ризик ${i + 1}: вкажіть строк виконання`);
  });

  return errors;
};

/* ==================
   ERRORS
   ================== */
const showFormErrors = (errors) => {
  let toast = document.getElementById('thematic-errors-toast');
  if (toast) toast.remove();

  toast = document.createElement('div');
  toast.id        = 'thematic-errors-toast';
  toast.className = 'risk-form__errors';
  toast.innerHTML = `
    <span class="material-symbols-rounded">error</span>
    <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
  `;

  document.querySelector('#thematic-form-modal .modal__body')?.prepend(toast);
  toast.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => toast?.remove(), 5000);
};

/* ==================
   REMOVE MODAL
   ================== */
const removeModal = () => {
  document.getElementById('thematic-form-modal')?.remove();
  document.body.style.overflow = '';
};

/* ==================
   UPDATE SCORE PREVIEW
   ================== */
const updateScorePreview = (form, index) => {
  const probability        = Number(form.querySelector(`[name="risk_${index}_probability"]:checked`)?.value        || 0);
  const financialImpact    = Number(form.querySelector(`[name="risk_${index}_financialImpact"]:checked`)?.value    || 0);
  const nonFinancialImpact = Number(form.querySelector(`[name="risk_${index}_nonFinancialImpact"]:checked`)?.value || 0);

  const preview = document.getElementById(`score-preview-${index}`);
  if (preview) {
    preview.outerHTML = renderScorePreview(index, probability, financialImpact, nonFinancialImpact);
  }
};

/* ==================
   BIND EVENTS
   ================== */
const bindFormEvents = (onSubmit) => {
  const modal = document.getElementById('thematic-form-modal');
  const form  = document.getElementById('thematic-form');
  if (!modal || !form) return;

  // Close
  document.getElementById('thematic-form-close')
    ?.addEventListener('click', removeModal);
  document.getElementById('thematic-form-cancel')
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

  // Add risk
  document.getElementById('add-thematic-risk')
    ?.addEventListener('click', () => {
      formState.risks.push({});
      const list = document.getElementById('thematic-risks-list');
      if (list) {
        const index = formState.risks.length - 1;
        list.insertAdjacentHTML('beforeend', renderRiskBlock({}, index));
        bindRiskBlockEvents(form, index);
      }
    });

  // Bind existing risk blocks
  formState.risks.forEach((_, i) => bindRiskBlockEvents(form, i));

  // Save draft
  document.getElementById('thematic-form-draft')
    ?.addEventListener('click', () => {
      const data = collectFormData(form, 'DRAFT');
      onSubmit(data);
      removeModal();
    });

  // Submit
  document.getElementById('thematic-form-submit')
    ?.addEventListener('click', () => {
      const errors = validateForm(form);
      if (errors.length) {
        showFormErrors(errors);
        return;
      }
      const data = collectFormData(form, 'PENDING');
      onSubmit(data);
      removeModal();
    });
};

/* ==================
   BIND RISK BLOCK EVENTS
   ================== */
const bindRiskBlockEvents = (form, index) => {
  const block = document.getElementById(`risk-block-${index}`);
  if (!block) return;

  // Radio cards
  block.querySelectorAll('.risk-form__radio-input').forEach(input => {
    input.addEventListener('change', () => {
      const group = input.closest('.risk-form__radio-cards');
      group?.querySelectorAll('.risk-form__radio-card').forEach(c =>
        c.classList.remove('risk-form__radio-card--selected')
      );
      input.closest('.risk-form__radio-card')
        ?.classList.add('risk-form__radio-card--selected');
      updateScorePreview(form, index);
    });
  });

  // Remove risk
  block.querySelector(`[data-action="remove-risk"][data-index="${index}"]`)
    ?.addEventListener('click', () => {
      formState.risks.splice(index, 1);
      rerenderRisksList(form);
    });
};

/* ==================
   RERENDER RISKS LIST
   ================== */
const rerenderRisksList = (form) => {
  const list = document.getElementById('thematic-risks-list');
  if (!list) return;

  list.innerHTML = formState.risks
    .map((r, i) => renderRiskBlock(r, i))
    .join('');

  formState.risks.forEach((_, i) => bindRiskBlockEvents(form, i));
};

/* ==================
   OPEN FORM
   ================== */
export const openThematicAssessmentForm = (onSubmit, data = {}) => {
  removeModal();

  formState.risks = data.risks ? [...data.risks] : [];

  document.body.insertAdjacentHTML('beforeend', renderForm(data));
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    document.getElementById('thematic-form-modal')
      ?.classList.add('modal--open');
  });

  bindFormEvents(onSubmit);
};
