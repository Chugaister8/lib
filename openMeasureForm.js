// Додай імпорт на початку файлу:
import { openMeasureForm } from '../components/MeasureForm.js';

// handleAction:
const handleAction = (action, measureId, container, onUpdate) => {
  switch (action) {
    case 'edit': {
      const allMeasures = getAllMeasures();
      const found       = allMeasures.find(m => m.id === measureId);
      if (!found) return;

      openMeasureForm(
        found.risk.id,
        found.risk.riskName,
        (updated) => {
          state.measures[found.risk.id] = state.measures[found.risk.id]
            .map(m => m.id === measureId ? updated : m);
          if (onUpdate) onUpdate(state.measures);
          rerender(container, onUpdate);
        },
        { ...found, edit: true }
      );
      break;
    }
    case 'delete': {
      if (confirm('Видалити цей захід?')) {
        Object.keys(state.measures).forEach(riskId => {
          state.measures[riskId] = state.measures[riskId]
            .filter(m => m.id !== measureId);
        });
        state.expandedRow = null;
        if (onUpdate) onUpdate(state.measures);
        rerender(container, onUpdate);
      }
      break;
    }
  }
};
