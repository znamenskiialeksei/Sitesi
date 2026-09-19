/**
 * API ШАБЛОНОВ СООБЩЕНИЙ VILLA TURAMAN
 * Файл: pages/api/templates.js
 * Назначение: Получение структурированного каталога шаблонов и автоподстановка переменных
 */

import { TEMPLATE_STAGES, SMART_TEMPLATES } from '../../utils/templatesData';
import { resolveTemplate, detectGuestLanguage, matchSuggestedTemplate } from '../../utils/templateResolver';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      stages: TEMPLATE_STAGES,
      templates: SMART_TEMPLATES
    });
  }

  if (req.method === 'POST') {
    try {
      const { guestContext = {}, lang = 'ru', stageId, guestMessage } = req.body;

      // Если передано сообщение гостя, определяем намерение (AI Copilot Фаза 1)
      let suggestedTemplateId = null;
      if (guestMessage) {
        suggestedTemplateId = matchSuggestedTemplate(guestMessage);
      }

      // Разрешение плейсхолдеров для каждого шаблона
      const resolvedList = SMART_TEMPLATES.map((tmpl) => {
        const rawContent = tmpl.content[lang] || tmpl.content.ru || '';
        const resolvedText = resolveTemplate(rawContent, { ...guestContext, lang });
        return {
          id: tmpl.id,
          stageId: tmpl.stageId,
          title: tmpl.title[lang] || tmpl.title.ru,
          rawText: rawContent,
          resolvedText: resolvedText,
          isSuggested: tmpl.id === suggestedTemplateId
        };
      });

      const filtered = stageId ? resolvedList.filter((t) => t.stageId === stageId) : resolvedList;

      return res.status(200).json({
        success: true,
        stages: TEMPLATE_STAGES,
        templates: filtered,
        suggestedTemplateId
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Метод не поддерживается' });
}
