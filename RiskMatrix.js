// src/scripts/components/RiskMatrix.js

/**
 * RiskMatrix — інтерактивна матриця ризиків
 * Використання:
 *   import { createRiskMatrix } from '../components/RiskMatrix.js';
 *   createRiskMatrix(container, risks, onFilter);
 */

// Колір клітинки за балом (імовірність * вплив)
const getCellLevel = (probability, impact) => {
  const score = probability * impact;
  if ([5, 10, 15, 20].includes(score) && impact === 5) return 'critical';
  if (score >= 12) return 'very-high';
  if ([6, 8, 9].includes(score))                       return 'high';
  if ([3, 4].includes(score))                          return 'medium';
  return 'low';
};

const LEVEL_LABELS = {
  'critical':  'Критичний',
  'very-high': 'Дуже високий',
  'high':      'Високий',
  'medium':    'Середній',
  'low':       'Низький',
};

// Імовірність — рядки зверху вниз (4→1)
const PROBABILITIES = [4, 3, 2, 1];

// Вплив — колонки зліва направо (1→5)
const IMPACTS = [1, 2, 3, 4, 5];

const PROBABILITY_LABELS = {
  4: 'Дуже\nвисокий',
  3: 'Високий',
  2: 'Середній',
  1: 'Низький',
};

const IMPACT_LABELS = {
  1: 'Низький',
  2: 'Середній',
  3: 'Високий',
  4: 'Дуже\nвисокий',
  5: 'Критичний',
};

/* ==================
   RENDER
   ================== */
const renderMatrix = (risks, activeCell) => {
  // Підрахунок ризиків по клітинкам
  const cellCounts = {};
  risks.forEach(r => {
    const key = `${r.probability}-${r.financialImpact}`;
    cellCounts[key] = (cellCounts[key] || []);
    cellCounts[key].push(r);
  });

  const rows = PROBABILITIES.map(prob => {
    const cells = IMPACTS.map(impact => {
      const key      = `${prob}-${impact}`;
      const level    = getCellLevel(prob, impact);
      const score    = prob * impact;
      const cellRisks = cellCounts[key] || [];
      const count    = cellRisks.length;
      const isActive = activeCell === key;

      const dots = count > 0
        ? `<div class="risk-matrix__dots">
            ${Array.from({ length: Math.min(count, 9) }).map((_, i) => `
              <span class="risk-matrix__dot ${isActive ? 'risk-matrix__dot--active' : ''}"
                title="${cellRisks[i]?.riskName || ''}">
              </span>
            `).join('')}
            ${count > 9 ? `<span class="risk-matrix__dot-more">+${count - 9}</span>` : ''}
           </div>`
        : '';

      return `
        <td class="risk-matrix__cell risk-matrix__cell--${level} ${isActive ? 'risk-matrix__cell--selected' : ''}"
          data-prob="${prob}"
          data-impact="${impact}"
          data-key="${key}"
          data-count="${count}"
          title="${LEVEL_LABELS[level]} (${score} балів)">
          <span class="risk-matrix__score">${score}</span>
          ${dots}
        </td>
      `;
    }).join('');

    return `
      <tr>
        <td class="risk-matrix__axis-label risk-matrix__axis-label--y">
          ${PROBABILITY_LABELS[prob].replace('\n', '<br>')}
          <span class="risk-matrix__axis-num">${prob}</span>
        </td>
        ${cells}
      </tr>
    `;
  }).join('');

  return `
    <div class="risk-matrix">
      <div class="risk-matrix__header">
        <p class="risk-matrix__title">Матриця ризиків</p>
        ${activeCell
          ? `<button class="risk-matrix__reset" id="matrix-reset">
               <span class="material-symbols-rounded">filter_alt_off</span>
               Скинути
             </button>`
          : ''
        }
      </div>

      <div class="risk-matrix__wrap">
        <!-- Y axis label -->
        <div class="risk-matrix__y-title">Імовірність</div>

        <div class="risk-matrix__table-wrap">
          <table class="risk-matrix__table">
            <tbody>
              ${rows}
            </tbody>
            <tfoot>
              <tr>
                <td class="risk-matrix__corner"></td>
                ${IMPACTS.map(i => `
                  <td class="risk-matrix__axis-label risk-matrix__axis-label--x">
                    ${IMPACT_LABELS[i].replace('\n', '<br>')}
                    <span class="risk-matrix__axis-num">${i}</span>
                  </td>
                `).join('')}
              </tr>
            </tfoot>
          </table>

          <!-- X axis label -->
          <div class="risk-matrix__x-title">Вплив</div>
        </div>
      </div>

      <!-- Legend -->
      <div class="risk-matrix__legend">
        ${Object.entries(LEVEL_LABELS).map(([level, label]) => `
          <div class="risk-matrix__legend-item">
            <span class="risk-matrix__legend-dot risk-matrix__legend-dot--${level}"></span>
            <span class="risk-matrix__legend-label">${label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

/* ==================
   INIT
   ================== */
export const createRiskMatrix = (container, risks, onFilter) => {
  let activeCell = null;

  const render = () => {
    container.innerHTML = renderMatrix(risks, activeCell);
    bindEvents();
  };

  const bindEvents = () => {
    // Клік по клітинці
    container.querySelectorAll('.risk-matrix__cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const key   = cell.dataset.key;
        const count = Number(cell.dataset.count);

        if (count === 0) return;

        activeCell = activeCell === key ? null : key;
        render();

        if (activeCell) {
          const [prob, impact] = key.split('-').map(Number);
          onFilter({ probability: prob, impact });
        } else {
          onFilter(null);
        }
      });
    });

    // Скинути фільтр
    container.querySelector('#matrix-reset')
      ?.addEventListener('click', () => {
        activeCell = null;
        render();
        onFilter(null);
      });
  };

  // Оновлення ризиків ззовні
  const update = (newRisks) => {
    risks = newRisks;
    render();
  };

  render();
  return { update };
};
