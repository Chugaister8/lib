// Додай імпорт:
import ThematicAssessment from './ThematicAssessment.js';

// В renderTabContent:
case 'thematic': return `<div id="thematic-assessment-container"></div>`;

// В bindEvents:
if (state.activeTab === 'thematic') {
  const thematicContainer = container.querySelector('#thematic-assessment-container');
  if (thematicContainer) {
    ThematicAssessment(thematicContainer, {
      onTransfer: (newRisks, newMeasures) => {
        // Додаємо ризики в реєстр
        state.risks = [...state.risks, ...newRisks];

        // Додаємо заходи
        Object.entries(newMeasures).forEach(([riskId, measures]) => {
          state.measures[riskId] = measures;
        });
      }
    });
  }
}
