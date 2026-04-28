// Оновлений renderToolbar
const renderToolbar = () => {
  const directions = [...new Set(state.risks.map(r => r.direction))].sort();
  const owners     = [...new Set(state.risks.map(r => r.riskOwner).filter(Boolean))].sort();

  return `
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

        <select class="measures-filter__select" id="filter-direction">
          <option value="">Всі напрями</option>
          ${directions.map(d => `
            <option value="${d}" ${state.filterDirection === d ? 'selected' : ''}>${d}</option>
          `).join('')}
        </select>

        <select class="measures-filter__select" id="filter-level">
          <option value="">Всі рівні</option>
          <option value="Критичний"    ${state.filterLevel === 'Критичний'    ? 'selected' : ''}>Критичний</option>
          <option value="Дуже високий" ${state.filterLevel === 'Дуже високий' ? 'selected' : ''}>Дуже високий</option>
          <option value="Високий"      ${state.filterLevel === 'Високий'      ? 'selected' : ''}>Високий</option>
          <option value="Середній"     ${state.filterLevel === 'Середній'     ? 'selected' : ''}>Середній</option>
          <option value="Низький"      ${state.filterLevel === 'Низький'      ? 'selected' : ''}>Низький</option>
        </select>

        <select class="measures-filter__select" id="filter-status">
          <option value="">Всі статуси</option>
          ${Object.entries(RISK_STATUSES).map(([key, val]) => `
            <option value="${key}" ${state.filterStatus === key ? 'selected' : ''}>
              ${val.label}
            </option>
          `).join('')}
        </select>

        <select class="measures-filter__select" id="filter-owner">
          <option value="">Всі власники</option>
          ${owners.map(o => `
            <option value="${o}" ${state.filterOwner === o ? 'selected' : ''}>${o}</option>
          `).join('')}
        </select>

        ${state.filterDirection || state.filterLevel || state.filterStatus || state.filterOwner || state.searchQuery ? `
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
        <button class="btn btn--primary btn--sm" id="add-risk">
          <span class="material-symbols-rounded">add</span>
          Додати ризик
        </button>
      </div>
    </div>
  `;
};
