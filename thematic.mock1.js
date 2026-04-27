// src/scripts/data/thematic.mock.js

export const ASSESSMENT_STATUSES = {
  DRAFT:    { label: 'Чернетка',    class: 'badge--neutral'  },
  PENDING:  { label: 'На розгляді', class: 'badge--warning'  },
  APPROVED: { label: 'Погоджено',   class: 'badge--success'  },
};

export const IMPACT_METHODS = [
  'Уникнення',
  'Зниження',
  'Передача',
  'Прийняття',
];

export const generateAssessmentId = () => {
  const year = new Date().getFullYear();
  const num  = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  return `ТО-${year}-${num}`;
};

export const generateThematicRiskId = () => {
  const year = new Date().getFullYear();
  const num  = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  return `ТР-${year}-${num}`;
};

export const generateThematicMeasureId = () => {
  const year = new Date().getFullYear();
  const num  = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  return `ПЗТ-${year}-${num}`;
};

// Заходи тепер масив measures[] в кожному ризику
export const THEMATIC_ASSESSMENTS_MOCK = [
  {
    id:           'ТО-2024-001',
    title:        'Тематична оцінка ризиків фінансової діяльності',
    coordinator:  'Іваненко Іван Іванович',
    approvedBy:   'Директор Коваленко В.П.',
    approvedDate: '2024-02-01',
    orderNumber:  '12',
    status:       'APPROVED',
    description:  'Комплексна оцінка ризиків фінансової діяльності підприємства за 2024 рік',
    createdAt:    '2024-01-15T10:00:00.000Z',
    risks: [
      {
        id:                 'ТР-2024-001',
        instrument:         'Інтерв\'ю',
        direction:          'Фінансова діяльність',
        processName:        'Управління дебіторською заборгованістю',
        processDesc:        'Процес контролю та стягнення дебіторської заборгованості',
        vndName:            'Положення про фінансовий контроль',
        vndOrderNumber:     '45',
        vndOrderDate:       '2023-01-01',
        riskName:           'Ризик несвоєчасного погашення дебіторської заборгованості',
        riskDesc:           'Можливість виникнення збитків внаслідок несвоєчасної оплати контрагентами',
        infoSource:         'Фінансова звітність',
        infoSourceDesc:     'Аналіз балансу виявив зростання заборгованості на 23%',
        probability:        3,
        financialImpact:    4,
        nonFinancialImpact: 2,
        riskScore:          12,
        riskLevelDesc:      'Імовірність висока через повторні випадки. Фінансовий вплив значний.',
        existingControls:   'Щомісячний моніторинг дебіторської заборгованості',
        impactMethod:       'Зниження',
        measures: [
          {
            id:          'ПЗТ-2024-001',
            title:       'Впровадження системи моніторингу дебіторської заборгованості',
            desc:        'Автоматизована система контролю строків погашення з щотижневим звітуванням',
            responsible: 'Фінансовий відділ',
            deadline:    '2024-06-30',
          },
          {
            id:          'ПЗТ-2024-002',
            title:       'Перегляд договірних умов з контрагентами',
            desc:        'Скорочення строків оплати з 60 до 30 днів, введення штрафних санкцій',
            responsible: 'Юридичний відділ',
            deadline:    '2024-03-31',
          },
        ],
      },
      {
        id:                 'ТР-2024-002',
        instrument:         'Аналіз документів',
        direction:          'Фінансова діяльність',
        processName:        'Управління ліквідністю',
        processDesc:        'Процес забезпечення достатнього рівня грошових коштів',
        vndName:            'Фінансова політика підприємства',
        vndOrderNumber:     '67',
        vndOrderDate:       '2023-03-15',
        riskName:           'Ризик касового розриву',
        riskDesc:           'Можливість виникнення тимчасового дефіциту грошових коштів',
        infoSource:         'Касові плани',
        infoSourceDesc:     'Аналіз виявив 2 епізоди касового розриву у 2023 році',
        probability:        2,
        financialImpact:    3,
        nonFinancialImpact: 2,
        riskScore:          6,
        riskLevelDesc:      'Імовірність середня. Додаткові витрати на залучення кредитів.',
        existingControls:   'Щотижневий аналіз залишків коштів',
        impactMethod:       'Зниження',
        measures: [
          {
            id:          'ПЗТ-2024-003',
            title:       'Розробка платіжного календаря',
            desc:        'Щотижневий платіжний календар з прогнозуванням на 30 днів',
            responsible: 'Бухгалтерія',
            deadline:    '2024-04-30',
          },
        ],
      },
    ],
  },
  {
    id:           'ТО-2024-002',
    title:        'Тематична оцінка ризиків ІТ та кібербезпеки',
    coordinator:  'Петренко Петро Петрович',
    approvedBy:   null,
    approvedDate: null,
    orderNumber:  null,
    status:       'DRAFT',
    description:  'Оцінка ризиків інформаційної безпеки та захисту даних',
    createdAt:    '2024-03-20T09:00:00.000Z',
    risks: [
      {
        id:                 'ТР-2024-003',
        instrument:         'Аналіз документів',
        direction:          'ІТ та кібербезпека',
        processName:        'Захист персональних даних',
        processDesc:        'Процес збору, обробки та зберігання персональних даних',
        vndName:            'Політика інформаційної безпеки',
        vndOrderNumber:     '89',
        vndOrderDate:       '2023-05-10',
        riskName:           'Ризик витоку персональних даних',
        riskDesc:           'Можливість несанкціонованого доступу до персональних даних',
        infoSource:         'Аудиторський звіт',
        infoSourceDesc:     'Аудит виявив вразливості в системі контролю доступу',
        probability:        2,
        financialImpact:    3,
        nonFinancialImpact: 4,
        riskScore:          8,
        riskLevelDesc:      'Імовірність середня. Нефінансовий вплив значний через репутаційні втрати.',
        existingControls:   'Антивірусний захист, файрвол',
        impactMethod:       'Зниження',
        measures: [
          {
            id:          'ПЗТ-2024-004',
            title:       'Впровадження багатофакторної автентифікації',
            desc:        'Налаштування 2FA для всіх співробітників з доступом до персональних даних',
            responsible: 'ІТ відділ',
            deadline:    '2024-07-31',
          },
          {
            id:          'ПЗТ-2024-005',
            title:       'Навчання персоналу з кібербезпеки',
            desc:        'Щоквартальні тренінги з виявлення фішингових атак',
            responsible: 'ІТ відділ',
            deadline:    '2024-09-30',
          },
        ],
      },
    ],
  },
  {
    id:           'ТО-2024-003',
    title:        'Тематична оцінка операційних ризиків виробництва',
    coordinator:  'Сидоренко Сидір Сидорович',
    approvedBy:   'Директор Коваленко В.П.',
    approvedDate: '2024-04-15',
    orderNumber:  '34',
    status:       'APPROVED',
    description:  'Оцінка операційних ризиків виробничих процесів підприємства',
    createdAt:    '2024-04-01T08:00:00.000Z',
    risks: [
      {
        id:                 'ТР-2024-004',
        instrument:         'Спостереження',
        direction:          'Операційна діяльність',
        processName:        'Управління складськими запасами',
        processDesc:        'Процес обліку, зберігання та руху матеріальних цінностей',
        vndName:            'Інструкція з управління запасами',
        vndOrderNumber:     '23',
        vndOrderDate:       '2022-06-10',
        riskName:           'Ризик нестачі критичних матеріалів',
        riskDesc:           'Можливість зупинки виробництва через відсутність необхідних матеріалів',
        infoSource:         'Звіт відділу постачання',
        infoSourceDesc:     'Зафіксовано 3 випадки зупинки виробництва у 2023 році',
        probability:        4,
        financialImpact:    5,
        nonFinancialImpact: 5,
        riskScore:          20,
        riskLevelDesc:      'Імовірність дуже висока. Вплив критичний — зупинка виробництва.',
        existingControls:   'Щомісячний облік запасів',
        impactMethod:       'Зниження',
        measures: [
          {
            id:          'ПЗТ-2024-006',
            title:       'Диверсифікація бази постачальників',
            desc:        'Укладання договорів з альтернативними постачальниками — мінімум 3 на позицію',
            responsible: 'Відділ закупівель',
            deadline:    '2024-08-31',
          },
          {
            id:          'ПЗТ-2024-007',
            title:       'Створення страхового запасу матеріалів',
            desc:        'Формування складського запасу критичних матеріалів на 30 днів виробництва',
            responsible: 'Відділ логістики',
            deadline:    '2024-06-30',
          },
          {
            id:          'ПЗТ-2024-008',
            title:       'Оптимізація системи управління запасами',
            desc:        'Впровадження автоматичного замовлення при досягненні мінімального рівня',
            responsible: 'ІТ відділ',
            deadline:    '2024-12-31',
          },
        ],
      },
    ],
  },
  {
    id:           'ТО-2024-004',
    title:        'Тематична оцінка кадрових ризиків',
    coordinator:  'Коваль Олена Михайлівна',
    approvedBy:   null,
    approvedDate: null,
    orderNumber:  null,
    status:       'PENDING',
    description:  'Оцінка ризиків у сфері управління персоналом та охорони праці',
    createdAt:    '2024-05-10T11:00:00.000Z',
    risks: [
      {
        id:                 'ТР-2024-006',
        instrument:         'Анкетування',
        direction:          'Кадрова діяльність',
        processName:        'Підбір та утримання персоналу',
        processDesc:        'Процес залучення, навчання та утримання кваліфікованих працівників',
        vndName:            'Положення про кадрову політику',
        vndOrderNumber:     '56',
        vndOrderDate:       '2022-09-01',
        riskName:           'Ризик відтоку кваліфікованих кадрів',
        riskDesc:           'Можливість втрати ключових спеціалістів через кращі пропозиції конкурентів',
        infoSource:         'HR аналітика',
        infoSourceDesc:     'Плинність кадрів зросла на 15% порівняно з попереднім роком',
        probability:        3,
        financialImpact:    2,
        nonFinancialImpact: 3,
        riskScore:          9,
        riskLevelDesc:      'Імовірність висока. Нефінансовий вплив — втрата компетенцій.',
        existingControls:   'Щорічна індексація зарплат',
        impactMethod:       'Зниження',
        measures: [
          {
            id:          'ПЗТ-2024-009',
            title:       'Програма утримання ключових спеціалістів',
            desc:        'Система нематеріальної мотивації та кар\'єрного розвитку',
            responsible: 'Відділ кадрів',
            deadline:    '2024-09-30',
          },
        ],
      },
    ],
  },
  {
    id:           'ТО-2024-005',
    title:        'Тематична оцінка комплаєнс ризиків',
    coordinator:  'Мороз Андрій Валентинович',
    approvedBy:   'Директор Коваленко В.П.',
    approvedDate: '2024-06-20',
    orderNumber:  '67',
    status:       'APPROVED',
    description:  'Оцінка ризиків дотримання законодавчих вимог та антикорупційного комплаєнсу',
    createdAt:    '2024-06-01T09:30:00.000Z',
    risks: [
      {
        id:                 'ТР-2024-008',
        instrument:         'Мозковий штурм',
        direction:          'Compliance',
        processName:        'Дотримання податкового законодавства',
        processDesc:        'Процес своєчасної підготовки та подачі податкової звітності',
        vndName:            'Регламент податкового обліку',
        vndOrderNumber:     '91',
        vndOrderDate:       '2022-11-20',
        riskName:           'Ризик податкових штрафів',
        riskDesc:           'Можливість нарахування штрафних санкцій через помилки у звітності',
        infoSource:         'Результати податкової перевірки',
        infoSourceDesc:     'Попередня перевірка виявила неточності в декларуванні ПДВ',
        probability:        2,
        financialImpact:    3,
        nonFinancialImpact: 2,
        riskScore:          6,
        riskLevelDesc:      'Імовірність середня. Фінансовий вплив — штрафи до 500 тис грн.',
        existingControls:   'Щоквартальна звірка з податковою',
        impactMethod:       'Зниження',
        measures: [
          {
            id:          'ПЗТ-2024-010',
            title:       'Автоматизація податкової звітності',
            desc:        'Впровадження ПЗ для автоматичної перевірки звітності',
            responsible: 'Бухгалтерія',
            deadline:    '2024-11-30',
          },
        ],
      },
    ],
  },
];
