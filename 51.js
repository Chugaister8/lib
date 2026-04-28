// Додай renderTabs:
const renderTabs = () => `
  <div class="risks-tabs">
    ${TABS.map(tab => `
      <button
        class="risks-tab ${state.activeTab === tab.id ? 'risks-tab--active' : ''}"
        data-tab="${tab.id}">
        ${tab.label}
      </button>
    `).join('')}
  </div>
`;
