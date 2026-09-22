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
import { generateConciergeReply } from '../../utils/aiConciergeEngine';

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
      guestStage = null,
      bookingContext = {},
      context = {}
    } = req.body;

    const kb = await getAiKnowledgeBase();
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
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        isRealAi: false,
        source: 'missing_api_key',
        aiMode,
        model: kb.geminiModel || 'gemini-3.6-flash',
        error: 'Ключ GEMINI_API_KEY не обнаружен в process.env на https://vercel.com/ [Environment Variables]'
      });
    }

    const mergedBookingContext = {
      ...context,
      ...bookingContext,
      contact: contact || bookingContext.contact || context.contact || '',
      guestName: guestName || bookingContext.guestName || context.guestName || 'Гость'
    };

    const aiResult = await generateConciergeReply({
      guestMessage,
      guestName,
      contact,
      chatHistory,
      guestStage,
      bookingContext: mergedBookingContext,
      providedKb: kb
    });

    if (!aiResult.success) {
      return res.status(200).json({
        success: false,
        isRealAi: false,
        source: 'gemini_api_error',
        aiMode,
        model: aiResult.model || kb.geminiModel || 'gemini-3.6-flash',
        error: aiResult.error
      });
    }

    if (aiResult.isCachedFaq) {
      return res.status(200).json({
        success: true,
        isRealAi: false,
        isCachedFaq: true,
        source: 'faq_cache_assembler',
        aiMode,
        model: 'faq_cache_assembler',
        intent: aiResult.intent,
        guestStage: aiResult.guestStage,
        pricingCorridor: kb.pricingAnalysis?.discountCorridor || null,
        reply: aiResult.replyText
      });
    }

    return res.status(200).json({
      success: true,
      isRealAi: true,
      isCachedFaq: false,
      source: 'gemini_3.6_flash',
      aiMode,
      model: aiResult.model,
      intent: aiResult.intent,
      guestStage: aiResult.guestStage,
      pricingCorridor: kb.pricingAnalysis?.discountCorridor || null,
      reply: aiResult.replyText
    });
  } catch (err) {
    console.error('[ai-concierge Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
