// src/scripts/data/risks.mock.js

export const RISK_INSTRUMENTS = [
  'Інтерв\'ю',
  'Анкетування',
  'Аналіз документів',
  'Спостереження',
  'Мозковий штурм',
];

export const RISK_DIRECTIONS = [
  'Фінансова діяльність',
  'Операційна діяльність',
  'Кадрова діяльність',
  'ІТ та кібербезпека',
  'Compliance',
  'Репутаційні ризики',
];

export const RISK_STATUSES = {
  ACTIVE:    { label: 'Активний',    class: 'badge--danger'  },
  MONITORED: { label: 'Моніториться', class: 'badge--warning' },
  MITIGATED: { label: 'Знижений',    class: 'badge--success' },
  CLOSED:    { label: 'Закритий',    class: 'badge--neutral' },
};

// Імовірність: 1-4
export const PROBABILITY_LEVELS = {
  1: { label: 'Низький',      class: 'badge--risk-low'    },
  2: { label: 'Середній',     class: 'badge--risk-medium' },
  3: { label: 'Високий',      class: 'badge--risk-high'   },
  4: { label: 'Дуже високий', class: 'badge--risk-critical'},
};

// Вплив: 1-5
export const IMPACT_LEVELS = {
  1: { label: 'Низький',    class: 'badge--risk-low'      },
  2: { label: 'Середній',   class: 'badge--risk-medium'   },
  3: { label: 'Високий',    class: 'badge--risk-high'     },
  4: { label: 'Дуже високий', class: 'badge--risk-critical'},
  5: { label: 'Критичний',  class: 'badge--risk-critical' },
};

// Рівень ризику = імовірність * вплив
export const getRiskLevel = (score) => {
  if (score >= 16) return { label: 'Критичний', class: 'badge--risk-critical' };
  if (score >= 9)  return { label: 'Високий',   class: 'badge--risk-high'     };
  if (score >= 4)  return { label: 'Середній',  class: 'badge--risk-medium'   };
  return                   { label: 'Низький',   class: 'badge--risk-low'      };
};

export const RISKS_MOCK = [
  {
    id: 1,
    edrpou:          '12345678',
    instrument:      'Інтерв\'ю',
    direction:       'Фінансова діяльність',
    processName:     'Управління дебіторською заборгованістю',
    processDesc:     'Процес контролю та стягнення дебіторської заборгованості підприємства',
    vndName:         'Положення про фінансовий контроль від 01.01.2023',
    riskName:        'Ризик несвоєчасного погашення дебіторської заборгованості',
    riskDesc:        'Можливість виникнення збитків внаслідок несвоєчасної оплати контрагентами',
    infoSource:      'Фінансова звітність',
    infoSourceDesc:  'Аналіз балансу за 2023 рік виявив зростання простроченої заборгованості на 23%',
    probability:     3,
    financialImpact: 4,
    nonFinancialImpact: 2,
    riskScore:       12,
    riskLevelDesc:   'Імовірність: висока через повторні випадки протягом року. Фінансовий вплив: втрати перевищують 1 млн грн. Нефінансовий: помірний вплив на діяльність.',
    actualLosses:    '450 000 грн за 2022-2024 рр.',
    measureNumber:   'ПЗ-2024-001',
    status:          'ACTIVE',
  },
  {
    id: 2,
    edrpou:          '12345678',
    instrument:      'Аналіз документів',
    direction:       'ІТ та кібербезпека',
    processName:     'Захист персональних даних',
    processDesc:     'Процес збору, обробки та зберігання персональних даних працівників та клієнтів',
    vndName:         'Політика інформаційної безпеки від 15.03.2023',
    riskName:        'Ризик витоку персональних даних',
    riskDesc:        'Можливість несанкціонованого доступу до персональних даних внаслідок кібератаки або помилки персоналу',
    infoSource:      'Аудиторський звіт',
    infoSourceDesc:  'Аудит ІТ-безпеки виявив вразливості в системі контролю доступу',
    probability:     2,
    financialImpact: 3,
    nonFinancialImpact: 4,
    riskScore:       8,
    riskLevelDesc:   'Імовірність: середня, випадків не було але вразливості виявлені. Фінансовий вплив: штрафи до 1 млн грн. Нефінансовий: репутаційні втрати.',
    actualLosses:    'Відсутні',
    measureNumber:   'ПЗ-2024-002',
    status:          'MONITORED',
  },
  {
    id: 3,
    edrpou:          '12345678',
    instrument:      'Спостереження',
    direction:       'Операційна діяльність',
    processName:     'Управління складськими запасами',
    processDesc:     'Процес обліку, зберігання та руху матеріальних цінностей на складі',
    vndName:         'Інструкція з управління запасами від 10.06.2022',
    riskName:        'Ризик нестачі критичних матеріалів',
    riskDesc:        'Можливість зупинки виробництва внаслідок відсутності необхідних матеріалів',
    infoSource:      'Звіт відділу постачання',
    infoSourceDesc:  'Зафіксовано 3 випадки зупинки виробництва через нестачу матеріалів у 2023 році',
    probability:     4,
    financialImpact: 5,
    nonFinancialImpact: 5,
    riskScore:       20,
    riskLevelDesc:   'Імовірність: дуже висока, повторювалась протягом року. Фінансовий вплив: критичний, понад 10% активів. Нефінансовий: критичний, зупинка виробництва.',
    actualLosses:    '2 300 000 грн за 2022-2024 рр.',
    measureNumber:   'ПЗ-2024-003',
    status:          'ACTIVE',
  },
  {
    id: 4,
    edrpou:          '12345678',
    instrument:      'Анкетування',
    direction:       'Кадрова діяльність',
    processName:     'Підбір та утримання персоналу',
    processDesc:     'Процес залучення, навчання та утримання кваліфікованих працівників',
    vndName:         'Положення про кадрову політику від 01.09.2022',
    riskName:        'Ризик відтоку кваліфікованих кадрів',
    riskDesc:        'Можливість втрати ключових спеціалістів внаслідок незадовільних умов праці або кращих пропозицій конкурентів',
    infoSource:      'HR аналітика',
    infoSourceDesc:  'Плинність кадрів зросла на 15% порівняно з попереднім роком',
    probability:     3,
    financialImpact: 2,
    nonFinancialImpact: 3,
    riskScore:       9,
    riskLevelDesc:   'Імовірність: висока через поточну ринкову ситуацію. Фінансовий вплив: витрати на підбір до 300 тис грн. Нефінансовий: втрата компетенцій.',
    actualLosses:    '180 000 грн за 2023-2024 рр.',
    measureNumber:   'ПЗ-2024-004',
    status:          'MITIGATED',
  },
  {
    id: 5,
    edrpou:          '12345678',
    instrument:      'Мозковий штурм',
    direction:       'Compliance',
    processName:     'Дотримання податкового законодавства',
    processDesc:     'Процес своєчасної підготовки та подачі податкової звітності',
    vndName:         'Регламент податкового обліку від 20.11.2022',
    riskName:        'Ризик податкових штрафів',
    riskDesc:        'Можливість нарахування штрафних санкцій внаслідок помилок у податковій звітності',
    infoSource:      'Результати податкової перевірки',
    infoSourceDesc:  'Попередня перевірка виявила неточності в декларуванні ПДВ',
    probability:     2,
    financialImpact: 3,
    nonFinancialImpact: 2,
    riskScore:       6,
    riskLevelDesc:   'Імовірність: середня, помилки виявлені але не систематичні. Фінансовий вплив: штрафи до 500 тис грн. Нефінансовий: помірний.',
    actualLosses:    '95 000 грн у 2023 р.',
    measureNumber:   'ПЗ-2024-005',
    status:          'MONITORED',
  },
];
