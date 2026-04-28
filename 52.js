// В bindEvents додай обробник табів:
container.querySelectorAll('[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    state.activeTab   = btn.dataset.tab;
    state.expandedRow = null;
    state.currentPage = 1;
    rerender(container);
  });
});
