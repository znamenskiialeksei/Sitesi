// ==============================================================================
// ИИ-КОНСЬЕРЖ И АССИСТЕНТ VILLA TURAMAN: GOOGLE GEMINI API
// Файл: pages/api/ai-concierge.js
// Назначение: Интеллектуальный генератор ответов и суфлер хозяина на базе Gemini.
// База знаний и промпт загружаются динамически из Google Таблиц через aiKnowledgeBase.
// Модель: gemini-3.6-flash или из листа Системные настройки
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import { matchSuggestedTemplate, resolveTemplate } from '../../utils/templateResolver';
import { getAiKnowledgeBase } from '../../utils/aiKnowledgeBase';

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

    // Проверка активности ИИ и текущего режима
    const aiMode = kb.aiMode || 'copilot';
    const isAiActive = kb.aiEnabled !== false && aiMode !== 'off';

    // 2. Определение рекомендованного шаблона по намерениям
    const matched = matchSuggestedTemplate(guestMessage);
    const suggestedTemplateId = matched?.id || null;

    let fallbackTemplateText = '';
    if (matched?.template) {
      const raw = matched.template.content?.[lang] || matched.template.content?.ru || '';
      fallbackTemplateText = resolveTemplate(raw, {
        guestName,
        contact,
        checkIn: context.checkIn || '',
        checkOut: context.checkOut || ''
      });
    }

    if (!isAiActive) {
      return res.status(200).json({
        success: true,
        source: 'ai_disabled_in_settings',
        aiMode,
        model: 'none',
        reply: fallbackTemplateText || 'Здравствуйте! Чем я могу помочь вам по отдыху на Villa Turaman?',
        suggestedTemplateId,
        note: 'Режим ИИ отключен в настройках таблицы: aiMode = off'
      });
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    const model = (kb.geminiModel || process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();

    // Если ключ Gemini не настроен: возвращаем эталонный ответ из базы шаблонов
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        source: 'templates_fallback',
        aiMode,
        model: 'none',
        reply: fallbackTemplateText || 'Здравствуйте! Чем я могу помочь вам по отдыху на Villa Turaman?',
        suggestedTemplateId,
        note: 'GEMINI_API_KEY не задан на https://vercel.com/ : использован шаблон из базы знаний'
      });
    }

    // 3. Формирование динамического системного промпта из Базы Знаний Таблицы
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

    // Добавление актуальных реквизитов и переменных из Словаря Переменных Таблицы
    if (kb.variables && Object.keys(kb.variables).length > 0) {
      systemInstruction += `\n\nАКТУАЛЬНЫЕ ДАННЫЕ ОБЪЕКТА ИЗ СЛОВАРЯ ПЕРЕМЕННЫХ:`;
      for (const [k, v] of Object.entries(kb.variables)) {
        if (v && typeof v === 'string') {
          systemInstruction += `\n- ${k}: ${v}`;
        }
      }
    }

    // Добавление инструкций роли Консьержа и матрицы листов
    if (kb.agentRoles?.КОНСЬЕРЖ_МАСТЕР?.prompt) {
      systemInstruction += `\n\nСПЕЦИАЛИЗАЦИЯ РОЛИ КОНСЬЕРЖА:\n${kb.agentRoles.КОНСЬЕРЖ_МАСТЕР.prompt}`;
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

    // Формирование контекста диалога для Gemini
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
    if (fallbackTemplateText) {
      conversationPrompt += `ЭТАЛОННЫЙ ШАБЛОН ИЗ БАЗЫ ЗНАНИЙ ДЛЯ ОРИЕНТИРА: "${fallbackTemplateText}"\n`;
    }
    conversationPrompt += `\nСформулируй персонализированный, дружелюбный и точный ответ гостю на языке: ${lang.toUpperCase()}.`;

    // Вызов Google Gemini Generative Language REST API
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
        success: true,
        source: 'templates_fallback_on_api_error',
        aiMode,
        model,
        reply: fallbackTemplateText || 'Здравствуйте! Благодарим за обращение. Мы ответим вам в ближайшее время.',
        suggestedTemplateId,
        apiError: data.error?.message || response.statusText
      });
    }

    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallbackTemplateText || '';

    return res.status(200).json({
      success: true,
      source: 'gemini_knowledge_base',
      aiMode,
      model,
      reply: aiReply,
      suggestedTemplateId
    });
  } catch (err) {
    console.error('[ai-concierge Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
