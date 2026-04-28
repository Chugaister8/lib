// Search
container.querySelector('#risk-search')
  ?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    state.currentPage = 1;
    state.expandedRow = null;
    rerenderContent(container);
  });

// Filter direction
container.querySelector('#filter-direction')
  ?.addEventListener('change', (e) => {
    state.filterDirection = e.target.value;
    state.currentPage     = 1;
    state.expandedRow     = null;
    rerenderContent(container);
  });

// Filter level
container.querySelector('#filter-level')
  ?.addEventListener('change', (e) => {
    state.filterLevel = e.target.value;
    state.currentPage = 1;
    state.expandedRow = null;
    rerenderContent(container);
  });

// Filter status
container.querySelector('#filter-status')
  ?.addEventListener('change', (e) => {
    state.filterStatus = e.target.value;
    state.currentPage  = 1;
    state.expandedRow  = null;
    rerenderContent(container);
  });

// Filter owner
container.querySelector('#filter-owner')
  ?.addEventListener('change', (e) => {
    state.filterOwner = e.target.value;
    state.currentPage = 1;
    state.expandedRow = null;
    rerenderContent(container);
  });

// Clear all filters
container.querySelector('#clear-filters')
  ?.addEventListener('click', () => {
    state.searchQuery     = '';
    state.filterDirection = '';
    state.filterLevel     = '';
    state.filterStatus    = '';
    state.filterOwner     = '';
    state.matrixFilter    = null;
    state.currentPage     = 1;
    state.expandedRow     = null;
    rerenderContent(container);
  });

// Clear matrix filter
container.querySelector('#clear-matrix-filter')
  ?.addEventListener('click', () => {
    state.matrixFilter = null;
    state.currentPage  = 1;
    rerenderContent(container);
  });
