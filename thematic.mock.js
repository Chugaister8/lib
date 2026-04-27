// src/scripts/data/thematic.mock.js

export const ASSESSMENT_STATUSES = {
  DRAFT:    { label: 'Чернетка',   class: 'badge--neutral'  },
  APPROVED: { label: 'Погоджено',  class: 'badge--success'  },
  PENDING:  { label: 'На розгляді', class: 'badge--warning' },
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

export const THEMATIC_ASSESSMENTS_MOCK = [
  {
    id:           'ТО-2024-001',
    title:        'Тематична оцінка ризиків фінансової діяльності',
    coordinator:  'Іваненко Іван Іванович',
    approvedBy:   null,
    approvedDate: null,
    orderNumber:  null,
    status:       'APPROVED',
    description:  'Комплексна оцінка ризиків фінансової діяльності підприємства за 2024 рік',
    createdAt:    '2024-01-15T10:00:00.000Z',
    risks: [
      {
        id:                  'ТР-2024-001',
        instrument:          'Інтерв\'ю',
        direction:           'Фінансова діяльність',
        processName:         'Управління дебіторською заборгованістю',
        processDesc:         'Процес контролю та стягнення дебіторської заборгованості',
        vndName:             'Положення про фінансовий контроль',
        vndOrderNumber:      '45',
        vndOrderDate:        '2023-01-01',
        riskName:            'Ризик несвоєчасного погашення дебіторської заборгованості',
        riskDesc:            'Можливість виникнення збитків внаслідок несвоєчасної оплати',
        infoSource:          'Фінансова звітність',
        infoSourceDesc:      'Аналіз балансу виявив зростання заборгованості на 23%',
        probability:         3,
        financialImpact:     4,
        nonFinancialImpact:  2,
        riskScore:           12,
        riskLevelDesc:       'Імовірність висока. Фінансовий вплив значний.',
        existingControls:    'Щомісячний моніторинг дебіторської заборгованості',
        impactMethod:        'Зниження',
        measureTitle:        'Впровадження системи моніторингу',
        measureDesc:         'Автоматизована система контролю строків погашення',
        responsible:         'Фінансовий відділ',
        deadline:            '2024-06-30',
      },
    ],
  },
  {
    id:           'ТО-2024-002',
    title:        'Тематична оцінка ІТ ризиків',
    coordinator:  'Петренко Петро Петрович',
    approvedBy:   null,
    approvedDate: null,
    orderNumber:  null,
    status:       'DRAFT',
    description:  'Оцінка ризиків інформаційної безпеки',
    createdAt:    '2024-03-20T09:00:00.000Z',
    risks:        [],
  },
];
