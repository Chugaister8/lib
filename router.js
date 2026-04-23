// src/scripts/services/router.js

const ROUTES = {
  '/':           () => import('../pages/Home.js'),
  '/risks':      () => import('../pages/risks/Risks.js'),
  '/kri':        () => import('../pages/risks/Kri.js'),
  '/incidents':  () => import('../pages/escalation/Incidents.js'),
  '/policies':   () => import('../pages/policies/Policies.js'),
  '/users':      () => import('../pages/admin/Users.js'),
  '/audits':     () => import('../pages/admin/Audits.js'),
  '/reports':    () => import('../pages/reports/Reports.js'),
  '/analytics':  () => import('../pages/reports/Analytics.js'),
  '/settings':   () => import('../pages/Settings.js'),
};
