// ==============================================================================
// СЕРВЕРНЫЙ ЭНДПОИНТ ЖИВОЙ БАЗЫ ЗНАНИЙ И ШАБЛОНОВ ИИ-КОНСЬЕРЖА
// Файл: pages/api/ai/knowledge.js
// Назначение: Предоставляет клиенту актуальные данные из Google Таблиц:
// 1. Системные настройки [ai_mode, ai_model, min_night_price, systemPrompt]
// 2. Роли агентов [КОНСЬЕРЖ_МАСТЕР, ЮРИСТ_КОНСУЛЬТАНТ, ФИНАНСИСТ_БУХГАЛТЕР]
// 3. Матрица доступа листов
// 4. Шаблоны сообщений [14 смарт-шаблонов на RU, EN, TR]
// 5. Словарь переменных [плейсхолдеры и реквизиты]
// Поддерживает параметр query ?force=true для принудительного обновления из Google Sheets.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import { getAiKnowledgeBase, invalidateAiKnowledgeCache } from '../../../utils/aiKnowledgeBase';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Метод не поддерживается. Разрешены GET и POST.'
    });
  }

  try {
    const forceRefresh = req.query.force === 'true' || (req.body && req.body.force === true);

    if (forceRefresh) {
      invalidateAiKnowledgeCache();
    }

    const kb = await getAiKnowledgeBase(forceRefresh);

    return res.status(200).json({
      success: true,
      timestamp: Date.now(),
      source: kb.source || 'google_sheets_live',
      fromCache: !forceRefresh && kb.source !== 'local_fallback',
      data: {
        system: {
          aiMode: kb.aiMode || 'copilot',
          aiEnabled: kb.aiEnabled !== false,
          geminiModel: kb.geminiModel || 'gemini-3.6-flash',
          minPriceUsd: kb.minPriceUsd || 180,
          systemPrompt: kb.systemPrompt || ''
        },
        blocks: kb.blocks || {},
        agentRoles: kb.agentRoles || {},
        sheetMatrix: kb.sheetMatrix || {},
        variables: kb.variables || {},
        templates: kb.templates || [],
        services: kb.services || [],
        legal: kb.legal || [],
        guides: kb.guides || [],
        tasks: kb.tasks || [],
        home: kb.home || {},
        about: kb.about || {},
        calendarData: kb.calendarData || {},
        pricingAnalysis: kb.pricingAnalysis || {}
      }
    });
  } catch (error) {
    console.error('[API /api/ai/knowledge] Ошибка загрузки базы знаний:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Сбой при чтении базы знаний: ' + error.message
    });
  }
}
