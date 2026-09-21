// ==============================================================================
// SPARK ENTERPRISE RULES MANIFEST : СТРАТЕГИЧЕСКИЙ МАНИФЕСТ ПРАВИЛ ИИ
// Файл: utils/spark_rules_manifest.js
// Назначение: Юридические, налоговые и финансовые ограничения ИИ Villa Turaman.
// Изоморфность: синхронизирован со стандартами GEMINI.md [Блок VII] и Code.js.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

const SPARK_RULES_MANIFEST = {
  // Налоговые и регистрационные реквизиты Турции
  tax: {
    vkn: '9991120181',
    taxOffice: 'Ortaca Malmüdürlüğü',
    governingLaw: 'VUK 213 [Vergi Usul Kanunu, Madde 230]',
    invoiceType: 'e-Arşiv Fatura / KDV',
    legalEntity: 'Aleksei Znamenskii [Villa Turaman]'
  },

  // Финансовые границы и ценообразование
  pricing: {
    minPriceUsd: 180,
    maxDiscountPercent: 10,
    discountCondition: 'Только невозвратный тариф на даты выезда в пределах 60 дней',
    strictlyForbidden: 'Обещать или подтверждать скидки ниже 180 USD за ночь без личного согласия владельца Алексея'
  },

  // Золотая формула переговоров 30/70
  negotiation: {
    empathyWeightPercent: 30,
    legalTaxWeightPercent: 70,
    corePrinciples: [
      '30% эмпатии и вежливого удержания гостя в позитивном диалоге',
      '70% аргументированного юридического и финансового отстаивания позиций владельца',
      'Запрет досрочного закрытия диалога при наличии активного собеседника или в пределах 15-минутного окна',
      'Строгое информирование о необходимости регистрации паспортов всех проживающих гостей в жандармерии через KBS в первые 24 часа'
    ]
  },

  // Бытовые правила виллы
  houseRules: {
    checkInTime: '16:00',
    checkOutTime: '10:00',
    quietHours: '23:00 - 08:00',
    poolHours: 'Подсветка бассейна и джакузи: 20:00 - 01:00',
    jacuzziSchedule: 'Работает с 09:00 до 18:00 каждые 45 минут на 15 минут',
    wifiDefault: 'VillaTuraman_5G / villa2026'
  }
};

/**
 * Сборка системной секции правил SPARK для промпта Gemini 3.6 Flash
 */
function buildSparkRulesPromptSection() {
  return [
    'ФИНАНСОВЫЙ И ЮРИДИЧЕСКИЙ МАНИФЕСТ SPARK RULES:',
    `- Минимальная цена за ночь: ${SPARK_RULES_MANIFEST.pricing.minPriceUsd} USD [скидки ниже запрещены].`,
    `- Скидка 10% допустима строго при условии: ${SPARK_RULES_MANIFEST.pricing.discountCondition}.`,
    `- Налоговый стандарт: VKN ${SPARK_RULES_MANIFEST.tax.vkn}, закон ${SPARK_RULES_MANIFEST.tax.governingLaw}.`,
    `- Формула переговоров: ${SPARK_RULES_MANIFEST.negotiation.empathyWeightPercent}% эмпатии и гостеприимства / ${SPARK_RULES_MANIFEST.negotiation.legalTaxWeightPercent}% юридической и финансовой твердости.`,
    `- Регистрация KBS: обязательна для всех гостей старше 0 лет согласно турецкому законодательству.`
  ].join('\n');
}

module.exports = {
  SPARK_RULES_MANIFEST,
  buildSparkRulesPromptSection
};
