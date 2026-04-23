// src/scripts/components/Sidebar.js

import { navigate } from '../services/router.js';

const NAV_ITEMS = [
  {
    section: 'Головне',
    items: [
      { href: '/', icon: 'dashboard', label: 'Дашборд' },
    ]
  },
  {
    section: 'Ризики',
    items: [
      {
        icon: 'warning',
        label: 'Ризики',
        children: [
          { href: '/risks/assessment', icon: 'analytics', label: 'Оцінка ризиків'       },
          { href: '/risks/registry',   icon: 'list_alt',  label: 'Реєстр ризиків'        },
          { href: '/risks/measures',   icon: 'task_alt',  label: 'Реєстр планів заходів' },
        ]
      },
    ]
  },
  {
    section: 'Ескалація',
    items: [
      { href: '/escalation', icon: 'notification_important', label: 'Суттєві події' },
    ]
  },
  {
    section: 'Схильність до ризиків',
    items: [
      { href: '/appetite', icon: 'balance', label: 'Декларація схильності' },
    ]
  },
  {
    section: 'Адміністрування',
    items: [
      {
        icon: 'corporate_fare',
        label: 'Адміністрування',
        children: [
          { href: '/admin/coordinators', icon: 'manage_accounts', label: 'Ризик-координатори' },
          { href: '/admin/companies',    icon: 'business',        label: 'Підприємства'        },
        ]
      },
    ]
  },
  {
    section: 'Звітність',
    items: [
      {
        icon: 'insights',
        label: 'Звітність',
        children: [
          { href: '/reports/list',      icon: 'description', label: 'Звіти'     },
          { href: '/reports/analytics', icon: 'bar_chart',   label: 'Аналітика' },
        ]
      },
    ]
  },
  {
    section: 'Система',
    items: [
      { href: '/settings', icon: 'settings', label: 'Налаштування' },
    ]
  },
];

/* ==================
   HELPERS
   ================== */
const isActivePath = (href) =>
  href === '/'
    ? window.location.pathname === '/'
    : window.location.pathname.startsWith(href);

const isActiveChild = (children) =>
  children.some(({ href }) => isActivePath(href));

/* ==================
   RENDER
   ================== */
const renderChild = ({ href, icon, label }) => `
  <li class="sidebar__child-item">
    <a
      href="${href}"
      data-link
      data-tooltip="${label}"
      class="sidebar__child-link ${isActivePath(href) ? 'sidebar__child-link--active' : ''}"
    >
      <span class="sidebar__icon material-symbols-rounded">${icon}</span>
      <span class="sidebar__label">${label}</span>
    </a>
  </li>
`;

const renderNavItem = (item) => {
  if (item.children) {
    const isOpen = isActiveChild(item.children);
    return `
      <li class="sidebar__item sidebar__item--group ${isOpen ? 'sidebar__item--open' : ''}">
        <button
          class="sidebar__link sidebar__link--group"
          data-tooltip="${item.label}"
          aria-expanded="${isOpen}"
        >
          <span class="sidebar__icon material-symbols-rounded">${item.icon}</span>
          <span class="sidebar__label">${item.label}</span>
          <span class="sidebar__chevron material-symbols-rounded">chevron_right</span>
        </button>
        <ul class="sidebar__children">
          ${item.children.map(renderChild).join('')}
        </ul>
      </li>
    `;
  }

  return `
    <li class="sidebar__item">
      <a
        href="${item.href}"
        data-link
        data-tooltip="${item.label}"
        class="sidebar__link ${isActivePath(item.href) ? 'sidebar__link--active' : ''}"
      >
        <span class="sidebar__icon material-symbols-rounded">${item.icon}</span>
        <span class="sidebar__label">${item.label}</span>
      </a>
    </li>
  `;
};

const renderSection = ({ section, items }) => `
  <div class="sidebar__section">
    <p class="sidebar__section-title">${section}</p>
    <ul class="sidebar__nav">
      ${items.map(renderNavItem).join('')}
    </ul>
  </div>
`;

const renderSidebar = () => `
  <div class="sidebar__inner">

    <div class="sidebar__logo">
      <span class="sidebar__logo-icon material-symbols-rounded">security</span>
      <span class="sidebar__logo-text">ATLAS</span>
    </div>

    <nav class="sidebar__nav-wrapper">
      ${NAV_ITEMS.map(renderSection).join('')}
    </nav>

  </div>
`;

/* ==================
   ACCORDION
   ================== */
const initAccordion = (sidebar) => {
  sidebar.querySelectorAll('.sidebar__link--group').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.sidebar__item--group');
      const isOpen = item.classList.contains('sidebar__item--open');

      // Закрий всі інші групи
      sidebar.querySelectorAll('.sidebar__item--group').forEach((el) => {
        el.classList.remove('sidebar__item--open');
        el.querySelector('.sidebar__link--group')
          ?.setAttribute('aria-expanded', 'false');
      });

      // Відкрий поточну якщо була закрита
      if (!isOpen) {
        item.classList.add('sidebar__item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
};

/* ==================
   ACTIVE LINK
   ================== */
const setActiveLink = (sidebar) => {
  // Прості посилання
  sidebar.querySelectorAll('.sidebar__link:not(.sidebar__link--group)').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    link.classList.toggle('sidebar__link--active', isActivePath(href));
  });

  // Дочірні посилання
  sidebar.querySelectorAll('.sidebar__child-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    link.classList.toggle('sidebar__child-link--active', isActivePath(href));
  });

  // Відкрий групу якщо активний дочірній елемент
  sidebar.querySelectorAll('.sidebar__item--group').forEach((group) => {
    const hasActive = group.querySelector('.sidebar__child-link--active');
    group.classList.toggle('sidebar__item--open', !!hasActive);
    group.querySelector('.sidebar__link--group')
      ?.setAttribute('aria-expanded', String(!!hasActive));
  });
};

/* ==================
   FLYOUT (collapsed)
   ================== */
const initFlyout = (sidebar) => {
  sidebar.querySelectorAll('.sidebar__item--group').forEach((group) => {
    const btn = group.querySelector('.sidebar__link--group');
    const children = group.querySelector('.sidebar__children');

    btn.addEventListener('mouseenter', () => {
      const app = document.getElementById('app');
      if (!app?.classList.contains('sidebar-collapsed')) return;
      const rect = btn.getBoundingClientRect();
      children.style.top = `${rect.top}px`;
    });
  });
};

/* ==================
   COLLAPSE
   ================== */
const COLLAPSE_KEY = 'atlas-sidebar-collapsed';

const isCollapsed = () =>
  localStorage.getItem(COLLAPSE_KEY) === 'true';

const applyCollapse = (collapsed) => {
  document.getElementById('app')
    ?.classList.toggle('sidebar-collapsed', collapsed);
};

const toggleCollapse = () => {
  const next = !isCollapsed();
  localStorage.setItem(COLLAPSE_KEY, String(next));
  applyCollapse(next);
};

/* ==================
   MOBILE
   ================== */
const openMobileSidebar = () => {
  document.getElementById('sidebar')?.classList.add('sidebar-open');
  document.getElementById('sidebar-overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeMobileSidebar = () => {
  document.getElementById('sidebar')?.classList.remove('sidebar-open');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
};

const isMobile = () => window.innerWidth <= 768;

/* ==================
   INIT
   ================== */
const initSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = renderSidebar();

  if (!isMobile()) applyCollapse(isCollapsed());

  setActiveLink(sidebar);
  initAccordion(sidebar);
  initFlyout(sidebar);

  window.addEventListener('popstate', () => setActiveLink(sidebar));
  document.addEventListener('navigate', () => setActiveLink(sidebar));

  document.getElementById('sidebar-overlay')
    ?.addEventListener('click', closeMobileSidebar);

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeMobileSidebar();
      applyCollapse(isCollapsed());
    }
  });
};

export { initSidebar, toggleCollapse, openMobileSidebar, closeMobileSidebar };
