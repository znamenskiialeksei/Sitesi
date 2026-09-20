// ==============================================================================
// ИИ-КОНСЬЕРЖ И АССИСТЕНТ VILLA TURAMAN: GOOGLE GEMINI API
// Файл: pages/api/ai-concierge.js
// Назначение: Интеллектуальный генератор ответов и суфлер хозяина на базе Gemini
// Модель по умолчанию: gemini-3.6-flash
// Ключ API: GEMINI_API_KEY на Vercel https://vercel.com/ или в .env.local
// ==============================================================================

import { matchSuggestedTemplate, resolveTemplate } from '../../utils/templateResolver';
import { SMART_TEMPLATES } from '../../utils/templatesData';

const DEFAULT_MODEL = 'gemini-3.6-flash';

const SYSTEM_INSTRUCTION = `Ты - профессиональный ИИ-консьерж и цифровой ассистент владельца премиальной виллы Villa Turaman в городе Дальян, провинция Мугла, Турция. Владелец виллы: Алексей Знаменский.
Твоя цель: помогать гостям и формулировать вежливые, точные и гостеприимные ответы на языке обращения гостя [RU, EN, TR].

КЛЮЧЕВЫЕ ПРАВИЛА И СТАНДАРТЫ:
1. Тон общения: Премиальный, теплый, заботливый, конкретный и лаконичный.
2. Локация: Дальян, Турция. Рядом река Дальян, Ликийские гробницы, черепаший пляж Изтузу, термальные источники Султание.
3. Удобства: Приватный бассейн с регулярной очисткой, сад, зона барбекю, скоростной Wi-Fi VillaTuraman_5G, кухня, кондиционеры.
4. Правила времени: Стандартный заезд с 16:00, выезд до 10:00.
5. Финансовые границы: Минимальный допустимый тариф за ночь составляет 180 USD. Скидка 10% действует только при невозвратном тарифе на даты выезда в пределах 60 дней. Категорически запрещено обещать скидки ниже минимума без согласования с хозяином.
6. Передача ключей: Мини-сейф с кодовым замком у входа или личная встреча хозяином.
7. Формат ответа: Сразу готовый текст сообщения для гостя без лишних вводных слов, готовый к отправке.`;

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

    // Определение рекомендованного шаблона по намерениям
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

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    const model = (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();

    // Если ключ Gemini не настроен: возвращаем эталонный ответ из базы шаблонов
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        source: 'templates_fallback',
        model: 'none',
        reply: fallbackTemplateText || 'Здравствуйте! Чем я могу помочь вам по отдыху на Villa Turaman?',
        suggestedTemplateId,
        note: 'GEMINI_API_KEY не задан на https://vercel.com/ : использован шаблон из базы'
      });
    }

    // Формирование контекста диалога для Gemini
    let conversationPrompt = `${SYSTEM_INSTRUCTION}\n\n`;
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
        maxOutputTokens: 800
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
        model,
        reply: fallbackTemplateText || 'Здравствуйте! Благодарим за обращение. Мы ответим вам в ближайшее время.',
        suggestedTemplateId,
        apiError: data.error?.message || response.statusText
      });
    }

    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallbackTemplateText || '';

    return res.status(200).json({
      success: true,
      source: 'gemini',
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
