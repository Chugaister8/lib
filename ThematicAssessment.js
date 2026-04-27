// src/scripts/pages/risks/ThematicAssessment.js

import { THEMATIC_ASSESSMENTS_MOCK, ASSESSMENT_STATUSES, generateMeasureId } from '../../data/thematic.mock.js';
import { openThematicAssessmentForm } from '../../components/ThematicAssessmentForm.js';
import { getRiskLevel, PROBABILITY_LEVELS, IMPACT_LEVELS } from '../../data/risks.mock.js';

let state = {
  assessments: [...THEMATIC_ASSESSMENTS_MOCK],
  expandedId:  null,
};

/* ==================
   HELPERS
   ================== */
const badge = (text, cls) =>
  `<span class="badge ${cls}">${text}</span>`;

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('uk-UA');
};

/* ==================
   APPROVE MODAL
   ================== */
const renderApproveModal = (assessmentId) => `
  <div class="modal-overlay" id="approve-modal">
    <div class="modal modal--sm">
      <div class="modal__header">
        <div class="modal__title-wrapper">
          <h2 class="modal__title">Погодити оцінку</h2>
          <p class="modal__subtitle">Введіть дані наказу керівника</p>
        </div>
        <button class="modal__close" id="approve-modal-close">
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>
      <div class="modal__body">
        <form class="risk-form" id="approve-form">
          <input type="hidden" name="assessmentId" value="${assessmentId}" />

          <div class="risk-form__field">
            <label class="risk-form__label">
              № наказу про затвердження
              <span class="risk-form__required">*</span>
            </label>
            <input
              type="text"
              class="risk-form__input"
              name="orderNumber"
              placeholder="№ наказу"
              required
            />
          </div>

          <div class="risk-form__field">
            <label class="risk-form__label">
              Дата наказу
              <span class="risk-form__required">*</span>
            </label>
            <input
              type="date"
              class="risk-form__input"
              name="orderDate"
              value="${new Date().toISOString().split('T')[0]}"
              required
            />
          </div>

          <div class="risk-form__field">
            <label class="risk-form__label">Затверджено (ПІБ керівника)</label>
            <input
              type="text"
              class="risk-form__input"
              name="approvedBy"
              placeholder="ПІБ керівника"
            />
          </div>

        </form>
      </div>
      <div class="modal__footer">
        <button class="btn btn--ghost" id="approve-modal-cancel">Скасувати</button>
        <button class="btn btn--primary" id="approve-modal-submit">
          <span class="material-symbols-rounded">check_circle</span>
          Погодити
        </button>
      </div>
    </div>
  </div>
`;

/* ==================
   RENDER ASSESSMENT CARD
   ================== */
const renderAssessmentCard = (assessment) => {
  const status    = ASSESSMENT_STATUSES[assessment.status];
  const isOpen    = state.expandedId === assessment.id;
  const isApproved = assessment.status === 'APPROVED';

  return `
    <div class="thematic-card ${isOpen ? 'thematic-card--open' : ''}"
      data-assessment-id="${assessment.id}">

      <div class="thematic-card__header">
        <div class="thematic-card__left">
          <button class="thematic-card__toggle" data-action="toggle" data-id="${assessment.id}">
            <span class="material-symbols-rounded thematic-card__chevron ${isOpen ? 'thematic-card__chevron--open' : ''}">
              chevron_right
            </span>
          </button>
          <div class="thematic-card__info">
            <div class="thematic-card__meta">
              <span class="thematic-card__id">${assessment.id}</span>
              ${badge(status.label, status.class)}
              ${isApproved ? `
                <span class="thematic-card__approved">
                  <span class="material-symbols-rounded">verified</span>
                  Наказ №${assessment.orderNumber} від ${formatDate(assessment.approvedDate)}
                </span>
              ` : ''}
            </div>
            <p class="thematic-card__title">${assessment.title}</p>
            <div class="thematic-card__footer-meta">
              <span>
                <span class="material-symbols-rounded">person</span>
                ${assessment.coordinator}
              </span>
              <span>
                <span class="material-symbols-rounded">calendar_today</span>
                ${formatDate(assessment.createdAt)}
              </span>
              <span>
                <span class="material-symbols-rounded">warning</span>
                ${assessment.risks.length} ризиків
              </span>
            </div>
          </div>
        </div>

        <div class="thematic-card__actions">
          ${!isApproved ? `
            <button class="btn btn--success btn--sm"
              data-action="approve"
              data-id="${assessment.id}">
              <span class="material-symbols-rounded">check_circle</span>
              Погодити
            </button>
            <button class="btn btn--ghost btn--sm"
              data-action="edit"
              data-id="${assessment.id}">
              <span class="material-symbols-rounded">edit</span>
            </button>
          ` : ''}
          ${!isApproved ? `
            <button class="btn btn--ghost btn--icon btn--sm"
              data-action="delete"
              data-id="${assessment.id}">
              <span class="material-symbols-rounded">delete</span>
            </button>
          ` : ''}
        </div>
      </div>

      ${isOpen ? renderAssessmentDetails(assessment) : ''}

    </div>
  `;
};

/* ==================
   RENDER DETAILS
   ================== */
const renderAssessmentDetails = (assessment) => `
  <div class="thematic-card__details">

    ${assessment.description ? `
      <div class="thematic-card__desc">
        <p class="risk-details__label">Опис висновку</p>
        <p class="risk-details__value">${assessment.description}</p>
      </div>
    ` : ''}

    ${assessment.risks.length > 0 ? `
      <div class="thematic-card__risks">
        <p class="thematic-card__risks-title">
          <span class="material-symbols-rounded">warning</span>
          Ризики (${assessment.risks.length})
        </p>
        ${assessment.risks.map(risk => renderAssessmentRisk(risk)).join('')}
      </div>
    ` : `
      <div class="risk-measures__empty">
        <span class="material-symbols-rounded">inbox</span>
        <p>Ризики не додано</p>
      </div>
    `}

  </div>
`;

/* ==================
   RENDER ASSESSMENT RISK
   ================== */
const renderAssessmentRisk = (risk) => {
  const level   = getRiskLevel(risk.riskScore);
  const prob    = PROBABILITY_LEVELS[risk.probability];
  const finImp  = IMPACT_LEVELS[risk.financialImpact];
  const nfinImp = IMPACT_LEVELS[risk.nonFinancialImpact];

  return `
    <div class="thematic-risk-item">
      <div class="thematic-risk-item__header">
        <span class="thematic-risk-item__id">${risk.id}</span>
        <span class="thematic-risk-item__name">${risk.riskName}</span>
        ${badge(level.label, level.class)}
      </div>
      <div class="risk-details__grid risk-details__grid--4" style="margin-top:var(--spacing-sm)">
        <div class="risk-details__group">
          <p class="risk-details__label">Напрям</p>
          <p class="risk-details__value">${risk.direction}</p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Імовірність</p>
          <p class="risk-details__value">
            ${risk.probability} — ${badge(prob?.label, prob?.class)}
          </p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Фін. вплив</p>
          <p class="risk-details__value">
            ${risk.financialImpact} — ${badge(finImp?.label, finImp?.class)}
          </p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Нефін. вплив</p>
          <p class="risk-details__value">
            ${risk.nonFinancialImpact} — ${badge(nfinImp?.label, nfinImp?.class)}
          </p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Метод впливу</p>
          <p class="risk-details__value">${risk.impactMethod || '—'}</p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Захід</p>
          <p class="risk-details__value">${risk.measureTitle || '—'}</p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Відповідальний</p>
          <p class="risk-details__value">${risk.responsible || '—'}</p>
        </div>
        <div class="risk-details__group">
          <p class="risk-details__label">Строк</p>
          <p class="risk-details__value">${formatDate(risk.deadline)}</p>
        </div>
      </div>
    </div>
  `;
};

/* ==================
   RENDER PAGE
   ================== */
const renderPage = () => `
  <div class="thematic-page">

    <div class="thematic-page__toolbar">
      <button class="btn btn--primary btn--sm" id="new-assessment">
        <span class="material-symbols-rounded">add</span>
        Провести тематичну оцінку
      </button>
    </div>

    <div class="thematic-page__list" id="assessments-list">
      ${state.assessments.length
        ? [...state.assessments]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(a => renderAssessmentCard(a))
            .join('')
        : `
          <div class="risks-placeholder">
            <span class="risks-placeholder__icon material-symbols-rounded">assessment</span>
            <p class="risks-placeholder__title">Тематичних оцінок ще немає</p>
            <p class="risks-placeholder__text">Натисніть "Провести тематичну оцінку" щоб розпочати</p>
          </div>
        `
      }
    </div>

  </div>
`;

/* ==================
   APPROVE
   ================== */
const openApproveModal = (assessmentId, container, onApprove) => {
  document.getElementById('approve-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', renderApproveModal(assessmentId));

  requestAnimationFrame(() => {
    document.getElementById('approve-modal')?.classList.add('modal--open');
  });

  document.getElementById('approve-modal-close')
    ?.addEventListener('click', () => {
      document.getElementById('approve-modal')?.remove();
    });

  document.getElementById('approve-modal-cancel')
    ?.addEventListener('click', () => {
      document.getElementById('approve-modal')?.remove();
    });

  document.getElementById('approve-modal-submit')
    ?.addEventListener('click', () => {
      const form        = document.getElementById('approve-form');
      const fd          = new FormData(form);
      const orderNumber = fd.get('orderNumber');
      const orderDate   = fd.get('orderDate');
      const approvedBy  = fd.get('approvedBy');

      if (!orderNumber || !orderDate) {
        alert('Введіть номер та дату наказу');
        return;
      }

      onApprove({ orderNumber, orderDate, approvedBy });
      document.getElementById('approve-modal')?.remove();
    });
};

/* ==================
   TRANSFER TO REGISTRIES
   ================== */
const transferToRegistries = (assessment, onTransfer) => {
  const newRisks    = [];
  const newMeasures = {};

  assessment.risks.forEach(thematicRisk => {
    const riskId = Date.now() + Math.floor(Math.random() * 1000);

    const risk = {
      id:                 riskId,
      edrpou:             '12345678',
      instrument:         thematicRisk.instrument,
      direction:          thematicRisk.direction,
      processName:        thematicRisk.processName,
      processDesc:        thematicRisk.processDesc,
      vndName:            `${thematicRisk.vndName} (Наказ №${thematicRisk.vndOrderNumber} від ${thematicRisk.vndOrderDate})`,
      riskName:           thematicRisk.riskName,
      riskDesc:           thematicRisk.riskDesc,
      infoSource:         thematicRisk.infoSource,
      infoSourceDesc:     thematicRisk.infoSourceDesc,
      probability:        thematicRisk.probability,
      financialImpact:    thematicRisk.financialImpact,
      nonFinancialImpact: thematicRisk.nonFinancialImpact,
      riskScore:          thematicRisk.riskScore,
      riskLevelDesc:      thematicRisk.riskLevelDesc,
      actualLosses:       'Відсутні',
      measureNumber:      '—',
      status:             'ACTIVE',
      riskOwner:          thematicRisk.responsible,
      reviewDate:         new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sourceAssessment:   assessment.id,
    };

    newRisks.push(risk);

    if (thematicRisk.measureTitle) {
      newMeasures[riskId] = [{
        id:            `ПЗ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
        riskId,
        title:         thematicRisk.measureTitle,
        desc:          thematicRisk.measureDesc || '',
        responsible:   thematicRisk.responsible,
        deadline:      thematicRisk.deadline,
        approvedBy:    `Наказ №${assessment.orderNumber} від ${formatDate(assessment.approvedDate)}`,
        status:        'IN_PROGRESS',
        executionDesc: '',
        createdAt:     new Date().toISOString(),
      }];
    }
  });

  onTransfer(newRisks, newMeasures);
};

/* ==================
   EVENTS
   ================== */
const bindEvents = (container, onTransfer) => {
  // New assessment
  container.querySelector('#new-assessment')
    ?.addEventListener('click', () => {
      openThematicAssessmentForm((data) => {
        state.assessments.unshift(data);
        rerender(container, onTransfer);
      });
    });

  // Toggle expand
  container.querySelectorAll('[data-action="toggle"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id        = btn.dataset.id;
      state.expandedId = state.expandedId === id ? null : id;
      rerender(container, onTransfer);
    });
  });

  // Edit
  container.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id         = btn.dataset.id;
      const assessment = state.assessments.find(a => a.id === id);
      if (!assessment) return;

      openThematicAssessmentForm((updated) => {
        state.assessments = state.assessments.map(a =>
          a.id === id ? { ...a, ...updated } : a
        );
        rerender(container, onTransfer);
      }, { ...assessment, edit: true });
    });
  });

  // Delete
  container.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (confirm('Видалити цю тематичну оцінку?')) {
        state.assessments = state.assessments.filter(a => a.id !== id);
        if (state.expandedId === id) state.expandedId = null;
        rerender(container, onTransfer);
      }
    });
  });

  // Approve
  container.querySelectorAll('[data-action="approve"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id         = btn.dataset.id;
      const assessment = state.assessments.find(a => a.id === id);
      if (!assessment) return;

      openApproveModal(id, container, ({ orderNumber, orderDate, approvedBy }) => {
        // Оновлюємо статус
        state.assessments = state.assessments.map(a =>
          a.id === id ? {
            ...a,
            status:       'APPROVED',
            orderNumber,
            approvedDate: orderDate,
            approvedBy,
          } : a
        );

        // Переносимо в реєстри
        const approved = state.assessments.find(a => a.id === id);
        transferToRegistries(approved, onTransfer);

        rerender(container, onTransfer);
      });
    });
  });
};

/* ==================
   RE-RENDER
   ================== */
const rerender = (container, onTransfer) => {
  container.innerHTML = renderPage();
  bindEvents(container, onTransfer);
};

/* ==================
   INIT
   ================== */
const ThematicAssessment = async (container, sharedState) => {
  state = {
    assessments: [...THEMATIC_ASSESSMENTS_MOCK],
    expandedId:  null,
  };

  container.innerHTML = renderPage();
  bindEvents(container, sharedState?.onTransfer || (() => {}));
};

export default ThematicAssessment;
export { state as thematicState };
