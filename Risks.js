// src/scripts/pages/risks/Risks.js

import {
  RISKS_MOCK,
  RISK_STATUSES,
  PROBABILITY_LEVELS,
  IMPACT_LEVELS,
  getRiskLevel,
} from '../../data/risks.mock.js';

import { createRiskMatrix } from '../../components/RiskMatrix.js';
import { openRiskForm }     from '../../components/RiskForm.js';
import { openMeasureForm }  from '../../components/MeasureForm.js';
import { MEASURE_STATUSES } from '../../data/measures.mock.js';

const TABS = [
  { id: 'registry', label: 'Реєстр ризиків'        },
  { id: 'measures', label: 'Реєстр планів заходів'  },
  { id: 'thematic', label: 'База тематичних оцінок' },
];

let state = {
  activeTab:    'registry',
  expandedRow:  null,
  searchQuery:  '',
  currentPage:  1,
  perPage:      10,
  matrixFilter: null,
  risks:        [...RISKS_MOCK],
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

/* ==================
   TABS
   ================== */
const renderTabs = () => `
  <div class="risks-tabs">
    ${TABS.map(tab => `
      <button
        class="risks-tab ${state.activeTab === tab.id ? 'risks-tab--active' : ''}"
        data-tab="${tab.id}">
        ${tab.label}
      </button>
    `).join('')}
  </div>
`;

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
          id="risk-search"
          placeholder="Пошук ризику..."
          value="${state.searchQuery}"
        />
      </div>
      ${state.matrixFilter ? `
        <div class="risks-filter-badge">
          <span class="material-symbols-rounded">filter_alt</span>
          Фільтр матриці активний
          <button class="risks-filter-badge__clear" id="clear-matrix-filter">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>
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
      <button class="btn btn--primary btn--sm" id="add-risk">
        <span class="material-symbols-rounded">add</span>
        Додати ризик
      </button>
    </div>
  </div>
`;

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
   MEASURE CARD
   ================== */
const renderMeasureCard = (measure) => {
  const status   = MEASURE_STATUSES[measure.status];
  const deadline = new Date(measure.deadline).toLocaleDateString('uk-UA');
  const isOverdue = measure.status !== 'DONE' &&
                    measure.status !== 'CANCELLED' &&
                    new Date(measure.deadline) < new Date();

  return `
    <div class="measure-card" data-measure-id="${measure.id}">
      <div class="measure-card__header">
        <div class="measure-card__meta">
          <span class="measure-card__id">${measure.id}</span>
          <span class="badge ${status.class}">${status.label}</span>
          ${isOverdue ? `<span class="badge badge--danger">Прострочено</span>` : ''}
        </div>
        <div class="measure-card__actions">
          <button class="btn btn--ghost btn--icon btn--sm"
            title="Редагувати"
            data-action="edit-measure"
            data-measure-id="${measure.id}"
            data-risk-id="${measure.riskId}">
            <span class="material-symbols-rounded">edit</span>
          </button>
          <button class="btn btn--ghost btn--icon btn--sm"
            title="Видалити"
            data-action="delete-measure"
            data-measure-id="${measure.id}"
            data-risk-id="${measure.riskId}">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>
      </div>

      <p class="measure-card__title">${measure.title}</p>
      <p class="measure-card__desc">${measure.desc}</p>

      <div class="measure-card__footer">
        <div class="measure-card__info">
          <span class="material-symbols-rounded">group</span>
          ${measure.responsible}
        </div>
        <div class="measure-card__info ${isOverdue ? 'measure-card__info--danger' : ''}">
          <span class="material-symbols-rounded">calendar_today</span>
          до ${deadline}
        </div>
        ${measure.approvedBy && measure.approvedBy !== '—' ? `
          <div class="measure-card__info">
            <span class="material-symbols-rounded">gavel</span>
            ${measure.approvedBy}
          </div>
        ` : ''}
      </div>

      ${measure.executionDesc ? `
        <div class="measure-card__execution">
          <p class="measure-card__execution-label">Виконані дії:</p>
          <p class="measure-card__execution-text">${measure.executionDesc}</p>
        </div>
      ` : ''}
    </div>
  `;
};

/* ==================
   ACCORDION DETAILS
   ================== */
const renderDetails = (risk) => {
  const prob     = PROBABILITY_LEVELS[risk.probability];
  const finImp   = IMPACT_LEVELS[risk.financialImpact];
  const nfinImp  = IMPACT_LEVELS[risk.nonFinancialImpact];
  const level    = getRiskLevel(risk.riskScore);
  const measures = state.measures[risk.id] || [];

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

          <!-- Рядок 6: Втрати -->
          <div class="risk-details__grid risk-details__grid--3">
            <div class="risk-details__group">
              <p class="risk-details__label">Фактичні втрати за 3 роки</p>
              <p class="risk-details__value">${risk.actualLosses}</p>
            </div>
          </div>

          <!-- Заходи мінімізації -->
          <div class="risk-measures">
            <div class="risk-measures__header">
              <p class="risk-measures__title">
                <span class="material-symbols-rounded">task_alt</span>
                Заходи мінімізації
                ${measures.length
                  ? `<span class="badge badge--primary">${measures.length}</span>`
                  : ''
                }
              </p>
              <button
                class="btn btn--primary btn--sm"
                data-action="add-measure"
                data-risk-id="${risk.id}">
                <span class="material-symbols-rounded">add</span>
                Додати захід
              </button>
            </div>

            ${measures.length ? `
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

        </div>
      </td>
    </tr>
  `;
};

/* ==================
   TABLE ROW
   ================== */
const renderRow = (risk) => {
  const level  = getRiskLevel(risk.riskScore);
  const prob   = PROBABILITY_LEVELS[risk.probability];
  const status = RISK_STATUSES[risk.status];
  const isOpen = state.expandedRow === risk.id;

  return `
    <tr class="table__row table__row--clickable ${isOpen ? 'table__row--selected' : ''}"
      data-risk-id="${risk.id}">
      <td class="table__td table__td--id">${risk.id}</td>
      <td class="table__td">
        <div class="risk-name">
          <span class="material-symbols-rounded risk-name__chevron ${isOpen ? 'risk-name__chevron--open' : ''}">
            chevron_right
          </span>
          <span class="risk-name__text">${risk.riskName}</span>
        </div>
      </td>
      <td class="table__td">${risk.direction}</td>
      <td class="table__td table__td--center">
        ${badge(risk.probability, prob.class)}
      </td>
      <td class="table__td table__td--center">
        <strong>${risk.riskScore}</strong>
      </td>
      <td class="table__td">
        ${badge(level.label, level.class)}
      </td>
      <td class="table__td">
        ${badge(status.label, status.class)}
      </td>
      <td class="table__td table__td--actions">
        <div class="table__actions">
          ${iconBtn('edit',         'Редагувати', 'edit'  )}
          ${iconBtn('content_copy', 'Копіювати',  'copy'  )}
          ${iconBtn('delete',       'Видалити',   'delete')}
        </div>
      </td>
    </tr>
    ${isOpen ? renderDetails(risk) : ''}
  `;
};

/* ==================
   REGISTRY TAB
   ================== */
const renderRegistry = () => {
  let filtered = state.risks.filter(r =>
    r.riskName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    r.direction.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  if (state.matrixFilter) {
    filtered = filtered.filter(r =>
      r.probability     === state.matrixFilter.probability &&
      r.financialImpact === state.matrixFilter.impact
    );
  }

  const totalPages = Math.ceil(filtered.length / state.perPage);
  const start      = (state.currentPage - 1) * state.perPage;
  const paginated  = filtered.slice(start, start + state.perPage);

  const rows = paginated.length
    ? paginated.map(renderRow).join('')
    : `<tr><td colspan="8" class="table__empty">
        <span class="table__empty-icon material-symbols-rounded">inbox</span>
        <p class="table__empty-title">Ризиків не знайдено</p>
        <p class="table__empty-text">Спробуйте змінити параметри пошуку</p>
       </td></tr>`;

  return `
    <div class="risks-layout">
      <div class="risks-layout__main">
        ${renderToolbar()}
        <div class="table-wrapper">
          <table class="table">
            <colgroup>
              <col style="width: 60px"  />
              <col style="width: auto"  />
              <col style="width: 180px" />
              <col style="width: 120px" />
              <col style="width: 110px" />
              <col style="width: 130px" />
              <col style="width: 130px" />
              <col style="width: 120px" />
            </colgroup>
            <thead class="table__head">
              <tr>
                <th class="table__th">№</th>
                <th class="table__th">Назва ризику</th>
                <th class="table__th">Напрям діяльності</th>
                <th class="table__th table__th--center">Імовірність</th>
                <th class="table__th table__th--center">Рівень (бал)</th>
                <th class="table__th">Рівень ризику</th>
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

      <div class="risks-layout__matrix" id="risk-matrix-container"></div>
    </div>
  `;
};

/* ==================
   PLACEHOLDER
   ================== */
const renderPlaceholder = (title) => `
  <div class="risks-placeholder">
    <span class="risks-placeholder__icon material-symbols-rounded">construction</span>
    <p class="risks-placeholder__title">${title}</p>
    <p class="risks-placeholder__text">Розділ в розробці</p>
  </div>
`;

/* ==================
   TAB CONTENT
   ================== */
const renderTabContent = () => {
  switch (state.activeTab) {
    case 'registry': return renderRegistry();
    case 'measures': return renderPlaceholder('Реєстр планів заходів');
    case 'thematic': return renderPlaceholder('База тематичних оцінок');
    default:         return renderRegistry();
  }
};

/* ==================
   PAGE
   ================== */
const renderPage = () => `
  <div class="risks-page">
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title">Ризики</h1>
        <p class="page-header__subtitle">Управління ризиками підприємства</p>
      </div>
    </div>
    ${renderTabs()}
    <div class="risks-content" id="risks-content">
      ${renderTabContent()}
    </div>
  </div>
`;

/* ==================
   ACTIONS
   ================== */
const handleAction = (action, id, container) => {
  switch (action) {
    case 'edit': {
      const risk = state.risks.find(r => r.id === id);
      if (!risk) return;
      openRiskForm((updated) => {
        state.risks = state.risks.map(r => r.id === id ? { ...r, ...updated } : r);
        rerenderContent(container);
      }, { ...risk, edit: true });
      break;
    }
    case 'copy': {
      const risk = state.risks.find(r => r.id === id);
      if (risk) {
        const copy = {
          ...risk,
          id:       Date.now(),
          riskName: `${risk.riskName} (копія)`,
        };
        state.risks.push(copy);
        rerenderContent(container);
      }
      break;
    }
    case 'delete': {
      if (confirm('Видалити цей ризик?')) {
        state.risks       = state.risks.filter(r => r.id !== id);
        state.expandedRow = null;
        delete state.measures[id];
        rerenderContent(container);
      }
      break;
    }
  }
};

/* ==================
   EVENTS
   ================== */
const bindEvents = (container) => {
  // Tabs
  container.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab    = btn.dataset.tab;
      state.expandedRow  = null;
      state.currentPage  = 1;
      state.matrixFilter = null;
      rerender(container);
    });
  });

  // Search
  container.querySelector('#risk-search')
    ?.addEventListener('input', (e) => {
      state.searchQuery  = e.target.value;
      state.currentPage  = 1;
      state.expandedRow  = null;
      rerenderContent(container);
    });

  // Clear matrix filter
  container.querySelector('#clear-matrix-filter')
    ?.addEventListener('click', () => {
      state.matrixFilter = null;
      state.currentPage  = 1;
      rerenderContent(container);
    });

  // Row expand
  container.querySelectorAll('[data-risk-id]').forEach(row => {
    if (row.tagName !== 'TR') return;
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-action]')) return;
      const id          = Number(row.dataset.riskId);
      state.expandedRow = state.expandedRow === id ? null : id;
      rerenderContent(container);
    });
  });

  // Risk actions (edit, copy, delete)
  container.querySelectorAll('[data-action="edit"], [data-action="copy"], [data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const id     = Number(btn.closest('[data-risk-id]').dataset.riskId);
      handleAction(action, id, container);
    });
  });

  // Pagination
  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentPage = Number(btn.dataset.page);
      state.expandedRow = null;
      rerenderContent(container);
    });
  });

  // Export
  container.querySelector('#export-excel')
    ?.addEventListener('click', () => console.log('[Risks] Export Excel'));
  container.querySelector('#export-pdf')
    ?.addEventListener('click', () => console.log('[Risks] Export PDF'));

  // Add risk
  container.querySelector('#add-risk')
    ?.addEventListener('click', () => {
      openRiskForm((newRisk) => {
        state.risks.unshift(newRisk);
        state.currentPage = 1;
        rerenderContent(container);
      });
    });

  // Add measure
  container.querySelectorAll('[data-action="add-measure"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const riskId = Number(btn.dataset.riskId);
      const risk   = state.risks.find(r => r.id === riskId);
      if (!risk) return;

      openMeasureForm(riskId, risk.riskName, (measure) => {
        if (!state.measures[riskId]) state.measures[riskId] = [];
        state.measures[riskId].push(measure);
        rerenderContent(container);
      });
    });
  });

  // Edit measure
  container.querySelectorAll('[data-action="edit-measure"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const riskId    = Number(btn.dataset.riskId);
      const measureId = btn.dataset.measureId;
      const risk      = state.risks.find(r => r.id === riskId);
      const measure   = state.measures[riskId]?.find(m => m.id === measureId);
      if (!risk || !measure) return;

      openMeasureForm(riskId, risk.riskName, (updated) => {
        state.measures[riskId] = state.measures[riskId]
          .map(m => m.id === measureId ? updated : m);
        rerenderContent(container);
      }, { ...measure, edit: true });
    });
  });

  // Delete measure
  container.querySelectorAll('[data-action="delete-measure"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const riskId    = Number(btn.dataset.riskId);
      const measureId = btn.dataset.measureId;
      if (confirm('Видалити цей захід?')) {
        state.measures[riskId] = state.measures[riskId]
          .filter(m => m.id !== measureId);
        rerenderContent(container);
      }
    });
  });

  // Matrix
  const matrixContainer = container.querySelector('#risk-matrix-container');
  if (matrixContainer) {
    createRiskMatrix(
      matrixContainer,
      state.risks,
      (filter) => {
        state.matrixFilter = filter;
        state.currentPage  = 1;
        state.expandedRow  = null;
        rerenderContent(container);
      }
    );
  }
};

/* ==================
   RE-RENDER
   ================== */
const rerender = (container) => {
  container.innerHTML = renderPage();
  bindEvents(container);
};

const rerenderContent = (container) => {
  const content = container.querySelector('#risks-content');
  if (!content) return;
  content.innerHTML = renderTabContent();
  bindEvents(container);
};

/* ==================
   INIT
   ================== */
const Risks = async (container) => {
  state = {
    activeTab:    'registry',
    expandedRow:  null,
    searchQuery:  '',
    currentPage:  1,
    perPage:      10,
    matrixFilter: null,
    risks:        [...RISKS_MOCK],
    measures:     {},
  };

  container.innerHTML = renderPage();
  bindEvents(container);
};

export default Risks;
