// src/scripts/components/MeasureForm.js

import { MEASURE_STATUSES, generateMeasureId } from '../data/measures.mock.js';

/* ==================
   RENDER FORM
   ================== */
const renderForm = (riskId, riskName, data = {}) => {
  const id = data.id || generateMeasureId(riskId);

  return `
    <div class="modal-overlay" id="measure-form-modal">
      <div class="modal modal--md">

        <div class="modal__header">
          <div class="modal__title-wrapper">
            <h2 class="modal__title">${data.edit ? 'Редагувати захід' : 'Додати захід мінімізації'}</h2>
            <p class="modal__subtitle">
              Ризик: <strong>${riskName}</strong> · ID: <strong>${id}</strong>
            </p>
          </div>
          <button class="modal__close" id="measure-form-close">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <div class="modal__body">
          <form class="risk-form" id="measure-form" novalidate>
            <input type="hidden" name="id"     value="${id}"     />
            <input type="hidden" name="riskId" value="${riskId}" />

            <!-- Назва -->
            <div class="risk-form__field">
              <label class="risk-form__label">
                Назва плану заходу
                <span class="risk-form__required">*</span>
              </label>
              <input
                type="text"
                class="risk-form__input"
                name="title"
                value="${data.title || ''}"
                placeholder="Введіть назву заходу"
                required
              />
            </div>

            <!-- Опис -->
            <div class="risk-form__field">
              <label class="risk-form__label">
                Опис заходу
                <span class="risk-form__required">*</span>
              </label>
              <textarea
                class="risk-form__textarea"
                name="desc"
                placeholder="Опишіть захід мінімізації"
                rows="3"
                required
              >${data.desc || ''}</textarea>
            </div>

            <!-- Відповідальний підрозділ -->
            <div class="risk-form__field">
              <label class="risk-form__label">
                Відповідальний підрозділ
                <span class="risk-form__required">*</span>
              </label>
              <input
                type="text"
                class="risk-form__input"
                name="responsible"
                value="${data.responsible || ''}"
                placeholder="Назва підрозділу"
                required
              />
            </div>

            <!-- Строк виконання + Затверджено -->
            <div class="risk-form__grid">

              <div class="risk-form__field">
                <label class="risk-form__label">
                  Строк виконання
                  <span class="risk-form__required">*</span>
                </label>
                <input
                  type="date"
                  class="risk-form__input"
                  name="deadline"
                  value="${data.deadline || ''}"
                  required
                />
              </div>

              <div class="risk-form__field">
                <label class="risk-form__label">Чим затверджено</label>
                <input
                  type="text"
                  class="risk-form__input"
                  name="approvedBy"
                  value="${data.approvedBy || ''}"
                  placeholder="Наказ № від дд.мм.рррр"
                />
              </div>

            </div>

            <!-- Статус -->
            <div class="risk-form__field">
              <label class="risk-form__label">
                Поточний статус
                <span class="risk-form__required">*</span>
              </label>
              <select class="risk-form__select" name="status" required>
                <option value="">Оберіть статус</option>
                ${Object.entries(MEASURE_STATUSES).map(([key, val]) => `
                  <option value="${key}" ${data.status === key ? 'selected' : ''}>
                    ${val.label}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Опис виконаних дій -->
            <div class="risk-form__field">
              <label class="risk-form__label">Опис виконаних дій</label>
              <textarea
                class="risk-form__textarea"
                name="executionDesc"
                placeholder="Опишіть що вже зроблено"
                rows="3"
              >${data.executionDesc || ''}</textarea>
            </div>

          </form>
        </div>

        <div class="modal__footer modal__footer--between">
          <p class="risk-form__required-note">
            <span class="risk-form__required">*</span> Обов'язкові поля
          </p>
          <div style="display:flex;gap:var(--spacing-sm)">
            <button class="btn btn--ghost" id="measure-form-cancel">Скасувати</button>
            <button class="btn btn--primary" id="measure-form-submit">
              <span class="material-symbols-rounded">save</span>
              ${data.edit ? 'Зберегти зміни' : 'Додати захід'}
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
  if (!formData.get('title'))       errors.push('Введіть назву заходу');
  if (!formData.get('desc'))        errors.push('Введіть опис заходу');
  if (!formData.get('responsible')) errors.push('Введіть відповідальний підрозділ');
  if (!formData.get('deadline'))    errors.push('Вкажіть строк виконання');
  if (!formData.get('status'))      errors.push('Оберіть статус');
  return errors;
};

/* ==================
   COLLECT DATA
   ================== */
const collectFormData = (form) => {
  const fd = new FormData(form);
  return {
    id:            fd.get('id'),
    riskId:        fd.get('riskId'),
    title:         fd.get('title'),
    desc:          fd.get('desc'),
    responsible:   fd.get('responsible'),
    deadline:      fd.get('deadline'),
    approvedBy:    fd.get('approvedBy') || '—',
    status:        fd.get('status'),
    executionDesc: fd.get('executionDesc') || '',
    createdAt:     new Date().toISOString(),
  };
};

/* ==================
   ERRORS
   ================== */
const showFormErrors = (errors) => {
  let toast = document.getElementById('measure-errors-toast');
  if (toast) toast.remove();

  toast = document.createElement('div');
  toast.id        = 'measure-errors-toast';
  toast.className = 'risk-form__errors';
  toast.innerHTML = `
    <span class="material-symbols-rounded">error</span>
    <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
  `;

  document.querySelector('#measure-form-modal .modal__body')?.prepend(toast);
  toast.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => toast?.remove(), 5000);
};

/* ==================
   REMOVE MODAL
   ================== */
const removeModal = () => {
  document.getElementById('measure-form-modal')?.remove();
  document.body.style.overflow = '';
};

/* ==================
   BIND EVENTS
   ================== */
const bindFormEvents = (onSubmit) => {
  const modal = document.getElementById('measure-form-modal');
  const form  = document.getElementById('measure-form');
  if (!modal || !form) return;

  document.getElementById('measure-form-close')
    ?.addEventListener('click', removeModal);
  document.getElementById('measure-form-cancel')
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

  document.getElementById('measure-form-submit')
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
export const openMeasureForm = (riskId, riskName, onSubmit, data = {}) => {
  document.getElementById('measure-form-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', renderForm(riskId, riskName, data));
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    document.getElementById('measure-form-modal')
      ?.classList.add('modal--open');
  });

  bindFormEvents(onSubmit);
};
