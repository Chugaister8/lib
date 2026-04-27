// Додай імпорт:
import { initMeasureRegistry, updateMeasureRegistry } from './MeasureRegistry.js';

// В renderTabContent:
case 'measures': return `<div id="measure-registry-container"></div>`;

// В bindEvents після існуючих — додай:
const measureRegistryContainer = container.querySelector('#measure-registry-container');
if (measureRegistryContainer) {
  initMeasureRegistry(
    measureRegistryContainer,
    state.risks,
    state.measures,
    (updatedMeasures) => {
      state.measures = updatedMeasures;
    }
  );
}
