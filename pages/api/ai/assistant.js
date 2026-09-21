// ==============================================================================
// БИЗНЕС-АССИСТЕНТ СУПЕРХОЗЯИНА: СЕКРЕТАРЬ • ЮРИСТ • БУХГАЛТЕР
// Файл: pages/api/ai/assistant.js
// Назначение: Единый серверный эндпоинт управления бизнес-задачами владельца:
// 1. Бухгалтер: Расчет e-Arşiv Fatura по стандарту Блока 9 [GİB Portal]
// 2. Юрист: Экспресс-аудит договоров, KBS и KVKK
// 3. Секретарь: Универсальный рабочий диалог, поручения и интеграция с Google Drive
// 4. Сквозная фиксация задач в CRM лист 📋 Задачи и Поручения Секретаря
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import { google } from 'googleapis';
import { getAiKnowledgeBase } from '../../../utils/aiKnowledgeBase';
import { getLiveSheetMap, resolveRange } from '../../../utils/sheetsRegistry';

function parsePrivateKey(rawKey) {
  if (!rawKey) return '';
  let key = rawKey.replace(/^["']|["']$/g, '');
  key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
  key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return key.trim();
}

/**
 * Сохранение задачи в лист CRM 📋 Задачи и Поручения Секретаря
 */
async function appendTaskToCrmSheet({ direction, taskText, status = 'Новая', resultUrl = '', assignee = 'Суперхозяин Алексей' }) {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();

  if (!clientEmail || !rawKey || !spreadsheetId || clientEmail.includes('your-service-account-email')) {
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: parsePrivateKey(rawKey) },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);
    const range = resolveRange(sheetMap, 'TASKS', 'A:G');

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const taskId = `TASK-${Date.now().toString().slice(-4)}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          taskId,
          dateStr,
          direction,
          taskText,
          status,
          resultUrl || 'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_',
          assignee
        ]]
      }
    });

    return taskId;
  } catch (err) {
    console.warn('[appendTaskToCrmSheet] Предупреждение записи в лист TASKS:', err.message);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const {
      direction = 'Секретарь', // 'Бухгалтер' | 'Юрист' | 'Секретарь'
      action = 'chat',         // 'fatura_calculate' | 'legal_audit' | 'chat' | 'create_task'
      message = '',
      grossTRY = 0,
      nights = 1,
      guestName = 'Гость',
      chatHistory = [],
      saveToTasks = true
    } = req.body;

    const kb = await getAiKnowledgeBase();
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    const model = (kb.geminiModel || process.env.GEMINI_MODEL || 'gemini-3.6-flash').trim();

    // 1. ДЕЙСТВИЕ: РАСЧЕТ E-ARŞİV FATURA [БУХГАЛТЕР]
    if (action === 'fatura_calculate' || direction === 'Бухгалтер') {
      const gross = parseFloat(grossTRY) || 0;
      const stayNights = parseInt(nights, 10) || 1;
      const guest = (guestName || 'Гость').trim();

      if (gross > 0) {
        // Стандарт Блока 9: Matrah = Gross / 1.21
        const matrah = gross / 1.21;
        const kdv20 = matrah * 0.20;
        const konaklama1 = matrah * 0.01;
        const unitPrice = (matrah / stayNights).toFixed(8);

        const wholePart = Math.floor(gross);
        const kurusPart = Math.round((gross - wholePart) * 100);

        const notNote = `YALNIZ ${wholePart} TL ${kurusPart} KURUŞTUR. E ARŞİV İZNİ KAPSAMINDA ELEKTRONİK ORTAMDA İLETİLMİŞTİR.`;

        const calculation = {
          recipient: guest,
          currency: 'TRY',
          grossTRY: gross.toFixed(2),
          matrahTRY: matrah.toFixed(2),
          kdv20TRY: kdv20.toFixed(2),
          konaklama1TRY: konaklama1.toFixed(2),
          nights: stayNights,
          unitPriceTRY: unitPrice,
          turkishWordsNote: notNote,
          vkn: kb.blocks?.dialogStrategy?.tax_registration_vkn || '9991120181',
          lawBasis: kb.blocks?.gibInvoice?.invoice_law_reference || 'VUK 213 Madde 230'
        };

        let taskId = null;
        if (saveToTasks) {
          taskId = await appendTaskToCrmSheet({
            direction: 'Бухгалтер',
            taskText: `Расчет e-Arşiv Fatura: ${guest}, Брутто: ${gross.toFixed(2)} TRY, База: ${matrah.toFixed(2)} TRY, Ночей: ${stayNights}`,
            status: 'Выполнена',
            resultUrl: 'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_',
            assignee: 'Калькулятор GİB'
          });
        }

        return res.status(200).json({
          success: true,
          direction: 'Бухгалтер',
          action: 'fatura_calculate',
          calculation,
          taskId,
          summaryText: `🧾 РАСЧЕТ E-ARŞİV FATURA [GİB]:\n• Получатель: ${guest}\n• Брутто к оплате: ${gross.toFixed(2)} TRY\n• Налоговая база [Matrah]: ${matrah.toFixed(2)} TRY\n• НДС [KDV 20%]: ${kdv20.toFixed(2)} TRY\n• Налог на проживание [Konaklama 1%]: ${konaklama1.toFixed(2)} TRY\n• Цена за единицу [8 знаков]: ${unitPrice} TRY\n• Примечание Not:\n${notNote}`
        });
      }
    }

    // 2. ДЕЙСТВИЕ: РУЧНОЕ СОЗДАНИЕ ЗАДАЧИ
    if (action === 'create_task') {
      const taskId = await appendTaskToCrmSheet({
        direction,
        taskText: message,
        status: 'Новая',
        resultUrl: req.body.resultUrl || '',
        assignee: 'Суперхозяин Алексей'
      });
      return res.status(200).json({
        success: true,
        taskId,
        message: `Задача успешно зафиксирована в CRM под номером ${taskId}`
      });
    }

    // 3. УНИВЕРСАЛЬНЫЙ РАБОЧИЙ ДИАЛОГ С ИИ [СЕКРЕТАРЬ / ЮРИСТ / БУХГАЛТЕР]
    let rolePrompt = '';
    if (direction === 'Юрист') {
      rolePrompt = kb.blocks?.roles?.['Юрист-Консультант']?.prompt ||
        'Ты: ведущий юрисконсульт Villa Turaman. Контролируешь турецкое право VUK 213, регистрацию KBS в жандармерии и закон о персональных данных KVKK №6698. Соблюдай формулу переговоров 30% эмпатии / 70% юридической дисциплины.';
    } else if (direction === 'Бухгалтер') {
      rolePrompt = kb.blocks?.roles?.['Финансист-Бухгалтер']?.prompt ||
        'Ты: главный финансовый менеджер и бухгалтер Villa Turaman. Контролируешь налоги Турции VKN 9991120181, e-Arşiv Fatura, минимальный барьер цен $180 и расчеты в TRY/EUR/RUB.';
    } else {
      rolePrompt = kb.blocks?.roles?.['Секретарь-Помощник']?.prompt ||
        'Ты: персональный секретарь и бизнес-ассистент суперхозяина Алексея Знаменского на вилле Villa Turaman. Помогаешь хозяину формулировать поручения, организовывать папки Google Drive, вести реестр задач и отвечать гостям.';
    }

    const systemInstruction = `ТВОЯ РОЛЬ: ${rolePrompt}

РЕКВИЗИТЫ И КОНТЕКСТ ОБЪЕКТА VILLA TURAMAN:
- Владелец: Алексей Знаменский [Суперхозяин Airbnb]
- Налоговый номер VKN: ${kb.blocks?.dialogStrategy?.tax_registration_vkn || '9991120181'} [Ortaca Vergi Dairesi]
- Адрес: ${kb.variables?.address || 'Dalyan, Rodoslu Yasar Sunger Sk, NO 28/2, Ortaca / Mugla'}
- Партнер по трансферу: ${kb.variables?.transfer_partner_name || 'Dalyan VIP Transfer Service'} [Ahmet, телефон / WhatsApp: ${kb.variables?.transfer_partner_phone || '+90 543 335 80 70'}]
- Корневая папка Google Drive: 11xBSWA02NypliPFbziRSMfC9aAPclYF_
- Лист задач: 📋 Задачи и Поручения Секретаря

ПРАВИЛА ОТВЕТА:
- Отвечай четко, емко, по-деловому, без пустой вежливости.
- Если суперхозяин дает поручение или заметку: подтверди готовность и предложи сохранить в лист задач.`;

    let userPrompt = `${systemInstruction}\n\n`;
    if (chatHistory && chatHistory.length > 0) {
      userPrompt += `ХРОНОЛОГИЯ ДИАЛОГА:\n`;
      chatHistory.slice(-8).forEach((m) => {
        const sender = m.sender === 'host' ? 'Суперхозяин Алексей' : 'Ассистент';
        userPrompt += `${sender}: ${m.text}\n`;
      });
    }
    userPrompt += `\nНОВОЕ СООБЩЕНИЕ ХОЗЯИНА: "${message}"\n`;

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        direction,
        reply: `[Офлайн режим] Получено обращение в отдел ${direction}: "${message}". Для подключения живого интеллекта укажите GEMINI_API_KEY.`
      });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Поручение принято в обработку.';

    // Авто-логирование поручения в CRM лист TASKS
    let autoTaskId = null;
    if (saveToTasks && message.length > 10) {
      autoTaskId = await appendTaskToCrmSheet({
        direction,
        taskText: message,
        status: 'В работе',
        resultUrl: 'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_',
        assignee: `${direction} [ИИ]`
      });
    }

    return res.status(200).json({
      success: true,
      direction,
      model,
      reply: aiReply,
      taskId: autoTaskId
    });
  } catch (err) {
    console.error('[pages/api/ai/assistant Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
