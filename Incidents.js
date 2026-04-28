// src/scripts/pages/escalation/Incidents.js

import {
  EVENTS_MOCK,
  EVENT_TYPES,
  EVENT_STATUSES,
  MEASURE_EXECUTION_STATUSES,
  generateEventId,
} from '../../data/escalation.mock.js';

import { RISK_DIRECTIONS } from '../../data/risks.mock.js';

/* ==================
   STATE
   ================== */
let state = {
  events:       [...EVENTS_MOCK],
  searchQuery:  '',
  filterType:   '',
  filterStatus: '',
  currentPage:  1,
  perPage:      10,
  expandedRow:  null,
};

/* ==================
   HELPERS
   ================== */
const badge = (text, cls) =>
  `<span class="badge ${cls}">${text}</span>`;

const iconBtn = (icon, title, action) => `
  <button class="btn btn--ghost btn--icon btn--sm"
    title="${title}"
    data-action="${action}">
    <span class="material-symbols-rounded">${icon}</span>
  </button>
`;

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('uk-UA');
};

const formatMln = (val) => {
  if (!val && val !== 0) return '—';
  return `${val} млн грн`;
};

/* ==================
   TOOLBAR
   ================== */
const renderToolbar = () => `
  <div class="table-toolbar">
    <div class="table-toolbar__left">
      <div class="table-search">
        <span class="table-search__icon material-symbols-rounded">search</span>
        <input
          type="text"
          class="table-search__input"
          id="event-search"
          placeholder="Пошук події..."
          value="${state.searchQuery}"
        />
      </div>

      <select class="measures-filter__select" id="filter-type">
        <option value="">Всі типи</option>
        ${EVENT_TYPES.map(t => `
          <option value="${t}" ${state.filterType === t ? 'selected' : ''}>${t}</option>
        `).join('')}
      </select>

      <select class="measures-filter__select" id="filter-status">
        <option value="">Всі статуси</option>
        ${Object.entries(EVENT_STATUSES).map(([key, val]) => `
          <option value="${key}" ${state.filterStatus === key ? 'selected' : ''}>
            ${val.label}
          </option>
        `).join('')}
      </select>

      ${state.searchQuery || state.filterType || state.filterStatus ? `
        <button class="btn btn--ghost btn--sm" id="clear-filters">
          <span class="material-symbols-rounded">filter_alt_off</span>
          Скинути
        </button>
      ` : ''}
    </div>

    <div class="table-toolbar__right">
      <button class="btn btn--ghost btn--sm" id="export-excel">
        <span class="material-symbols-rounded">table_view</span>
        Excel
      </button>
      <button class="btn btn--ghost btn--sm" id="export-pdf">
        <span class="material-symbols-rounded">picture_as_pdf</span>
        PDF
      </button>
      <button class="btn btn--primary btn--sm" id="add-event">
        <span class="material-symbols-rounded">add</span>
        Додати подію
      </button>
    </div>
  </div>
`;

/* ==================
   ACCORDION DETAILS
   ================== */
const renderDetails = (event) => {
  const totalFinancial = (
    (event.financialImpact?.losses        || 0) +
    (event.financialImpact?.reserve       || 0) +
    (event.financialImpact?.plannedLosses || 0) -
    (event.financialImpact?.compensation  || 0)
  ).toFixed(2);

  return `
    <tr class="risk-details-row">
      <td colspan="7" class="risk-details-cell">
        <div class="risk-details">

          <!-- Блок 1: Звітування -->
          <div class="risk-details__grid risk-details__grid--3">
            <div class="risk-details__group">
              <p class="risk-details__label">Посада особи що звітує</p>
              <p class="risk-details__value">${event.reportPosition || '—'}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">ПІБ особи що звітує</p>
              <p class="risk-details__value">${event.reportPerson || '—'}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Тип ризику</p>
              <p class="risk-details__value">${event.riskType || '—'}</p>
            </div>
          </div>

          <!-- Блок 2: Опис -->
          <div class="risk-details__grid risk-details__grid--1">
            <div class="risk-details__group">
              <p class="risk-details__label">Опис події</p>
              <p class="risk-details__value">${event.description || '—'}</p>
            </div>
          </div>

          <!-- Блок 3: Вжиті заходи -->
          <div class="risk-details__grid risk-details__grid--3">
            <div class="risk-details__group">
              <p class="risk-details__label">Вжиті заходи</p>
              <p class="risk-details__value">${event.takenMeasures || '—'}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Задіяні особи / підрозділи</p>
              <p class="risk-details__value">${event.involvedPersons || '—'}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Нефінансовий / якісний вплив</p>
              <p class="risk-details__value">${event.nonFinancialImpact || '—'}</p>
            </div>
          </div>

          <!-- Блок 4: Фінансовий вплив -->
          <div class="escalation-financial">
            <p class="risk-details__label" style="margin-bottom:var(--spacing-sm)">
              Фінансовий вплив від суттєвої події
            </p>
            <div class="risk-details__grid risk-details__grid--4">
              <div class="risk-details__group">
                <p class="risk-details__label">Втрати</p>
                <p class="risk-details__value escalation-financial__value--danger">
                  ${formatMln(event.financialImpact?.losses)}
                </p>
              </div>
              <div class="risk-details__group">
                <p class="risk-details__label">Резерв</p>
                <p class="risk-details__value">
                  ${formatMln(event.financialImpact?.reserve)}
                </p>
              </div>
              <div class="risk-details__group">
                <p class="risk-details__label">Заплановані втрати</p>
                <p class="risk-details__value">
                  ${formatMln(event.financialImpact?.plannedLosses)}
                </p>
              </div>
              <div class="risk-details__group">
                <p class="risk-details__label">Відшкодування</p>
                <p class="risk-details__value escalation-financial__value--success">
                  ${formatMln(event.financialImpact?.compensation)}
                </p>
              </div>
            </div>
            <div class="escalation-financial__total">
              <span class="escalation-financial__total-label">Загальний фінансовий вплив:</span>
              <span class="escalation-financial__total-value ${Number(totalFinancial) > 0 ? 'escalation-financial__value--danger' : 'escalation-financial__value--success'}">
                ${totalFinancial} млн грн
              </span>
            </div>
          </div>

          <!-- Блок 5: Інші підприємства -->
          ${event.hasOtherCompanies && event.otherCompanies?.length > 0 ? `
            <div class="escalation-companies">
              <p class="risk-details__label" style="margin-bottom:var(--spacing-sm)">
                Вплив на інші підприємства
              </p>
              <div class="escalation-companies__list">
                ${event.otherCompanies.map(c => `
                  <div class="escalation-company-card">
                    <span class="escalation-company-card__name">${c.name}</span>
                    <span class="escalation-company-card__edrpou">ЄДРПОУ: ${c.edrpou}</span>
                    <span class="escalation-company-card__amount">${formatMln(c.amount)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Блок 6: Захід -->
          <div class="risk-details__grid risk-details__grid--4">
            <div class="risk-details__group">
              <p class="risk-details__label">Захід</p>
              <p class="risk-details__value">${event.measure || '—'}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Відповідальний</p>
              <p class="risk-details__value">${event.responsible || '—'}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Строк виконання</p>
              <p class="risk-details__value">${formatDate(event.deadline)}</p>
            </div>
            <div class="risk-details__group">
              <p class="risk-details__label">Стан виконання</p>
              <p class="risk-details__value">${event.executionStatus || '—'}</p>
            </div>
          </div>

          <!-- Блок 7: Затвердження -->
          <div class="risk-details__grid risk-details__grid--1">
            <div class="risk-details__group">
              <p class="risk-details__label">Ким затверджено заходи</p>
              <p class="risk-details__value">${event.approvedBy || '—'}</p>
            </div>
          </div>

        </div>
      </td>
    </tr>
  `;
};

/* ==================
   TABLE ROW
   ================== */
const renderRow = (event, index) => {
  const status = EVENT_STATUSES[event.status];
  const isOpen = state.expandedRow === event.id;

  return `
    <tr class="table__row table__row--clickable ${isOpen ? 'table__row--selected' : ''}"
      data-event-id="${event.id}">
      <td class="table__td table__td--id">${index + 1}</td>
      <td class="table__td">
        <div class="risk-name">
          <span class="material-symbols-rounded risk-name__chevron ${isOpen ? 'risk-name__chevron--open' : ''}">
            chevron_right
          </span>
          <span class="risk-name__text">${event.title}</span>
        </div>
      </td>
      <td class="table__td">${event.description?.slice(0, 60)}${event.description?.length > 60 ? '...' : ''}</td>
      <td class="table__td">${event.eventType}</td>
      <td class="table__td table__td--nowrap">${formatDate(event.eventDate)}</td>
      <td class="table__td table__td--nowrap">${formatDate(event.discoveryDate)}</td>
      <td class="table__td">
        ${badge(status.label, status.class)}
      </td>
      <td class="table__td table__td--actions">
        <div class="table__actions">
          ${iconBtn('edit',   'Редагувати', 'edit'  )}
          ${iconBtn('delete', 'Видалити',   'delete')}
        </div>
      </td>
    </tr>
    ${isOpen ? renderDetails(event) : ''}
  `;
};

/* ==================
   PAGINATION
   ================== */
const renderPagination = (totalPages) => {
  if (totalPages <= 1) return '';
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return `
    <div class="table-pagination">
      <button class="table-pagination__btn"
        data-page="${state.currentPage - 1}"
        ${state.currentPage === 1 ? 'disabled' : ''}>
        <span class="table-pagination__icon material-symbols-rounded">chevron_left</span>
      </button>
      ${pages.map(p => `
        <button
          class="table-pagination__btn ${p === state.currentPage ? 'table-pagination__btn--active' : ''}"
          data-page="${p}">
          ${p}
        </button>
      `).join('')}
      <button class="table-pagination__btn"
        data-page="${state.currentPage + 1}"
        ${state.currentPage === totalPages ? 'disabled' : ''}>
        <span class="table-pagination__icon material-symbols-rounded">chevron_right</span>
      </button>
    </div>
  `;
};

/* ==================
   RENDER PAGE
   ================== */
const renderRegistry = () => {
  let filtered = state.events.filter(e => {
    const q = state.searchQuery.toLowerCase();
    const matchSearch = !q ||
      e.title.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.reportPerson?.toLowerCase().includes(q);

    const matchType   = !state.filterType   || e.eventType === state.filterType;
    const matchStatus = !state.filterStatus || e.status    === state.filterStatus;

    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / state.perPage);
  const start      = (state.currentPage - 1) * state.perPage;
  const paginated  = filtered.slice(start, start + state.perPage);

  const rows = paginated.length
    ? paginated.map((e, i) => renderRow(e, start + i)).join('')
    : `<tr><td colspan="8" class="table__empty">
        <span class="table__empty-icon material-symbols-rounded">inbox</span>
        <p class="table__empty-title">Подій не знайдено</p>
        <p class="table__empty-text">Спробуйте змінити параметри пошуку</p>
       </td></tr>`;

  return `
    <div class="risks-page">
      <div class="page-header">
        <div class="page-header__left">
          <h1 class="page-header__title">Ескалація</h1>
          <p class="page-header__subtitle">Реєстр суттєвих подій підприємства</p>
        </div>
      </div>

      ${renderToolbar()}

      <div class="table-wrapper">
        <table class="table">
          <colgroup>
            <col style="width: 50px"  />
            <col style="width: auto"  />
            <col style="width: 200px" />
            <col style="width: 160px" />
            <col style="width: 120px" />
            <col style="width: 140px" />
            <col style="width: 130px" />
            <col style="width: 90px"  />
          </colgroup>
          <thead class="table__head">
            <tr>
              <th class="table__th">№</th>
              <th class="table__th">Назва події</th>
              <th class="table__th">Опис події</th>
              <th class="table__th">Тип події</th>
              <th class="table__th">Дата події</th>
              <th class="table__th">Дата виявлення</th>
              <th class="table__th">Статус</th>
              <th class="table__th table__th--right">Дії</th>
            </tr>
          </thead>
          <tbody class="table__body">
            ${rows}
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        <p class="table-footer__info">
          Показано ${Math.min(start + 1, filtered.length)}–${Math.min(start + state.perPage, filtered.length)}
          з ${filtered.length} записів
        </p>
        ${renderPagination(totalPages)}
      </div>
    </div>
  `;
};

/* ==================
   EVENTS
   ================== */
const bindEvents = (container) => {
  // Search
  container.querySelector('#event-search')
    ?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      state.currentPage = 1;
      state.expandedRow = null;
      rerender(container);
    });

  // Filter type
  container.querySelector('#filter-type')
    ?.addEventListener('change', (e) => {
      state.filterType  = e.target.value;
      state.currentPage = 1;
      state.expandedRow = null;
      rerender(container);
    });

  // Filter status
  container.querySelector('#filter-status')
    ?.addEventListener('change', (e) => {
      state.filterStatus = e.target.value;
      state.currentPage  = 1;
      state.expandedRow  = null;
      rerender(container);
    });

  // Clear filters
  container.querySelector('#clear-filters')
    ?.addEventListener('click', () => {
      state.searchQuery  = '';
      state.filterType   = '';
      state.filterStatus = '';
      state.currentPage  = 1;
      state.expandedRow  = null;
      rerender(container);
    });

  // Row expand
  container.querySelectorAll('[data-event-id]').forEach(row => {
    if (row.tagName !== 'TR') return;
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-action]')) return;
      const id          = row.dataset.eventId;
      state.expandedRow = state.expandedRow === id ? null : id;
      rerender(container);
    });
  });

  // Actions
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action  = btn.dataset.action;
      const eventId = btn.closest('[data-event-id]').dataset.eventId;
      handleAction(action, eventId, container);
    });
  });

  // Pagination
  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentPage = Number(btn.dataset.page);
      state.expandedRow = null;
      rerender(container);
    });
  });

  // Add event
  container.querySelector('#add-event')
    ?.addEventListener('click', () => {
      openEventForm((newEvent) => {
        state.events.unshift(newEvent);
        state.currentPage = 1;
        rerender(container);
      });
    });

  // Export
  container.querySelector('#export-excel')
    ?.addEventListener('click', () => console.log('[Escalation] Export Excel'));
  container.querySelector('#export-pdf')
    ?.addEventListener('click', () => console.log('[Escalation] Export PDF'));
};

/* ==================
   ACTIONS
   ================== */
const handleAction = (action, eventId, container) => {
  switch (action) {
    case 'edit': {
      const event = state.events.find(e => e.id === eventId);
      if (!event) return;
      openEventForm((updated) => {
        state.events = state.events.map(e => e.id === eventId ? updated : e);
        rerender(container);
      }, { ...event, edit: true });
      break;
    }
    case 'delete': {
      if (confirm('Видалити цю подію?')) {
        state.events      = state.events.filter(e => e.id !== eventId);
        state.expandedRow = null;
        rerender(container);
      }
      break;
    }
  }
};

/* ==================
   RE-RENDER
   ================== */
const rerender = (container) => {
  container.innerHTML = renderRegistry();
  bindEvents(container);
};

/* ==================
   FORM
   ================== */
const openEventForm = (onSubmit, data = {}) => {
  const id = data.id || generateEventId();

  const renderOtherCompanies = (companies = []) => companies.map((c, i) => `
    <div class="escalation-company-row" id="company-row-${i}">
      <input
        type="text"
        class="risk-form__input"
        name="company_${i}_name"
        value="${c.name || ''}"
        placeholder="Назва підприємства"
      />
      <input
        type="text"
        class="risk-form__input"
        name="company_${i}_edrpou"
        value="${c.edrpou || ''}"
        placeholder="Код ЄДРПОУ"
        style="width:140px"
      />
      <input
        type="number"
        class="risk-form__input"
        name="company_${i}_amount"
        value="${c.amount || ''}"
        placeholder="Сума (млн грн)"
        step="0.01"
        style="width:160px"
      />
      <button type="button" class="btn btn--ghost btn--icon btn--sm"
        data-action="remove-company" data-index="${i}">
        <span class="material-symbols-rounded">close</span>
      </button>
    </div>
  `).join('');

  let formCompanies = data.otherCompanies ? [...data.otherCompanies] : [];

  const renderModal = () => `
    <div class="modal-overlay" id="event-form-modal">
      <div class="modal modal--lg">

        <div class="modal__header">
          <div class="modal__title-wrapper">
            <h2 class="modal__title">${data.edit ? 'Редагувати подію' : 'Додати суттєву подію'}</h2>
            <p class="modal__subtitle">ID: <strong>${id}</strong></p>
          </div>
          <button class="modal__close" id="event-form-close">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <div class="modal__body">
          <form class="risk-form" id="event-form" novalidate>
            <input type="hidden" name="id" value="${id}" />

            <!-- Загальна інформація -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Загальна інформація</h3>
              <div class="risk-form__grid">

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">
                    Назва події
                    <span class="risk-form__required">*</span>
                  </label>
                  <input type="text" class="risk-form__input" name="title"
                    value="${data.title || ''}" placeholder="Назва суттєвої події" required />
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">Опис події</label>
                  <textarea class="risk-form__textarea" name="description"
                    rows="3" placeholder="Детальний опис події">${data.description || ''}</textarea>
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">
                    Тип події
                    <span class="risk-form__required">*</span>
                  </label>
                  <select class="risk-form__select" name="eventType" required>
                    <option value="">Оберіть тип</option>
                    ${EVENT_TYPES.map(t => `
                      <option value="${t}" ${data.eventType === t ? 'selected' : ''}>${t}</option>
                    `).join('')}
                  </select>
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">
                    Статус
                    <span class="risk-form__required">*</span>
                  </label>
                  <select class="risk-form__select" name="status" required>
                    <option value="">Оберіть статус</option>
                    ${Object.entries(EVENT_STATUSES).map(([key, val]) => `
                      <option value="${key}" ${data.status === key ? 'selected' : ''}>${val.label}</option>
                    `).join('')}
                  </select>
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">
                    Дата події
                    <span class="risk-form__required">*</span>
                  </label>
                  <input type="date" class="risk-form__input" name="eventDate"
                    value="${data.eventDate || ''}" required />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">Дата виявлення події</label>
                  <input type="date" class="risk-form__input" name="discoveryDate"
                    value="${data.discoveryDate || ''}" />
                </div>

              </div>
            </div>

            <!-- Звітування -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Звітування</h3>
              <div class="risk-form__grid">

                <div class="risk-form__field">
                  <label class="risk-form__label">Посада особи що здійснює звітування</label>
                  <input type="text" class="risk-form__input" name="reportPosition"
                    value="${data.reportPosition || ''}" placeholder="Посада" />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">ПІБ особи що здійснює звітування</label>
                  <input type="text" class="risk-form__input" name="reportPerson"
                    value="${data.reportPerson || ''}" placeholder="ПІБ" />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">Тип ризику</label>
                  <select class="risk-form__select" name="riskType">
                    <option value="">Оберіть тип ризику</option>
                    ${(RISK_DIRECTIONS || [
                      'Фінансова діяльність',
                      'Операційна діяльність',
                      'Кадрова діяльність',
                      'ІТ та кібербезпека',
                      'Compliance',
                      'Репутаційні ризики',
                    ]).map(d => `
                      <option value="${d}" ${data.riskType === d ? 'selected' : ''}>${d}</option>
                    `).join('')}
                  </select>
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">Вжиті заходи</label>
                  <textarea class="risk-form__textarea" name="takenMeasures"
                    rows="2" placeholder="Опишіть вжиті заходи">${data.takenMeasures || ''}</textarea>
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">Задіяні особи / підрозділи</label>
                  <input type="text" class="risk-form__input" name="involvedPersons"
                    value="${data.involvedPersons || ''}" placeholder="Перелік осіб та підрозділів" />
                </div>

              </div>
            </div>

            <!-- Фінансовий вплив -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Фінансовий вплив від суттєвої події (млн грн)</h3>
              <div class="risk-form__grid">

                <div class="risk-form__field">
                  <label class="risk-form__label">Втрати</label>
                  <input type="number" class="risk-form__input" name="fi_losses"
                    value="${data.financialImpact?.losses || ''}" placeholder="0.00" step="0.01" min="0" />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">Резерв</label>
                  <input type="number" class="risk-form__input" name="fi_reserve"
                    value="${data.financialImpact?.reserve || ''}" placeholder="0.00" step="0.01" min="0" />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">Заплановані втрати</label>
                  <input type="number" class="risk-form__input" name="fi_plannedLosses"
                    value="${data.financialImpact?.plannedLosses || ''}" placeholder="0.00" step="0.01" min="0" />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">Відшкодування</label>
                  <input type="number" class="risk-form__input" name="fi_compensation"
                    value="${data.financialImpact?.compensation || ''}" placeholder="0.00" step="0.01" min="0" />
                </div>

              </div>
            </div>

            <!-- Вплив на інші підприємства -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Наявність впливу на інші підприємства</h3>

              <div class="risk-form__field">
                <label class="risk-form__label">Наявність впливу</label>
                <select class="risk-form__select" name="hasOtherCompanies" id="has-other-companies">
                  <option value="no"  ${!data.hasOtherCompanies ? 'selected' : ''}>Ні</option>
                  <option value="yes" ${data.hasOtherCompanies  ? 'selected' : ''}>Так</option>
                </select>
              </div>

              <div id="other-companies-section" style="${data.hasOtherCompanies ? '' : 'display:none'}">
                <div id="companies-list">
                  ${renderOtherCompanies(formCompanies)}
                </div>
                <button type="button" class="btn btn--secondary btn--sm" id="add-company"
                  style="margin-top:var(--spacing-sm)">
                  <span class="material-symbols-rounded">add</span>
                  Додати підприємство
                </button>
              </div>

            </div>

            <!-- Нефінансовий вплив -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Нефінансовий / якісний вплив</h3>
              <div class="risk-form__field">
                <textarea class="risk-form__textarea" name="nonFinancialImpact"
                  rows="3" placeholder="Опишіть нефінансовий та якісний вплив події">${data.nonFinancialImpact || ''}</textarea>
              </div>
            </div>

            <!-- Захід -->
            <div class="risk-form__section">
              <h3 class="risk-form__section-title">Захід</h3>
              <div class="risk-form__grid">

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">Захід</label>
                  <input type="text" class="risk-form__input" name="measure"
                    value="${data.measure || ''}" placeholder="Назва заходу" />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">Відповідальний</label>
                  <input type="text" class="risk-form__input" name="responsible"
                    value="${data.responsible || ''}" placeholder="Підрозділ або особа" />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">Строк виконання</label>
                  <input type="date" class="risk-form__input" name="deadline"
                    value="${data.deadline || ''}" />
                </div>

                <div class="risk-form__field">
                  <label class="risk-form__label">Стан виконання</label>
                  <select class="risk-form__select" name="executionStatus">
                    <option value="">Оберіть стан</option>
                    ${MEASURE_EXECUTION_STATUSES.map(s => `
                      <option value="${s}" ${data.executionStatus === s ? 'selected' : ''}>${s}</option>
                    `).join('')}
                  </select>
                </div>

                <div class="risk-form__field risk-form__field--full">
                  <label class="risk-form__label">Ким затверджено заходи (Посада, № та дата наказу)</label>
                  <input type="text" class="risk-form__input" name="approvedBy"
                    value="${data.approvedBy || ''}" placeholder="Директор, Наказ №__ від дд.мм.рррр" />
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
            <button class="btn btn--ghost" id="event-form-cancel">Скасувати</button>
            <button class="btn btn--primary" id="event-form-submit">
              <span class="material-symbols-rounded">save</span>
              ${data.edit ? 'Зберегти зміни' : 'Додати подію'}
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  const removeModal = () => {
    document.getElementById('event-form-modal')?.remove();
    document.body.style.overflow = '';
  };

  document.getElementById('event-form-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', renderModal());
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    document.getElementById('event-form-modal')?.classList.add('modal--open');
  });

  const modal = document.getElementById('event-form-modal');
  const form  = document.getElementById('event-form');

  // Close
  document.getElementById('event-form-close')
    ?.addEventListener('click', removeModal);
  document.getElementById('event-form-cancel')
    ?.addEventListener('click', removeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) removeModal(); });

  const onEscape = (e) => {
    if (e.key === 'Escape') { removeModal(); document.removeEventListener('keydown', onEscape); }
  };
  document.addEventListener('keydown', onEscape);

  // Toggle other companies
  document.getElementById('has-other-companies')
    ?.addEventListener('change', (e) => {
      const section = document.getElementById('other-companies-section');
      if (section) section.style.display = e.target.value === 'yes' ? '' : 'none';
    });

  // Add company
  document.getElementById('add-company')
    ?.addEventListener('click', () => {
      formCompanies.push({});
      const list = document.getElementById('companies-list');
      if (list) list.innerHTML = renderOtherCompanies(formCompanies);
      bindCompanyEvents();
    });

  const bindCompanyEvents = () => {
    document.querySelectorAll('[data-action="remove-company"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.index);
        formCompanies.splice(index, 1);
        const list = document.getElementById('companies-list');
        if (list) list.innerHTML = renderOtherCompanies(formCompanies);
        bindCompanyEvents();
      });
    });
  };

  bindCompanyEvents();

  // Submit
  document.getElementById('event-form-submit')
    ?.addEventListener('click', () => {
      const fd = new FormData(form);

      const title     = fd.get('title');
      const eventType = fd.get('eventType');
      const status    = fd.get('status');
      const eventDate = fd.get('eventDate');

      if (!title || !eventType || !status || !eventDate) {
        alert('Заповніть обов\'язкові поля: Назва, Тип події, Статус, Дата події');
        return;
      }

      const hasOther  = fd.get('hasOtherCompanies') === 'yes';
      const companies = hasOther
        ? formCompanies.map((_, i) => ({
            name:   fd.get(`company_${i}_name`)   || '',
            edrpou: fd.get(`company_${i}_edrpou`) || '',
            amount: Number(fd.get(`company_${i}_amount`) || 0),
          }))
        : [];

      const result = {
        id:               fd.get('id'),
        title:            fd.get('title'),
        description:      fd.get('description'),
        eventType:        fd.get('eventType'),
        eventDate:        fd.get('eventDate'),
        discoveryDate:    fd.get('discoveryDate'),
        status:           fd.get('status'),
        reportPosition:   fd.get('reportPosition'),
        reportPerson:     fd.get('reportPerson'),
        riskType:         fd.get('riskType'),
        takenMeasures:    fd.get('takenMeasures'),
        involvedPersons:  fd.get('involvedPersons'),
        financialImpact: {
          losses:        Number(fd.get('fi_losses')        || 0),
          reserve:       Number(fd.get('fi_reserve')       || 0),
          plannedLosses: Number(fd.get('fi_plannedLosses') || 0),
          compensation:  Number(fd.get('fi_compensation')  || 0),
        },
        hasOtherCompanies: hasOther,
        otherCompanies:    companies,
        nonFinancialImpact: fd.get('nonFinancialImpact'),
        measure:           fd.get('measure'),
        responsible:       fd.get('responsible'),
        deadline:          fd.get('deadline'),
        executionStatus:   fd.get('executionStatus'),
        approvedBy:        fd.get('approvedBy'),
        createdAt:         data.createdAt || new Date().toISOString(),
      };

      onSubmit(result);
      removeModal();
    });
};

/* ==================
   INIT
   ================== */
const Incidents = async (container) => {
  state = {
    events:       [...EVENTS_MOCK],
    searchQuery:  '',
    filterType:   '',
    filterStatus: '',
    currentPage:  1,
    perPage:      10,
    expandedRow:  null,
  };

  container.innerHTML = renderRegistry();
  bindEvents(container);
};

export default Incidents;
