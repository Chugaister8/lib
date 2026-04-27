// Додай імпорт:
import { openResidualRiskForm } from '../../components/ResidualRiskForm.js';

// В bindEvents додай обробник:
container.querySelectorAll('[data-action="assess-residual"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const riskId = Number(btn.dataset.riskId);
    const risk   = state.risks.find(r => r.id === riskId);
    if (!risk) return;

    openResidualRiskForm(risk, (residualData) => {
      state.risks = state.risks.map(r =>
        r.id === riskId ? { ...r, ...residualData } : r
      );
      rerenderContent(container);
    }, {
      residualProbability:        risk.residualProbability,
      residualFinancialImpact:    risk.residualFinancialImpact,
      residualNonFinancialImpact: risk.residualNonFinancialImpact,
      residualDesc:               risk.residualDesc,
      residualDate:               risk.residualDate,
    });
  });
});
