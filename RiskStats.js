// src/scripts/components/RiskStats.js

import { MEASURE_STATUSES } from '../data/measures.mock.js';
import { getRiskLevel }     from '../data/risks.mock.js';

/* ==================
   CALCULATE STATS
   ================== */
export const calculateStats = (risks, measures) => {
  const total = risks.length;

  // По рівнях ризику
  const byLevel = {
    critical:  risks.filter(r => getRiskLevel(r.riskScore).label === 'Критичний').length,
    veryHigh:  risks.filter(r => getRiskLevel(r.riskScore).label === 'Дуже високий').length,
    high:      risks.filter(r => getRiskLevel(r.riskScore).label === 'Високий').length,
    medium:    risks.filter(r => getRiskLevel(r.riskScore).label === 'Середній').length,
    low:       risks.filter(r => getRiskLevel(r.riskScore).label === 'Низький').length,
  };

  // Без заходів
  const withoutMeasures = risks.filter(r =>
    !measures[r.id] || measures[r.id].length === 0
  ).length;

  // Всі заходи в один масив
  const allMeasures = Object.values(measures).flat();

  // По статусах заходів
  const measureStats = {
    inProgress: allMeasures.filter(m => m.status === 'IN_PROGRESS').length,
    done:       allMeasures.filter(m => m.status === 'DONE').length,
    overdue:    allMeasures.filter(m => m.status === 'OVERDUE' ||
                  (m.status !== 'DONE' && m.status !== 'CANCELLED' &&
                   new Date(m.deadline) < new Date())).length,
    cancelled:  allMeasures.filter(m => m.status === 'CANCELLED').length,
    total:      allMeasures.length,
  };

  return { total, byLevel, withoutMeasures, measureStats };
};

/* ==================
   RENDER
   ================== */
export const createRiskStats = (container, risks, measures) => {
  const render = () => {
    const stats = calculateStats(risks, measures);
    container.innerHTML = renderStats(stats);
  };

  const update = (newRisks, newMeasures) => {
    risks    = newRisks;
    measures = newMeasures;
    render();
  };

  render();
  return { update };
};

const renderStatCard = ({ icon, label, value, colorClass, hint }) => `
  <div class="risk-stat-card risk-stat-card--${colorClass}">
    <div class="risk-stat-card__icon">
      <span class="material-symbols-rounded">${icon}</span>
    </div>
    <div class="risk-stat-card__body">
      <span class="risk-stat-card__value">${value}</span>
      <span class="risk-stat-card__label">${label}</span>
      ${hint ? `<span class="risk-stat-card__hint">${hint}</span>` : ''}
    </div>
  </div>
`;

const renderStats = (stats) => `
  <div class="risk-stats">

    <p class="risk-stats__title">Зведена статистика</p>

    <!-- Ризики без заходів -->
    <div class="risk-stats__section">
      <p class="risk-stats__section-label">Заходи мінімізації</p>
      <div class="risk-stats__cards">
        ${renderStatCard({
          icon:       'playlist_remove',
          label:      'Без заходів',
          value:      stats.withoutMeasures,
          colorClass: stats.withoutMeasures > 0 ? 'danger' : 'success',
          hint:       `з ${stats.total} ризиків`,
        })}
        ${renderStatCard({
          icon:       'pending_actions',
          label:      'В роботі',
          value:      stats.measureStats.inProgress,
          colorClass: 'warning',
          hint:       'заходів',
        })}
        ${renderStatCard({
          icon:       'event_busy',
          label:      'Прострочено',
          value:      stats.measureStats.overdue,
          colorClass: stats.measureStats.overdue > 0 ? 'danger' : 'success',
          hint:       'заходів',
        })}
        ${renderStatCard({
          icon:       'task_alt',
          label:      'Виконано',
          value:      stats.measureStats.done,
          colorClass: 'success',
          hint:       'заходів',
        })}
      </div>
    </div>

    <!-- По рівнях ризику -->
    <div class="risk-stats__section">
      <p class="risk-stats__section-label">Розподіл за рівнем</p>
      <div class="risk-stats__levels">
        ${renderLevelBar('Критичний',    stats.byLevel.critical, stats.total, 'critical'  )}
        ${renderLevelBar('Дуже високий', stats.byLevel.veryHigh, stats.total, 'very-high' )}
        ${renderLevelBar('Високий',      stats.byLevel.high,     stats.total, 'high'      )}
        ${renderLevelBar('Середній',     stats.byLevel.medium,   stats.total, 'medium'    )}
        ${renderLevelBar('Низький',      stats.byLevel.low,      stats.total, 'low'       )}
      </div>
    </div>

  </div>
`;

const renderLevelBar = (label, count, total, colorClass) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return `
    <div class="risk-level-bar">
      <div class="risk-level-bar__header">
        <span class="risk-level-bar__label">${label}</span>
        <span class="risk-level-bar__count">${count}</span>
      </div>
      <div class="risk-level-bar__track">
        <div
          class="risk-level-bar__fill risk-level-bar__fill--${colorClass}"
          style="width: ${percent}%">
        </div>
      </div>
    </div>
  `;
};
