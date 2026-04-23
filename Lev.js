export const getRiskLevel = (score) => {
  if ([5, 10, 15, 20].includes(score))
    return { label: 'Критичний',    class: 'badge--risk-critical' };
  if ([12, 16].includes(score))
    return { label: 'Дуже високий', class: 'badge--risk-high'     };
  if ([6, 8, 9].includes(score))
    return { label: 'Високий',      class: 'badge--risk-medium'   };
  if ([3, 4].includes(score))
    return { label: 'Середній',     class: 'badge--risk-low'      };
  return   { label: 'Низький',      class: 'badge--risk-info'     };
};
