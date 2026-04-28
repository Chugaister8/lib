// Було — динамічний:
const depts = [...new Set(allMeasures.map(m => m.responsible))].sort();
...
<select class="measures-filter__select" id="filter-dept">
  <option value="">Всі підрозділи</option>
  ${depts.map(d => `
    <option value="${d}" ${state.filterDept === d ? 'selected' : ''}>${d}</option>
  `).join('')}
</select>

// Заміни на статичний:
<select class="measures-filter__select" id="filter-dept">
  <option value="">Всі підрозділи</option>
  ${DEPARTMENTS.map(d => `
    <option value="${d}" ${state.filterDept === d ? 'selected' : ''}>${d}</option>
  `).join('')}
</select>
