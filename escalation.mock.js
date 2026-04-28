// src/scripts/data/escalation.mock.js

export const EVENT_TYPES = [
  'Фінансові втрати',
  'Операційний збій',
  'Кібератака / витік даних',
  'Порушення законодавства',
  'Нещасний випадок',
  'Екологічний інцидент',
  'Репутаційний збиток',
  'Корупційні дії',
  'Форс-мажор',
  'Інше',
];

export const EVENT_STATUSES = {
  NEW:         { label: 'Нова',          class: 'badge--danger'   },
  IN_PROGRESS: { label: 'В роботі',      class: 'badge--warning'  },
  CONTROLLED:  { label: 'Контролюється', class: 'badge--info'     },
  RESOLVED:    { label: 'Вирішено',      class: 'badge--success'  },
  CLOSED:      { label: 'Закрито',       class: 'badge--neutral'  },
};

export const MEASURE_EXECUTION_STATUSES = [
  'Заплановано',
  'В процесі',
  'Виконано',
  'Прострочено',
];

export const generateEventId = () => {
  const year = new Date().getFullYear();
  const num  = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  return `СП-${year}-${num}`;
};

export const EVENTS_MOCK = [
  {
    id:               'СП-2024-001',
    title:            'Несанкціонований доступ до бази даних клієнтів',
    description:      'Виявлено спробу несанкціонованого доступу до бази персональних даних клієнтів через вразливість у веб-додатку',
    eventType:        'Кібератака / витік даних',
    eventDate:        '2024-03-15',
    discoveryDate:    '2024-03-15',
    status:           'RESOLVED',
    reportPosition:   'Начальник відділу ІБ',
    reportPerson:     'Петренко П.П.',
    riskType:         'ІТ та кібербезпека',
    takenMeasures:    'Заблоковано вразливість, проведено аудит доступів, повідомлено регулятора',
    involvedPersons:  'ІТ відділ, Юридичний відділ, Керівництво',
    financialImpact: {
      losses:       0.15,
      reserve:      0.05,
      plannedLosses: 0,
      compensation: 0,
    },
    hasOtherCompanies: false,
    otherCompanies:    [],
    nonFinancialImpact: 'Тимчасове призупинення роботи веб-порталу на 4 години. Репутаційні ризики через публікації в ЗМІ.',
    measure:           'Впровадження системи виявлення вторгнень (IDS)',
    responsible:       'ІТ відділ',
    deadline:          '2024-06-30',
    executionStatus:   'Виконано',
    approvedBy:        'Директор, Наказ №78 від 20.03.2024',
    createdAt:         '2024-03-15T14:00:00.000Z',
  },
  {
    id:               'СП-2024-002',
    title:            'Зупинка виробничої лінії через поломку обладнання',
    description:      'Аварійний вихід з ладу головного пресового обладнання спричинив зупинку виробничої лінії №3 на 72 години',
    eventType:        'Операційний збій',
    eventDate:        '2024-05-10',
    discoveryDate:    '2024-05-10',
    status:           'CLOSED',
    reportPosition:   'Начальник виробничого цеху',
    reportPerson:     'Сидоренко С.С.',
    riskType:         'Операційна діяльність',
    takenMeasures:    'Проведено аварійний ремонт, залучено резервне обладнання, переорієнтовано виробництво',
    involvedPersons:  'Технічний відділ, Виробничий відділ, Відділ постачання',
    financialImpact: {
      losses:        2.3,
      reserve:       0.5,
      plannedLosses: 0.8,
      compensation:  1.2,
    },
    hasOtherCompanies: true,
    otherCompanies: [
      { name: 'ДП "Завод №1"', edrpou: '11111111', amount: 0.5 },
      { name: 'ДП "Завод №2"', edrpou: '22222222', amount: 0.3 },
    ],
    nonFinancialImpact: 'Затримка поставок замовникам на 5 днів. Погіршення репутації надійного постачальника.',
    measure:           'Придбання резервного пресового обладнання',
    responsible:       'Технічний відділ',
    deadline:          '2024-09-30',
    executionStatus:   'В процесі',
    approvedBy:        'Директор, Наказ №102 від 15.05.2024',
    createdAt:         '2024-05-10T08:00:00.000Z',
  },
  {
    id:               'СП-2024-003',
    title:            'Штраф за порушення податкового законодавства',
    description:      'За результатами планової податкової перевірки нараховано штраф за помилки в декларуванні ПДВ за I квартал 2024 року',
    eventType:        'Порушення законодавства',
    eventDate:        '2024-06-20',
    discoveryDate:    '2024-06-20',
    status:           'IN_PROGRESS',
    reportPosition:   'Головний бухгалтер',
    reportPerson:     'Коваленко К.К.',
    riskType:         'Compliance',
    takenMeasures:    'Подано апеляцію, залучено податкового консультанта, виправлено декларацію',
    involvedPersons:  'Бухгалтерія, Юридичний відділ',
    financialImpact: {
      losses:        0.095,
      reserve:       0.05,
      plannedLosses: 0,
      compensation:  0,
    },
    hasOtherCompanies: false,
    otherCompanies:    [],
    nonFinancialImpact: 'Репутаційний ризик. Можливі додаткові перевірки з боку податкових органів.',
    measure:           'Автоматизація перевірки податкової звітності',
    responsible:       'Бухгалтерія',
    deadline:          '2024-12-31',
    executionStatus:   'В процесі',
    approvedBy:        'Директор, Наказ №145 від 25.06.2024',
    createdAt:         '2024-06-20T10:00:00.000Z',
  },
];
