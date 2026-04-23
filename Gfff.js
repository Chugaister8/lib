// Додай імпорт на початку Risks.js
import { openRiskForm } from '../../components/RiskForm.js';

// В bindEvents замінити:
container.querySelector('#add-risk')
  ?.addEventListener('click', () => {
    openRiskForm((newRisk) => {
      state.risks.unshift(newRisk);
      state.currentPage = 1;
      rerenderContent(container);
    });
  });
