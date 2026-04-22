// src/scripts/components/Sidebar.js

import { navigate } from '../services/router.js';

const NAV_ITEMS = [
  {
    section: 'Головне',
    items: [
      { href: '/',            icon: 'dashboard',   label: 'Дашборд'      },
      { href: '/risks',       icon: 'warning',     label: 'Ризики'       },
      { href: '/controls',    icon: 'shield',      label: 'Контролі'     },
      { href: '/compliance',  icon: 'task_alt',    label: 'Відповідність'},
    ]
  },
  {
    section: 'Управління',
    items: [
      { href: '/incidents',   icon: 'bug_report',  label: 'Інциденти'    },
      { href: '/audits',      icon: 'fact_check',  label: 'Аудити'       },
      { href: '/policies',    icon: 'description', label: 'Політики'     },
      { href: '/assets',      icon: 'devices',     label: 'Активи'       },
    ]
  },
  {
    section: 'Аналітика',
    items: [
      { href: '/reports',     icon: 'bar_chart',   label: 'Звіти'        },
      { href: '/analytics',   icon: 'insights',    label: 'Аналітика'    },
    ]
  },
  {
    section: 'Система',
    items: [
      { href: '/settings',    icon: 'settings',    label: 'Налаштування' },
      { href: '/users',       icon: 'group',       label: 'Користувачі'  },
    ]
  },
];

/* ==================
   RENDER
   ================== */
const renderNavItem = ({ href, icon, label }) => `
  <li class="sidebar__item">
    <a href="${href}" data-link class="sidebar__link">
      <span class="sidebar__icon material-symbols-rounded">${icon}</span>
      <span class="sidebar__label">${label}</span>
    </a>
  </li>
`;

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

    <!-- Logo -->
    <div class="sidebar__logo">
      <span class="sidebar__logo-icon material-symbols-rounded">security</span>
      <span class="sidebar__logo-text">ATLAS</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar__nav-wrapper">
      ${NAV_ITEMS.map(renderSection).join('')}
    </nav>

    <!-- Footer -->
    <div class="sidebar__footer">
      <div class="sidebar__user">
        <div class="sidebar__avatar">A</div>
        <div class="sidebar__user-info">
          <span class="sidebar__user-name">Admin</span>
          <span class="sidebar__user-role">Super Admin</span>
        </div>
      </div>
    </div>

  </div>
`;

/* ==================
   ACTIVE LINK
   ================== */
const setActiveLink = (sidebar) => {
  const path = window.location.pathname;

  sidebar.querySelectorAll('.sidebar__link').forEach((link) => {
    const href = link.getAttribute('href');
    const isActive = href === '/'
      ? path === '/'
      : path.startsWith(href);

    link.classList.toggle('sidebar__link--active', isActive);
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
  document.getElementById('sidebar')
    ?.classList.add('sidebar-open');
  document.getElementById('sidebar-overlay')
    ?.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeMobileSidebar = () => {
  document.getElementById('sidebar')
    ?.classList.remove('sidebar-open');
  document.getElementById('sidebar-overlay')
    ?.classList.remove('active');
  document.body.style.overflow = '';
};

const isMobile = () => window.innerWidth <= 768;

/* ==================
   INIT
   ================== */
const initSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Render
  sidebar.innerHTML = renderSidebar();

  // Apply saved collapse state (desktop only)
  if (!isMobile()) {
    applyCollapse(isCollapsed());
  }

  // Active link on init
  setActiveLink(sidebar);

  // Active link on navigation
  window.addEventListener('popstate', () => setActiveLink(sidebar));
  document.addEventListener('navigate', () => setActiveLink(sidebar));

  // Overlay click — close mobile sidebar
  document.getElementById('sidebar-overlay')
    ?.addEventListener('click', closeMobileSidebar);

  // Resize — reset mobile state
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeMobileSidebar();
      applyCollapse(isCollapsed());
    }
  });
};

export { initSidebar, toggleCollapse, openMobileSidebar, closeMobileSidebar };
