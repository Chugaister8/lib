// Оновлений updateBreadcrumb
const updateBreadcrumb = (subLabel = null) => {
  const list = document.querySelector('.breadcrumb__list');
  if (!list) return;

  const segments = window.location.pathname
    .split('/')
    .filter(Boolean);

  const crumbs = [
    { label: 'Дашборд', href: '/' },
    ...segments.map((seg, i) => ({
      label: ROUTE_LABELS[seg] ?? seg,
      href:  '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  // Додаємо підвкладку якщо є
  if (subLabel && crumbs.length > 1) {
    crumbs.push({ label: subLabel, href: null });
  }

  const visible = crumbs.length > 1 ? crumbs : crumbs.slice(0, 1);

  list.innerHTML = visible.map((crumb, i) => {
    const isLast = i === visible.length - 1;
    return `
      <li class="breadcrumb__item ${isLast ? 'breadcrumb__item--active' : ''}">
        ${isLast
          ? `<span>${crumb.label}</span>`
          : `<a href="${crumb.href}" data-link class="breadcrumb__link">${crumb.label}</a>
             <span class="breadcrumb__sep material-symbols-rounded">chevron_right</span>`
        }
      </li>
    `;
  }).join('');
};

// В initHeader додай слухача:
const initHeader = () => {
  const header = document.getElementById('header');
  if (!header) return;

  header.innerHTML = renderHeader();
  initHeaderEvents(header);
  updateBreadcrumb();

  window.addEventListener('popstate', () => updateBreadcrumb());
  document.addEventListener('navigate',   () => updateBreadcrumb());

  // ← додай
  document.addEventListener('tab-change', (e) => {
    updateBreadcrumb(e.detail.label);
  });
};
