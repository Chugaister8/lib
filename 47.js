// Go to assessment
container.querySelectorAll('[data-action="go-to-assessment"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const assessmentId = btn.dataset.assessmentId;

    // Перемикаємо на вкладку тематичних оцінок
    state.activeTab   = 'thematic';
    state.expandedRow = null;
    rerender(container);

    // Диспатчимо подію щоб відкрити потрібну оцінку
    document.dispatchEvent(new CustomEvent('open-assessment', {
      detail: { id: assessmentId }
    }));
  });
});
