if (state.activeTab === 'measures') {
  const measureRegistryContainer = container.querySelector('#measure-registry-container');
  if (measureRegistryContainer) {
    initMeasureRegistry(
      measureRegistryContainer,
      state.risks,
      state.measures,
      (updatedMeasures) => {
        state.measures = { ...updatedMeasures };
        if (state.expandedRow !== null) {
          rerenderContent(container);
        }
      }
    );
  }
}
