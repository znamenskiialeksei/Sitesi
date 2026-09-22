// ==============================================================================
// ЕДИНЫЙ ДВИЖОК ИИ-КОНСЬЕРЖА: GOOGLE GEMINI 3.6 FLASH
// Файл: utils/aiConciergeEngine.js
// Назначение: Единое серверное ядро генерации ответов гостям виллы:
// 1. Непрерывная память диалога [анализ последних сообщений];
// 2. Интеллектуальный маршрутизатор интентов Intent Routing;
// 3. Прямая инъекция контактов партнеров из Google Sheets SSOT;
// 4. Категорический запрет встречных вопросов вместо выдачи телефона Ахмета;
// 5. Единая логика для гостевого чата [booking.js] и суфлера хозяина [ai-concierge.js].
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import { getAiKnowledgeBase } from './aiKnowledgeBase';
import { classifyIntent, classifyGuestStage, globalKnowledgeGraph } from './aiKnowledgeGraph';
import { buildSparkRulesPromptSection } from './spark_rules_manifest';
import { tryAssembleFaqReply } from './faqCacheEngine';

const DEFAULT_MODEL = 'gemini-3.6-flash';

/**
 * Единый генератор ответов ИИ-Консьержа
 * @param {Object} params
 * @param {string} params.guestMessage - Текущее сообщение гостя
 * @param {string} params.guestName - Имя гостя
 * @param {string} params.contact - Контакт гостя [телефон или email]
 * @param {Array} params.chatHistory - Предыдущие сообщения в чате
 * @param {Object} [params.providedKb] - Опциональная предзагруженная база знаний
 * @param {string} [params.guestStage] - Стадия вовлеченности гостя
 * @param {Object} [params.bookingContext] - Контекст бронирования гостя
 */
export async function generateConciergeReply({
  guestMessage = '',
  guestName = 'Гость',
  contact = '',
  chatHistory = [],
  providedKb = null,
  guestStage = null,
  bookingContext = {}
}) {
  const kb = providedKb || await getAiKnowledgeBase();
  const effectiveStage = guestStage || classifyGuestStage(bookingContext);

  // --- УРОВЕНЬ 1: ДВУХУРОВНЕВЫЙ КЭШ ТИПОВЫХ РЕШЕНИЙ FAQ CACHE ---
  // Моментальная композитная сборка из шаблонов без расхода токенов и без задержек
  const faqResult = tryAssembleFaqReply({
    guestMessage,
    guestName,
    lang: bookingContext.lang || 'ru',
    guestStage: effectiveStage,
    bookingContext,
    templates: kb.templates || [],
    settingsMap: kb.variables || kb.blocks?.variables || {},
    graph: kb.graph || globalKnowledgeGraph
  });

  if (faqResult.success && faqResult.replyText) {
    return {
      success: true,
      isRealAi: false,
      isCachedFaq: true,
      replyText: faqResult.replyText,
      intent: faqResult.matchedTopics?.[0] || 'FAQ_TEMPLATE',
      guestStage: effectiveStage,
      model: 'faq_cache_assembler'
    };
  }

  // --- УРОВЕНЬ 2: ИНТЕЛЛЕКТУАЛЬНЫЙ ВЫЗОВ GEMINI 3.6 FLASH ---
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const model = (kb.geminiModel || process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();

  if (!apiKey) {
    return {
      success: false,
      isRealAi: false,
      error: 'Ключ GEMINI_API_KEY не обнаружен на Vercel [Environment Variables]',
      replyText: ''
    };
  }

  // 1. Формирование истории переписки для сохранения контекста диалога
  const historyLines = (chatHistory || [])
    .slice(-8)
    .map((m) => {
      const sender = m.sender || (m.isHost ? 'Владелец' : 'Гость');
      const text = (m.original || m.ru || m.text || '').trim();
      return text ? `${sender}: ${text}` : null;
    })
    .filter(Boolean);

  const accumulatedText = `${historyLines.join(' ')} ${guestMessage}`.toLowerCase();

  // 2. Определение намерения гостя с учетом всей истории переписки
  let intent = classifyIntent(accumulatedText);
  if (
    accumulatedText.includes('трансфер') ||
    accumulatedText.includes('такси') ||
    accumulatedText.includes('transfer') ||
    accumulatedText.includes('taxi') ||
    accumulatedText.includes('аэропорт') ||
    accumulatedText.includes('даламан') ||
    accumulatedText.includes('водитель') ||
    accumulatedText.includes('передач')
  ) {
    intent = 'TRANSFER_TRANSPORT';
  }

  // 3. Извлечение переменных и контактов из SSOT базы Google Таблиц
  const vars = kb.blocks?.variables || kb.variables || {};
  const transferPartnerName = vars.transfer_partner_name || 'Dalyan VIP Transfer Service';
  const transferPartnerPhone = vars.transfer_partner_phone || '+90 543 335 80 70';
  const transferPartnerContact = vars.transfer_partner_contact || 'Ahmet';
  const transferPartnerWhatsapp = vars.transfer_partner_whatsapp || '+90 543 335 80 70';
  const cleanHostPhone = (vars.host_phone && !vars.host_phone.includes('000 00 00')) ? vars.host_phone : '';
  const cleanHostWhatsapp = (vars.host_whatsapp && !vars.host_whatsapp.includes('000 00 00')) ? vars.host_whatsapp : '';
  const hostTelegram = vars.host_telegram || '@villaturaman';
  const hostContactInfo = cleanHostPhone
    ? `Телефон: ${cleanHostPhone}, WhatsApp: ${cleanHostWhatsapp || cleanHostPhone}, Telegram: ${hostTelegram}`
    : `Telegram: ${hostTelegram}, прямой телефон и код доступа к вилле отправляются гостю в подтверждении бронирования`;

  const address = vars.address || 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla';
  const wifiName = vars.wifi_name || 'Guest';
  const wifiPass = vars.wifi_password || 'villa2026';
  const minPrice = kb.minPriceUsd || 180;

  // 4. Сборка системного промпта
  let systemInstruction = kb.systemPrompt || '';
  if (!systemInstruction) {
    systemInstruction = 'Ты: персональный ИИ-консьерж суперхозяина Алексея Знаменского на вилле Villa Turaman в Дальяне, Турция. Твоя миссия: гостеприимно, дипломатично, точно и авторитетно отвечать гостям на языке их обращения [RU, EN, TR]. Все факты берутся строго из Google Таблиц экосистемы.';
  }

  // 4.1. Динамический финансовый регламент и тарифный коридор
  const pa = kb.pricingAnalysis || {};
  const corridor = pa.discountCorridor || {};
  const baseP = pa.basePriceUsd || 250;
  const floorP = pa.minNightFloorUsd || minPrice;
  const maxDiscPct = corridor.maxDiscountPercent || 28;
  const flexP = corridor.standardFlexiblePrice || baseP;
  const nonRefP = corridor.nonRefundable10Percent || Math.max(floorP, Math.round(baseP * 0.9));
  const weeklyP = corridor.weeklyStay15Percent || Math.max(floorP, Math.round(baseP * 0.85));
  const gapP = corridor.gapSpecial20Percent || Math.max(floorP, Math.round(baseP * 0.8));

  systemInstruction += `\n\nТАРИФНЫЙ КОРИДОР И ЦЕНОВАЯ ПОЛИТИКА:`;
  systemInstruction += `\n• Базовая цена: ${baseP} USD за сутки [стандартный гибкий тариф: ${flexP} USD].`;
  systemInstruction += `\n• АБСОЛЮТНЫЙ МИНИМАЛЬНЫЙ ПОРОГ: ${floorP} USD за сутки. Любая цена ниже ${floorP} USD КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНА.`;
  systemInstruction += `\n• Коридор скидок: разница между базой ${baseP} USD и порогом ${floorP} USD составляет до ${maxDiscPct}%.`;
  systemInstruction += `\n• Пакеты скидок:`;
  systemInstruction += `\n  - Невозвратный тариф [скидка 10%]: ${nonRefP} USD / сутки;`;
  systemInstruction += `\n  - Проживание от 7 ночей [скидка 15%]: ${weeklyP} USD / сутки;`;
  systemInstruction += `\n  - Заполнение свободных окон между бронированиями [скидка до 20%]: от ${gapP} USD / сутки;`;
  systemInstruction += `\n  - Прямое бронирование на нашем сайте: экономия 15-20% относительно комиссий OTA платформ [Airbnb, Booking.com, Vrbo, Avito, Agoda]. Гарантия лучшей цены Best Rate Guarantee!`;

  // 4.2. Омни-календарь 6 OTA платформ и доступность
  const cal = kb.calendarData || {};
  const gaps = cal.availableGaps || [];
  const holds = cal.activeHolds || [];
  const extResCount = (cal.externalReservations || []).length;
  systemInstruction += `\n\nОМНИ-КАЛЕНДАРЬ И 6 СИНХРОНИЗИРОВАННЫХ OTA ПЛАТФОРМ:`;
  systemInstruction += `\n• Все даты синхронизируются в реальном времени с 6 внешними каналами: Airbnb, Booking.com, Vrbo, Avito, Agoda, Google Calendar.`;
  systemInstruction += `\n• Внешних бронирований на контроле: ${extResCount}. Овербукинг исключен на 100%.`;
  if (holds.length > 0) {
    systemInstruction += `\n• Текущие активные блокировки [HOLD на 24 часа в ожидании оплаты]: ${holds.length} шт.`;
  }
  if (gaps.length > 0) {
    const gapList = gaps.slice(0, 3).map((g) => `${g.start} - ${g.end} [${g.nights} ноч.]`).join(', ');
    systemInstruction += `\n• Ближайшие свободные окна для заезда: ${gapList}. При заполнении окон предлагай гостю спецусловия от ${gapP} USD!`;
  }

  // 4.3. Официальные реквизиты и контакты объекта с маскировкой по стадии
  systemInstruction += `\n\nОФИЦИАЛЬНЫЕ РЕКВИЗИТЫ И КОНТАКТЫ ЭКОСИСТЕМЫ:`;
  systemInstruction += `\n• Адрес виллы: ${address}`;
  if (effectiveStage === 'STAGE_1_LEAD') {
    systemInstruction += `\n• БЕЗОПАСНОСТЬ [СТАДИЯ ЛИД ДО ОПЛАТЫ]: Пароль от Wi-Fi и индивидуальный пин-код замка виллы СТРОГО СКРЫТЫ. Сообщай гостю, что скоростной Wi-Fi 100 Мбит/с и смарт-код двери активируются сразу после подтверждения бронирования.`;
  } else {
    systemInstruction += `\n• Wi-Fi: Сеть ${wifiName}, Пароль ${wifiPass}`;
  }
  systemInstruction += `\n• Стандартный заезд: ${cal.settings?.checkInTime || '16:00'}, Стандартный выезд: ${cal.settings?.checkOutTime || '10:00'}`;
  systemInstruction += `\n• Суперхозяин: Алексей Знаменский [${hostContactInfo}]`;
  systemInstruction += `\n• Проверенный партнер по трансферу: ${transferPartnerName} [Координатор: ${transferPartnerContact}, Телефон: ${transferPartnerPhone}, WhatsApp: ${transferPartnerWhatsapp}, Авто: Mercedes Vito VIP, Тариф: 50 EUR / 1800 TRY]`;
  systemInstruction += `\n• Проверенный партнер по лодке: Капитан Адам [Телефон / WhatsApp: +90 544 588 58 09]`;
  systemInstruction += `\n• Рекомендованный семейный ресторан: Çiçek Restaurant [Dalyan, Rodoslu Yaşar Sünger Sk, баранина, сибас, мезе]`;

  // 4.4. Стадия жизненного цикла гостя
  systemInstruction += `\n\nТЕКУЩАЯ СТАДИЯ ГОСТЯ: [${effectiveStage}]`;

  // Регламент KBS
  if (kb.kbs && Object.keys(kb.kbs).length > 0) {
    systemInstruction += `\n\nПРАВИЛА KBS ПОЛИЦИИ: Обязательная передача паспортных данных всех гостей до заезда согласно закону Kimlik Bildirme Kanunu 1774.`;
  }

  // Манифест SPARK
  systemInstruction += `\n\n${buildSparkRulesPromptSection()}`;

  // Микроконтекст графа знаний
  const microContext = (kb.graph || globalKnowledgeGraph).getContextForIntent(intent, effectiveStage, bookingContext);
  systemInstruction += `\n\nЦЕЛЕВОЙ МОДУЛЬ ЗНАНИЙ [ТЕМА: ${intent} | СТАДИЯ: ${effectiveStage}]:\n${microContext}`;

  // 5. БЕЗУСЛОВНЫЙ ИМПЕРАТИВНЫЙ ПРИКАЗ ПО ТРАНСФЕРУ
  if (intent === 'TRANSFER_TRANSPORT') {
    systemInstruction += `\n\n🚨 КРИТИЧЕСКОЕ ПРАВИЛО ПО ТРАНСФЕРУ И ПАРТНЕРАМ:\n` +
      `Гость спрашивает про трансфер, такси, водителя, партнера или просит телефон / контакты.\n` +
      `ТЫ ОБЯЗАН В ПЕРВЫХ ЖЕ СТРОКАХ СВОЕГО ОТВЕТА ВЫДАТЬ ПРЯМЫЕ КОНТАКТЫ АХМЕТА:\n` +
      `• Служба трансфера: ${transferPartnerName}\n` +
      `• Координатор: ${transferPartnerContact}\n` +
      `• Прямой телефон: ${transferPartnerPhone}\n` +
      `• WhatsApp: ${transferPartnerWhatsapp}\n` +
      `• Автомобиль: комфортабельный минивэн Mercedes Vito\n` +
      `• Стоимость: 50 EUR или 1800 TRY [фиксированный тариф виллы]\n` +
      `КАТЕГОРИЧЕСКИ И СТРОЖАЙШЕ ЗАПРЕЩЕНО запрашивать номер рейса, время прилета, объем багажа или количество пассажиров ДО или ВМЕСТО предоставления этих контактов!\n` +
      `Даже если гость пишет кратко: "просто пришлите телефон партнёра", "передача", "мне нужен трансфер" : СРАЗУ выдавай телефон Ахмета ${transferPartnerPhone}!\n` +
      `Сначала выдай прямой телефон, а затем при необходимости вежливо предложи помощь.`;
  }

  // 6. Формирование финального промпта с историей диалога
  let fullPrompt = `${systemInstruction}\n\n`;

  if (historyLines.length > 0) {
    fullPrompt += `ИСТОРИЯ ПРЕДЫДУЩИХ СООБЩЕНИЙ В ЭТОМ ДИАЛОГЕ:\n`;
    historyLines.forEach((line) => {
      fullPrompt += `${line}\n`;
    });
    fullPrompt += `\n`;
  }

  fullPrompt += `ТЕКУЩЕЕ СООБЩЕНИЕ ГОСТЯ: "${guestMessage}"\n`;
  fullPrompt += `ИМЯ ГОСТЯ: ${guestName} [${contact || 'Контакт в профиле'}]\n\n`;
  fullPrompt += `Сформулируй гостеприимный, лаконичный и точный ответ гостю. Строго следуй критическому правилу по трансферу, если тема касается поездки.`;

  // 7. Запрос к Google Gemini REST API
  try {
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.25, // Низкая температура для строгой точности и соблюдения инструкций
            maxOutputTokens: 2048
          }
        })
      }
    );

    const aiData = await aiRes.json();
    const replyText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!replyText) {
      return {
        success: false,
        isRealAi: false,
        error: aiData?.error?.message || 'Пустой ответ от Gemini API',
        replyText: ''
      };
    }

    return {
      success: true,
      isRealAi: true,
      replyText,
      intent,
      guestStage: effectiveStage,
      model
    };
  } catch (err) {
    return {
      success: false,
      isRealAi: false,
      error: err.message,
      replyText: ''
    };
  }
}
