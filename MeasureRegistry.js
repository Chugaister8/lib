// src/scripts/pages/risks/MeasureRegistry.js

import { RISKS_MOCK, PROBABILITY_LEVELS, IMPACT_LEVELS, getRiskLevel } from '../../data/risks.mock.js';
import { MEASURE_STATUSES } from '../../data/measures.mock.js';

// Спільний state з Risks.js — передається ззовні
let state = {
  searchQuery:  '',
  filterStatus: '',
  filterRisk:   '',
  filterDept:   '',
  currentPage:  1,
  perPage:      10,
  expandedRow:  null,
  risks:        [],
  measures:     {},
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

const isOverdue = (measure) =>
  measure.status !== 'DONE' &&
  measure.status !== 'CANCELLED' &&
  new Date(measure.deadline) < new Date();

/* ==================
   FLATTEN MEASURES
   ================== */
const getAllMeasures = () => {
  const result = [];
  Object.entries(state.measures).forEach(([riskId, measures]) => {
    const risk = state.risks.find(r => r.id === Number(riskId));
    if (!risk) return;
    measures.forEach(m => result.push({ ...m, risk }));
  });
  return result;
};

/* ==================
   FILTERS
   ================== */
const getFilteredMeasures = () => {
  let all = getAllMeasures();

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    all = all.filter(m =>
      m.title.toLowerCase().includes(q)           ||
      m.risk.riskName.toLowerCase().includes(q)   ||
      m.responsible.toLowerCase().includes(q)     ||
      m.id.toLowerCase().includes(q)
    );
  }

  if (state.filterStatus) {
    all = all.filter(m => m.status === state.filterStatus);
  }

  if (state.filterRisk) {
    all = all.filter(m => m.risk.id === Number(state.filterRisk));
  }

  if (state.filterDept) {
    all = all.filter(m =>
      m.responsible.toLowerCase().includes(state.filterDept.toLowerCase())
    );
  }

  return all;
};

/* ==================
   TOOLBAR
   ================== */
const renderToolbar = () => {
  const allMeasures = getAllMeasures();
  const depts = [...new Set(allMeasures.map(m => m.responsible))].sort();

  return `
    <div class="table-toolbar">
      <div class="table-toolbar__left">

        <div class="table-search">
          <span class="table-search__icon material-symbols-rounded">search</span>
          <input
            type="text"
            class="table-search__input"
            id="measure-search"
            placeholder="Пошук заходу..."
            value="${state.searchQuery}"
          />
        </div>

        <select class="measures-filter__select" id="filter-status">
          <option value="">Всі статуси</option>
          ${Object.entries(MEASURE_STATUSES).map(([key, val]) => `
            <option value="${key}" ${state.filterStatus === key ? 'selected' : ''}>
              ${val.label}
            </option>
          `).join('')}
        </select>

        <select class="measures-filter__select" id="filter-risk">
          <option value="">Всі ризики</option>
          ${state.risks.map(r => `
            <option value="${r.id}" ${state.filterRisk === String(r.id) ? 'selected' : ''}>
              ${r.riskName}
            </option>
          `).join('')}
        </select>

        <select class="measures-filter__select" id="filter-dept">
          <option value="">Всі підрозділи</option>
          ${depts.map(d => `
            <option value="${d}" ${state.filterDept === d ? 'selected' : ''}>${d}</option>
          `).join('')}
        </select>

        ${state.filterStatus || state.filterRisk || state.filterDept || state.searchQuery ? `
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
      </div>
    </div>
  `;
};

/* ==================
   ACCORDION DETAILS
   ================== */
const renderDetails = (measure) => {
  const risk    = measure.risk;
  const prob    = PROBABILITY_LEVELS[risk.probability];
  const finImp  = IMPACT_LEVELS[risk.financialImpact];
  const nfinImp = IMPACT_LEVELS[risk.nonFinancialImpact];
  const level   = getRiskLevel(risk.riskScore);

  return `
    <tr class="risk-details-row">
      <td colspan="9" class="risk-details-cell">
        <div class="risk-details">

          <!-- Захід -->
          <div class="measures-details__section">
            <p class="measures-details__section-title">
              <span class="material-symbols-rounded">task_alt</span>
              Деталі заходу
            </p>
            <div class="risk-details__grid risk-details__grid--3">
              <div class="risk-details__group">
                <p class="risk-details__label">Опис заходу</p>
                <p class="risk-details__value">${measure.desc || '—'}</p>
              </div>
              <div class="risk-details__group">
                <p class="risk-details__label">Чим затверджено</p>
                <p class="risk-details__value">${measure.approvedBy || '—'}</p>
              </div>
              <div class="risk-details__group">
                <p class="risk-details__label">Опис виконаних дій</p>
                <p class="risk-details__value">${measure.executionDesc || '—'}</p>
              </div>
            </div>
          </div>

          <!-- Ризик -->
          <div class="measures-details__section">
            <p class="measures-details__section-title">
              <span class="material-symbols-rounded">warning</span>
              Пов'язаний ризик
            </p>

            <div class="risk-details__grid risk-details__grid--1">
              <div class="risk-details__group">
                <p class="risk-details__label">Інструмент ідентифікації ризику</p>
                <p class="risk-details__value">${risk.instrument}</p>
              </div>
            </div>

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

            <div class="risk-details__grid risk-details__grid--1">
              <div class="risk-details__group">
                <p class="risk-details__label">Опис рівня ризику</p>
                <p class="risk-details__value">${risk.riskLevelDesc}</p>
              </div>
            </div>

            <div class="risk-details__grid risk-details__grid--3">
              <div class="risk-details__group">
                <p class="risk-details__label">Фактичні втрати за 3 роки</p>
                <p class="risk-details__value">${risk.actualLosses}</p>
              </div>
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
const renderRow = (measure, index) => {
  const status    = MEASURE_STATUSES[measure.status];
  const level     = getRiskLevel(measure.risk.riskScore);
  const overdue   = isOverdue(measure);
  const isOpen    = state.expandedRow === measure.id;

  return `
    <tr class="table__row table__row--clickable ${isOpen ? 'table__row--selected' : ''}"
      data-measure-id="${measure.id}">
      <td class="table__td table__td--id">${index + 1}</td>
      <td class="table__td table__td--id">${measure.id}</td>
      <td class="table__td">
        <div class="risk-name">
          <span class="material-symbols-rounded risk-name__chevron ${isOpen ? 'risk-name__chevron--open' : ''}">
            chevron_right
          </span>
          <span class="risk-name__text">${measure.title}</span>
        </div>
      </td>
      <td class="table__td">
        <div class="measures-risk-link">
          ${badge(level.label, level.class)}
          <span class="measures-risk-link__name">${measure.risk.riskName}</span>
        </div>
      </td>
      <td class="table__td">${measure.responsible}</td>
      <td class="table__td table__td--nowrap ${overdue ? 'measures-overdue' : ''}">
        <span class="material-symbols-rounded measures-deadline-icon">calendar_today</span>
        ${formatDate(measure.deadline)}
      </td>
      <td class="table__td">${measure.approvedBy || '—'}</td>
      <td class="table__td">
        ${badge(status.label, status.class)}
        ${overdue ? badge('Прострочено', 'badge--danger') : ''}
      </td>
      <td class="table__td table__td--actions">
        <div class="table__actions">
          ${iconBtn('edit',   'Редагувати', 'edit'  )}
          ${iconBtn('delete', 'Видалити',   'delete')}
        </div>
      </td>
    </tr>
    ${isOpen ? renderDetails(measure) : ''}
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
   RENDER REGISTRY
   ================== */
const renderMeasureRegistry = () => {
  const filtered   = getFilteredMeasures();
  const totalPages = Math.ceil(filtered.length / state.perPage);
  const start      = (state.currentPage - 1) * state.perPage;
  const paginated  = filtered.slice(start, start + state.perPage);

  const rows = paginated.length
    ? paginated.map((m, i) => renderRow(m, start + i)).join('')
    : `<tr><td colspan="9" class="table__empty">
        <span class="table__empty-icon material-symbols-rounded">inbox</span>
        <p class="table__empty-title">Заходів не знайдено</p>
        <p class="table__empty-text">Спробуйте змінити параметри пошуку або фільтри</p>
       </td></tr>`;

  return `
    ${renderToolbar()}
    <div class="table-wrapper">
      <table class="table">
        <colgroup>
          <col style="width: 50px"  />
          <col style="width: 120px" />
          <col style="width: auto"  />
          <col style="width: 220px" />
          <col style="width: 160px" />
          <col style="width: 130px" />
          <col style="width: 160px" />
          <col style="width: 140px" />
          <col style="width: 90px"  />
        </colgroup>
        <thead class="table__head">
          <tr>
            <th class="table__th">№</th>
            <th class="table__th">ID</th>
            <th class="table__th">Назва заходу</th>
            <th class="table__th">Пов'язаний ризик</th>
            <th class="table__th">Відповідальний підрозділ</th>
            <th class="table__th">Строк виконання</th>
            <th class="table__th">Чим затверджено</th>
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
  `;
};

/* ==================
   EVENTS
   ================== */
const bindEvents = (container, onUpdate) => {
  // Search
  container.querySelector('#measure-search')
    ?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      state.currentPage = 1;
      state.expandedRow = null;
      rerender(container, onUpdate);
    });

  // Filter status
  container.querySelector('#filter-status')
    ?.addEventListener('change', (e) => {
      state.filterStatus = e.target.value;
      state.currentPage  = 1;
      state.expandedRow  = null;
      rerender(container, onUpdate);
    });

  // Filter risk
  container.querySelector('#filter-risk')
    ?.addEventListener('change', (e) => {
      state.filterRisk  = e.target.value;
      state.currentPage = 1;
      state.expandedRow = null;
      rerender(container, onUpdate);
    });

  // Filter dept
  container.querySelector('#filter-dept')
    ?.addEventListener('change', (e) => {
      state.filterDept  = e.target.value;
      state.currentPage = 1;
      state.expandedRow = null;
      rerender(container, onUpdate);
    });

  // Clear filters
  container.querySelector('#clear-filters')
    ?.addEventListener('click', () => {
      state.searchQuery = '';
      state.filterStatus = '';
      state.filterRisk   = '';
      state.filterDept   = '';
      state.currentPage  = 1;
      state.expandedRow  = null;
      rerender(container, onUpdate);
    });

  // Row expand
  container.querySelectorAll('[data-measure-id]').forEach(row => {
    if (row.tagName !== 'TR') return;
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-action]')) return;
      const id          = row.dataset.measureId;
      state.expandedRow = state.expandedRow === id ? null : id;
      rerender(container, onUpdate);
    });
  });

  // Actions
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action    = btn.dataset.action;
      const measureId = btn.closest('[data-measure-id]').dataset.measureId;
      handleAction(action, measureId, container, onUpdate);
    });
  });

  // Pagination
  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentPage = Number(btn.dataset.page);
      state.expandedRow = null;
      rerender(container, onUpdate);
    });
  });

  // Export
  container.querySelector('#export-excel')
    ?.addEventListener('click', () => console.log('[Measures] Export Excel'));
  container.querySelector('#export-pdf')
    ?.addEventListener('click', () => console.log('[Measures] Export PDF'));
};

/* ==================
   ACTIONS
   ================== */
const handleAction = (action, measureId, container, onUpdate) => {
  switch (action) {
    case 'edit':
      console.log('[Measures] Edit:', measureId);
      break;
    case 'delete':
      if (confirm('Видалити цей захід?')) {
        Object.keys(state.measures).forEach(riskId => {
          state.measures[riskId] = state.measures[riskId]
            .filter(m => m.id !== measureId);
        });
        state.expandedRow = null;
        if (onUpdate) onUpdate(state.measures);
        rerender(container, onUpdate);
      }
      break;
  }
};

/* ==================
   RE-RENDER
   ================== */
const rerender = (container, onUpdate) => {
  container.innerHTML = renderMeasureRegistry();
  bindEvents(container, onUpdate);
};

/* ==================
   EXPORT
   ================== */
export const initMeasureRegistry = (container, risks, measures, onUpdate) => {
  state = {
    searchQuery:  '',
    filterStatus: '',
    filterRisk:   '',
    filterDept:   '',
    currentPage:  1,
    perPage:      10,
    expandedRow:  null,
    risks,
    measures: { ...measures },
  };

  rerender(container, onUpdate);
};

export const updateMeasureRegistry = (container, risks, measures) => {
  state.risks    = risks;
  state.measures = { ...measures };
  rerender(container, () => {});
};
