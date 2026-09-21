// ==============================================================================
// ИИ-КОНСЬЕРЖ И АССИСТЕНТ VILLA TURAMAN: GOOGLE GEMINI API
// Файл: pages/api/ai-concierge.js
// Назначение: Интеллектуальный генератор ответов и суфлер хозяина на базе Gemini 3.6 Flash.
// База знаний и промпт загружаются динамически из Google Таблиц через aiKnowledgeBase.
// Модель: gemini-3.6-flash [Google AI Studio Tier 1].
// Полная ликвидация примитивного подбора слов: 100% честный живой ИИ.
// 100% Zero-Brackets & Zero-Emdash Стандарт в строках и комментариях.
// ==============================================================================

import { getAiKnowledgeBase } from '../../utils/aiKnowledgeBase';
import { buildSparkRulesPromptSection } from '../../utils/spark_rules_manifest';

const DEFAULT_MODEL = 'gemini-3.6-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      guestMessage = '',
      guestName = 'Гость',
      contact = '',
      lang = 'ru',
      chatHistory = [],
      context = {}
    } = req.body;

    // 1. Загрузка динамической базы знаний из Google Таблиц с кэшированием
    const kb = await getAiKnowledgeBase();

    // Проверка активности ИИ и текущего режима [autopilot / copilot / off]
    const aiMode = kb.aiMode || 'copilot';
    const isAiActive = kb.aiEnabled !== false && aiMode !== 'off';

    if (!isAiActive) {
      return res.status(200).json({
        success: true,
        isRealAi: false,
        source: 'ai_disabled_in_settings',
        aiMode,
        model: 'none',
        reply: 'ИИ-Консьерж временно отключен владельцем в настройках таблицы.',
        note: 'Режим ИИ отключен в настройках таблицы: aiMode = off'
      });
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    const model = (kb.geminiModel || process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();

    // Если ключ Gemini не настроен: честно возвращаем статус ошибки без фейковой подмены
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        isRealAi: false,
        source: 'missing_api_key',
        aiMode,
        model,
        error: 'Ключ GEMINI_API_KEY не обнаружен в process.env на https://vercel.com/ [Environment Variables]'
      });
    }

    // 2. Формирование динамического системного промпта из Базы Знаний Таблицы
    let systemInstruction = kb.systemPrompt || '';
    if (!systemInstruction) {
      systemInstruction = 'Ты профессиональный ИИ-консьерж виллы Villa Turaman в городе Дальян, Турция. Владелец виллы: Алексей Знаменский. Твоя цель: помогать гостям и формулировать вежливые, точные и гостеприимные ответы на языке обращения гостя [RU, EN, TR].';
    }

    // Добавление финансовых ограничений из настроек таблицы
    const minPrice = kb.minPriceUsd || 180;
    systemInstruction += `\n\nФИНАНСОВЫЕ ГРАНИЦЫ И ПРАВИЛА:`;
    systemInstruction += `\n- Минимально допустимый тариф за ночь составляет ${minPrice} USD.`;
    systemInstruction += `\n- Скидка 10% действует только при невозвратном тарифе на даты выезда в пределах 60 дней.`;
    systemInstruction += `\n- Категорически запрещено обещать скидки ниже ${minPrice} USD без предварительного согласования с владельцем Алексеем.`;

    // Добавление актуальных реквизитов и переменных из Словаря Переменных Таблицы [VARIABLES]
    if (kb.variables && Object.keys(kb.variables).length > 0) {
      systemInstruction += `\n\nАКТУАЛЬНЫЕ ДАННЫЕ ОБЪЕКТА ИЗ СЛОВАРЯ ПЕРЕМЕННЫХ:`;
      for (const [k, v] of Object.entries(kb.variables)) {
        if (v && typeof v === 'string') {
          systemInstruction += `\n- ${k}: ${v}`;
        }
      }
    }

    // Добавление технических характеристик виллы [бассейн, джакузи, спальни, вместимость]
    if (kb.villa && Object.keys(kb.villa).length > 0) {
      systemInstruction += `\n\nТЕХНИЧЕСКИЕ ПАРАМЕТРЫ ВИЛЛЫ И УДОБСТВ:`;
      for (const [k, v] of Object.entries(kb.villa)) {
        if (v && typeof v === 'string') {
          systemInstruction += `\n- ${k}: ${v}`;
        }
      }
    }

    // Добавление инструкций обработки данных гостей для турецкой жандармерии KBS
    if (kb.kbs && Object.keys(kb.kbs).length > 0) {
      systemInstruction += `\n\nСПЕЦИАЛЬНЫЙ РЕЖИМ ОБРАБОТКИ KBS ЖАНДАРМЕРИИ:`;
      for (const [k, v] of Object.entries(kb.kbs)) {
        if (v && typeof v === 'string') {
          systemInstruction += `\n- ${k}: ${v}`;
        }
      }
    }

    // Добавление инструкций роли Консьержа и матрицы листов
    const conciergeRole = kb.agentRoles?.['Консьерж-Мастер'] || kb.agentRoles?.КОНСЬЕРЖ_МАСТЕР;
    if (conciergeRole?.prompt) {
      systemInstruction += `\n\nСПЕЦИАЛИЗАЦИЯ РОЛИ КОНСЬЕРЖА:\n${conciergeRole.prompt}`;
    }

    if (kb.sheetMatrix && Object.keys(kb.sheetMatrix).length > 0) {
      const allowedSheets = Object.entries(kb.sheetMatrix)
        .filter(([_, info]) => info.access !== 'ЗАПРЕЩЕНО' && info.prompt)
        .slice(0, 6);
      if (allowedSheets.length > 0) {
        systemInstruction += `\n\nКОНТЕКСТНЫЕ ИНСТРУКЦИИ ЛИСТОВ БАЗЫ ДАННЫХ:`;
        allowedSheets.forEach(([sheet, info]) => {
          systemInstruction += `\n- [${sheet}]: ${info.prompt}`;
        });
      }
    }

    // Добавление стратегического манифеста правил SPARK [Блок VII]
    systemInstruction += `\n\n${buildSparkRulesPromptSection()}`;

    // 3. Формирование контекста диалога для Gemini 3.6 Flash
    let conversationPrompt = `${systemInstruction}\n\n`;
    conversationPrompt += `ДАННЫЕ ТЕКУЩЕГО ГОСТЯ:\n`;
    conversationPrompt += `- Имя гостя: ${guestName}\n`;
    conversationPrompt += `- Контакт: ${contact}\n`;
    if (context.checkIn) conversationPrompt += `- Заезд: ${context.checkIn}\n`;
    if (context.checkOut) conversationPrompt += `- Выезд: ${context.checkOut}\n`;
    if (context.price) conversationPrompt += `- Сумма брони: ${context.price}\n`;

    if (chatHistory && chatHistory.length > 0) {
      conversationPrompt += `\nПОСЛЕДНИЕ СООБЩЕНИЯ В ЧАТЕ:\n`;
      const recent = chatHistory.slice(-6);
      recent.forEach((m) => {
        const sender = m.sender === 'Владелец' ? 'Хозяин Алексей' : 'Гость';
        const msg = m.original || m.ru || m.en || m.tr || '';
        conversationPrompt += `${sender}: ${msg}\n`;
      });
    }

    conversationPrompt += `\nПОСЛЕДНЕЕ СООБЩЕНИЕ ГОСТЯ: "${guestMessage}"\n`;
    conversationPrompt += `\nСформулируй персонализированный, дружелюбный и точный ответ гостю на языке: ${lang.toUpperCase()}.`;

    // 4. Прямой вызов Google Gemini Generative Language REST API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: conversationPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.warn('[Gemini API Response Error]:', data.error || response.statusText);
      return res.status(200).json({
        success: false,
        isRealAi: false,
        source: 'gemini_api_error',
        aiMode,
        model,
        error: data.error?.message || response.statusText
      });
    }

    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return res.status(200).json({
      success: true,
      isRealAi: true,
      source: 'gemini_3.6_flash',
      aiMode,
      model,
      reply: aiReply
    });
  } catch (err) {
    console.error('[ai-concierge Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
