// src/scripts/pages/risks/Risks.js

import {
  RISKS_MOCK,
  RISK_STATUSES,
  PROBABILITY_LEVELS,
  IMPACT_LEVELS,
  getRiskLevel,
} from '../../data/risks.mock.js';

const TABS = [
  { id: 'registry', label: 'Реєстр ризиків'        },
  { id: 'measures', label: 'Реєстр планів заходів'  },
  { id: 'thematic', label: 'База тематичних оцінок' },
];

let state = {
  activeTab:   'registry',
  expandedRow: null,
  searchQuery: '',
  currentPage: 1,
  perPage:     10,
  risks:       [...RISKS_MOCK],
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
   RISK MATRIX
   ================== */
const MATRIX_COLORS = {
  'Критичний':    '#7c3aed',
  'Дуже високий': '#dc2626',
  'Високий':      '#d97706',
  'Середній':     '#ca8a04',
  'Низький':      '#16a34a',
};

// Колір клітинки матриці (імовірність × вплив)
const getCellColor = (prob, impact) => {
  const score = prob * impact;
  const level = getRiskLevel(score);
  const colors = {
    'Критичний':    '#4c1d95',
    'Дуже високий': '#7f1d1d',
    'Високий':      '#78350f',
    'Середній':     '#713f12',
    'Низький':      '#14532d',
  };
  return colors[level.label] ?? '#1e293b';
};

const renderMatrix = () => {
  const risks = state.risks;

  // Групуємо ризики по клітинках (prob, impact)
  const risksByCell = {};
  risks.forEach(r => {
    const impact = Math.max(r.financialImpact, r.nonFinancialImpact);
    const key    = `${r.probability}-${impact}`;
    if (!risksByCell[key]) risksByCell[key] = [];
    risksByCell[key].push(r);
  });

  // Рядки: імовірність 4→1 (зверху вниз)
  // Колонки: вплив 1→5 (зліва направо)
  const probs   = [4, 3, 2, 1];
  const impacts = [1, 2, 3, 4, 5];

  const probLabels = {
    4: 'Дуже\nвисокий',
    3: 'Високий',
    2: 'Середній',
    1: 'Низький',
  };

  const impactLabels = {
    1: 'Низький',
    2: 'Середній',
    3: 'Високий',
    4: 'Дуже\nвисокий',
    5: 'Критичний',
  };

  const rows = probs.map(prob => {
    const cells = impacts.map(impact => {
      const score      = prob * impact;
      const level      = getRiskLevel(score);
      const cellColor  = getCellColor(prob, impact);
      const key        = `${prob}-${impact}`;
      const cellRisks  = risksByCell[key] ?? [];

      const dots = cellRisks.map(r => `
        <div class="matrix__dot"
          style="background-color: ${MATRIX_COLORS[level.label] ?? '#fff'}"
          title="${r.riskName} (бал: ${r.riskScore})"
          data-risk-id="${r.id}">
          ${r.id}
        </div>
      `).join('');

      return `
        <td class="matrix__cell"
          style="background-color: ${cellColor}"
          data-prob="${prob}"
          data-impact="${impact}">
          <div class="matrix__cell-inner">
            <span class="matrix__score">${score}</span>
            <div class="matrix__dots">${dots}</div>
          </div>
        </td>
      `;
    }).join('');

    return `
      <tr>
        <td class="matrix__label matrix__label--row">
          <span>${probLabels[prob]}</span>
          <strong>${prob}</strong>
        </td>
        ${cells}
      </tr>
    `;
  }).join('');

  const impactHeaders = impacts.map(i => `
    <th class="matrix__label matrix__label--col">
      <strong>${i}</strong>
      <span>${impactLabels[i]}</span>
    </th>
  `).join('');

  return `
    <div class="matrix-card">
      <div class="matrix-card__header">
        <p class="matrix-card__title">Матриця ризиків</p>
        <p class="matrix-card__subtitle">Імовірність × Вплив</p>
      </div>
      <div class="matrix-card__body">
        <table class="matrix">
          <thead>
            <tr>
              <th class="matrix__corner">
                <span class="matrix__corner-y">Імовірність</span>
                <span class="matrix__corner-x">Вплив</span>
              </th>
              ${impactHeaders}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <div class="matrix-card__legend">
        ${Object.entries(MATRIX_COLORS).map(([label, color]) => `
          <div class="matrix-legend__item">
            <span class="matrix-legend__dot" style="background-color:${color}"></span>
            <span class="matrix-legend__label">${label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

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
   ACCORDION DETAILS
   ================== */
const renderDetails = (risk) => {
  const prob    = PROBABILITY_LEVELS[risk.probability];
  const finImp  = IMPACT_LEVELS[risk.financialImpact];
  const nfinImp = IMPACT_LEVELS[risk.nonFinancialImpact];

  return `
    <tr class="risk-details-row" id="details-${risk.id}">
      <td colspan="8" class="risk-details-cell">
        <div class="risk-details">
          <div class="risk-details__grid">

            <div class="risk-details__group">
              <p class="risk-details__label">Код ЄДРПОУ</p>
              <p class="risk-details__value">${risk.edrpou}</p>
            </div>

            <div class="risk-details__group">
              <p class="risk-details__label">Інструмент ідентифікації</p>
              <p class="risk-details__value">${risk.instrument}</p>
            </div>

            <div class="risk-details__group">
              <p class="risk-details__label">Назва процесу</p>
              <p class="risk-details__value">${risk.processName}</p>
            </div>

            <div class="risk-details__group">
              <p class="risk-details__label">Джерело інформації</p>
              <p class="risk-details__value">${risk.infoSource}</p>
            </div>

            <div class="risk-details__group risk-details__group--full">
              <p class="risk-details__label">Опис процесу</p>
              <p class="risk-details__value">${risk.processDesc}</p>
            </div>

            <div class="risk-details__group risk-details__group--full">
              <p class="risk-details__label">Назва ВНД та дата затвердження</p>
              <p class="risk-details__value">${risk.vndName}</p>
            </div>

            <div class="risk-details__group risk-details__group--full">
              <p class="risk-details__label">Опис ризику</p>
              <p class="risk-details__value">${risk.riskDesc}</p>
            </div>

            <div class="risk-details__group risk-details__group--full">
              <p class="risk-details__label">Опис інформації з джерела</p>
              <p class="risk-details__value">${risk.infoSourceDesc}</p>
            </div>

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
              <p class="risk-details__label">Фактичні втрати за 3 роки</p>
              <p class="risk-details__value">${risk.actualLosses}</p>
            </div>

            <div class="risk-details__group risk-details__group--full">
              <p class="risk-details__label">Опис рівня ризику</p>
              <p class="risk-details__value">${risk.riskLevelDesc}</p>
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
      <td class="table__td table__td--center">
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
  const filtered = state.risks.filter(r =>
    r.riskName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    r.direction.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

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

      <!-- Ліва частина: toolbar + таблиця -->
      <div class="risks-layout__main">
        ${renderToolbar()}
        <div class="table-wrapper">
          <table class="table">
            <colgroup>
              <col style="width: 55px"  />
              <col style="width: auto"  />
              <col style="width: 170px" />
              <col style="width: 110px" />
              <col style="width: 100px" />
              <col style="width: 120px" />
              <col style="width: 120px" />
              <col style="width: 110px" />
            </colgroup>
            <thead class="table__head">
              <tr>
                <th class="table__th">№</th>
                <th class="table__th">Назва ризику</th>
                <th class="table__th">Напрям діяльності</th>
                <th class="table__th table__th--center">Імовірність</th>
                <th class="table__th table__th--center">Рівень (бал)</th>
                <th class="table__th table__th--center">Рівень ризику</th>
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

      <!-- Права частина: матриця -->
      <div class="risks-layout__aside">
        ${renderMatrix()}
      </div>

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
    case 'edit':
      console.log('[Risks] Edit:', id);
      break;
    case 'copy':
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
    case 'delete':
      if (confirm('Видалити цей ризик?')) {
        state.risks       = state.risks.filter(r => r.id !== id);
        state.expandedRow = null;
        rerenderContent(container);
      }
      break;
  }
};

/* ==================
   EVENTS
   ================== */
const bindEvents = (container) => {
  // Tabs
  container.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab   = btn.dataset.tab;
      state.expandedRow = null;
      state.currentPage = 1;
      rerender(container);
    });
  });

  // Search
  container.querySelector('#risk-search')
    ?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      state.currentPage = 1;
      state.expandedRow = null;
      rerenderContent(container);
    });

  // Row expand
  container.querySelectorAll('[data-risk-id]').forEach(row => {
    if (row.classList.contains('risk-details-row')) return;
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-action]')) return;
      const id          = Number(row.dataset.riskId);
      state.expandedRow = state.expandedRow === id ? null : id;
      rerenderContent(container);
    });
  });

  // Actions
  container.querySelectorAll('[data-action]').forEach(btn => {
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

  // Matrix dot click — підсвічує рядок в таблиці
  container.querySelectorAll('.matrix__dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const id          = Number(dot.dataset.riskId);
      state.expandedRow = state.expandedRow === id ? null : id;

      // Знаходимо сторінку де є цей ризик
      const filtered   = state.risks.filter(r =>
        r.riskName.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
      const idx        = filtered.findIndex(r => r.id === id);
      state.currentPage = Math.ceil((idx + 1) / state.perPage);

      rerenderContent(container);

      // Скролл до рядка
      setTimeout(() => {
        container.querySelector(`[data-risk-id="${id}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    });
  });

  // Export
  container.querySelector('#export-excel')
    ?.addEventListener('click', () => console.log('[Risks] Export Excel'));
  container.querySelector('#export-pdf')
    ?.addEventListener('click', () => console.log('[Risks] Export PDF'));

  // Add
  container.querySelector('#add-risk')
    ?.addEventListener('click', () => console.log('[Risks] Add risk'));
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
    activeTab:   'registry',
    expandedRow: null,
    searchQuery: '',
    currentPage: 1,
    perPage:     10,
    risks:       [...RISKS_MOCK],
  };

  container.innerHTML = renderPage();
  bindEvents(container);
};

export default Risks;
