// src/scripts/components/Header.js

import { toggleCollapse, openMobileSidebar } from './Sidebar.js';
import { toggleTheme, getTheme } from '../utils/theme.js';

/* ==================
   RENDER
   ================== */
const renderHeader = () => `
  <div class="header__container">

    <!-- Left -->
    <div class="header__left">

      <!-- Collapse toggle (desktop) -->
      <button
        class="header__icon-btn sidebar-toggle"
        id="sidebar-toggle"
        aria-label="Згорнути меню"
      >
        <span class="material-symbols-rounded">menu</span>
      </button>

      <!-- Burger (mobile) -->
      <button
        class="header__icon-btn sidebar-burger"
        id="sidebar-burger"
        aria-label="Відкрити меню"
      >
        <span class="material-symbols-rounded">menu</span>
      </button>

      <!-- Breadcrumb -->
      <nav class="breadcrumb" id="breadcrumb" aria-label="Breadcrumb">
        <ol class="breadcrumb__list"></ol>
      </nav>

    </div>

    <!-- Right -->
    <div class="header__right">

      <!-- Search -->
      <button class="header__icon-btn" id="header-search" aria-label="Пошук">
        <span class="material-symbols-rounded">search</span>
      </button>

      <!-- Notifications -->
      <button
        class="header__icon-btn header__notify"
        id="header-notify"
        aria-label="Сповіщення"
      >
        <span class="material-symbols-rounded">notifications</span>
        <span class="header__badge" id="notify-badge">3</span>
      </button>

      <!-- Theme toggle -->
      <button
        class="header__icon-btn"
        id="theme-toggle"
        aria-label="Змінити тему"
      >
        <span class="material-symbols-rounded" id="theme-icon">
          ${getTheme() === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      <!-- Divider -->
      <div class="header__divider"></div>

      <!-- User -->
      <button class="header__user" id="header-user" aria-label="Профіль">
        <div class="header__avatar">A</div>
        <div class="header__user-info">
          <span class="header__user-name">Admin</span>
          <span class="header__user-role">Super Admin</span>
        </div>
        <span class="material-symbols-rounded header__chevron">expand_more</span>
      </button>

    </div>
  </div>
`;

/* ==================
   BREADCRUMB
   ================== */
const ROUTE_LABELS = {
  '':           'Дашборд',
  'risks':      'Ризики',
  'controls':   'Контролі',
  'compliance': 'Відповідність',
  'incidents':  'Інциденти',
  'audits':     'Аудити',
  'policies':   'Політики',
  'assets':     'Активи',
  'reports':    'Звіти',
  'analytics':  'Аналітика',
  'settings':   'Налаштування',
  'users':      'Користувачі',
};

const updateBreadcrumb = () => {
  const list = document.querySelector('.breadcrumb__list');
  if (!list) return;

  const segments = window.location.pathname
    .split('/')
    .filter(Boolean);

  const crumbs = [
    { label: 'Дашборд', href: '/' },
    ...segments.map((seg, i) => ({
      label: ROUTE_LABELS[seg] ?? seg,
      href: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  // На головній — тільки один елемент
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

/* ==================
   EVENTS
   ================== */
const initHeaderEvents = (header) => {
  // Sidebar collapse (desktop)
  header.querySelector('#sidebar-toggle')
    ?.addEventListener('click', toggleCollapse);

  // Sidebar open (mobile)
  header.querySelector('#sidebar-burger')
    ?.addEventListener('click', openMobileSidebar);

  // Theme toggle
  header.querySelector('#theme-toggle')
    ?.addEventListener('click', () => {
      toggleTheme();
      const icon = document.getElementById('theme-icon');
      if (icon) {
        icon.textContent = getTheme() === 'dark' ? 'light_mode' : 'dark_mode';
      }
    });

  // Search (placeholder)
  header.querySelector('#header-search')
    ?.addEventListener('click', () => {
      // TODO: initSearch()
      console.log('[Header] Search clicked');
    });

  // Notifications (placeholder)
  header.querySelector('#header-notify')
    ?.addEventListener('click', () => {
      // TODO: initNotifications()
      console.log('[Header] Notifications clicked');
    });

  // User menu (placeholder)
  header.querySelector('#header-user')
    ?.addEventListener('click', () => {
      // TODO: initUserMenu()
      console.log('[Header] User menu clicked');
    });
};

/* ==================
   INIT
   ================== */
const initHeader = () => {
  const header = document.getElementById('header');
  if (!header) return;

  header.innerHTML = renderHeader();

  initHeaderEvents(header);
  updateBreadcrumb();

  // Оновлення breadcrumb при навігації
  window.addEventListener('popstate', updateBreadcrumb);
  document.addEventListener('navigate', updateBreadcrumb);
};

export { initHeader, updateBreadcrumb };
