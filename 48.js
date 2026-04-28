// В кінці bindEvents:
document.addEventListener('open-assessment', (e) => {
  const id = e.detail.id;
  state.expandedId = id;
  rerender(container, onTransfer);

  // Скролимо до картки
  setTimeout(() => {
    const card = container.querySelector(`[data-assessment-id="${id}"]`);
    card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
});
