import { google } from 'googleapis';
let memoryCache = { settings: null, lastFetch: 0, isFormatted: false };
const CACHE_TTL = 60 * 60 * 1000;
const GOOGLE_CONFIG = {
  // Конфигурация для Google Sheets
  parentFolderId: "1vvXNSjhcoddxgl_EY6oxx68h46vaejBk", spreadsheetName: "Vasilisa Academy CRM",
  ordersSheetName: "Orders", // Заказы товаров и курсов
  bookingsSheetName: "Bookings", // Заявки на очные МК
  studentsSheetName: "Students", // Все пользователи (клиенты)
  adminsSheetName: "Admins", // Администраторы
  bookingsSettingsSheetName: "BookingsSettings", // Правила для очных МК
  productsSheetName: "Products", coursesSheetName: "Courses", studentProgressSheetName: "StudentProgress",
  ordersHeaders: ["Дата заказа", "ID Заказа", "Имя клиента", "Контакт", "Тип (Товар/Курс/МК)", "ID Товара/Курса", "Название", "Сумма", "Статус"],
  bookingsHeaders: ["Дата заявки", "Имя гостя", "Контакт (Tel/TG)", "Заезд", "Выезд", "Дней", "Участников", "Детей", "Всего", "Итоговая стоимость", "Статус оплаты"],
  studentsHeaders: ["Дата регистрации", "Имя", "Контакт (Логин)", "Пароль", "Блок: Сайт", "Блок: Аккаунт", "Блок: Чат"],
  adminsHeaders: ["ФИО", "Телефон", "Telegram", "WhatsApp", "Google Email", "Логин", "Пароль", "Роль", "Прав: Финансы", "Прав: Контент", "Прав: Расписание", "Прав: Студенты", "Прав: Доступ к чатам"],
  bookingsSettingsHeaders: ["Дата заезда (Старт)", "Дата выезда (Конец)", "Тип (Блокировка/Цена/Мин. участников/Заметка/Тип бронирования/Настройки)", "Значение", "Заметка хозяина", "Автор изменения", "Время фиксации"],
  productsHeaders: ["ID", "Артикул", "Название", "Описание", "Цена", "Валюта", "В наличии (шт)", "Фото (URL, через запятую)", "Категория", "Активен (Да/Нет)"],
  coursesHeaders: ["ID", "Название", "Краткое описание", "Полное описание (JSON)", "Цена", "Валюта", "Уроки (JSON)", "Фото (URL)", "Категория", "Активен (Да/Нет)"],
  studentProgressHeaders: ["ID Студента (Контакт)", "ID Курса", "Статус оплаты", "Дата начала", "Урок 1 (статус)", "Урок 2 (статус)"],
  chatHeaders: ["Дата и Время", "Отправитель", "Оригинал", "RU", "EN", "TR", "Ссылка на вложение"]
};

// Источники iCal для синхронизации с внешними календарями
const icalSources = [
  { id: "google", name: "Google Calendar", color: "#f97316", url: "https://calendar.google.com/calendar/ical/41f6022c98338bf16240faec973d63393b57d8b067e3b58215f725f509a9be01%40group.calendar.google.com/public/basic.ics", enabled: true, importBookings: true, importBlocks: true }
];

// Динамический импорт, чтобы избежать ошибок сборки, если модуль не используется везде
let ical;

const isBlockEvent = (summaryObj) => {
  const text = (typeof summaryObj === 'string' ? summaryObj : summaryObj?.val || "").toLowerCase();
  return (
    text.includes("block") || text.includes("unavailable") || text.includes("not available") ||
    text.includes("закрыто") || text.includes("closed") || text.includes("owner") || text.includes("blocked")
  );
};

const normalizeDateToUTC = (dateObj) => {
  if (!dateObj) return new Date(NaN);
  const d = new Date(dateObj);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

const getChatSheetName = (name, contact) => `Chat_${(name || '').toString().replace(/[*?:\[\]\\/']/g, '').trim().substring(0, 30)}_${(contact || '').toString().replace(/[*?:\[\]\\/']/g, '').trim().substring(0, 30)}`;

const parseMessageRow = (r) => {
    const isOld = r.length <= 4 && !String(r[3] || '').startsWith('=');
    const orig = r[2] || '';
    const cln = (v) => (!v || String(v).startsWith('#') || String(v).includes('Loading') || String(v).includes('Загрузка')) ? orig : String(v);
    return {
        date: r[0] || '', sender: r[1] || '', original: orig,
        ru: isOld ? orig : cln(r[3]), en: isOld ? orig : cln(r[4]), tr: isOld ? orig : cln(r[5]),
        file: isOld ? (r[3] || '') : (r[6] || '')
    };
};

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).send('Method Not Allowed');
  const data = req.body; const action = data.action || 'booking';
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // --- ГИБРИДНАЯ АУТЕНТИФИКАЦИЯ ---
  let serviceAccountAuth, oauth2Client;
  let sheets, drive, tasksApi, calendarApi, spreadsheetId;

  try {
    // 1. Service Account: для фоновых операций с Sheets и Drive
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      serviceAccountAuth = new google.auth.GoogleAuth({
        credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL.trim(), private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').trim() },
        scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
      });
      sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });
      drive = google.drive({ version: 'v3', auth: serviceAccountAuth });
    } else {
      console.warn("Service Account credentials not found. Sheets/Drive operations will fail.");
    }

    // 2. OAuth2 Client: для доступа к личным Tasks и Calendar пользователя
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
      oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground' // Redirect URI не используется для refresh token
      );
      oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
      tasksApi = google.tasks({ version: 'v1', auth: oauth2Client });
      calendarApi = google.calendar({ version: 'v3', auth: oauth2Client });
    } else {
      console.warn("OAuth2 credentials not found. Tasks/Calendar operations will fail.");
    }

    // Проверка наличия нужного клиента для запрашиваемого действия
    const isGraphAction = ['get_tasks_graph', 'create_task', 'update_task_status', 'delete_task'].includes(action);
    const isSheetAction = !isGraphAction || action === 'get_tasks_graph'; // Graph action also needs sheets
    if (isSheetAction && sheets) {
        const tableSearch = await drive.files.list({ q: `name='${GOOGLE_CONFIG.spreadsheetName}' and '${GOOGLE_CONFIG.parentFolderId}' in parents and trashed=false`, fields: 'files(id)', supportsAllDrives: true, includeItemsFromAllDrives: true });
        if (tableSearch.data.files && tableSearch.data.files.length > 0) { spreadsheetId = tableSearch.data.files[0].id; } 
        else { const ss = await sheets.spreadsheets.create({ requestBody: { properties: { title: GOOGLE_CONFIG.spreadsheetName }, sheets: [{ properties: { title: GOOGLE_CONFIG.sheetName, index: 0 } }] } }); spreadsheetId = ss.data.spreadsheetId; await drive.files.update({ fileId: spreadsheetId, addParents: GOOGLE_CONFIG.parentFolderId, fields: 'id', supportsAllDrives: true }); }
    } else if (isSheetAction && !sheets) {
        return res.status(500).json({ success: false, error: "Google Service Account credentials for Sheets/Drive are not configured." });
    }
  } catch (err) { return res.status(500).json({ success: false, error: `System Configuration Error: ${err.message}` }); }

  const ensureSystemSheets = async () => {
    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    const existingTitles = ss.data.sheets.map(s => s.properties.title);
    const sheetsToCreate = [];
    if (!existingTitles.includes(GOOGLE_CONFIG.adminsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.adminsSheetName, headers: GOOGLE_CONFIG.adminsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.bookingsSettingsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.bookingsSettingsSheetName, headers: GOOGLE_CONFIG.bookingsSettingsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.ordersSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.ordersSheetName, headers: GOOGLE_CONFIG.ordersHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.bookingsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.bookingsSheetName, headers: GOOGLE_CONFIG.bookingsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.studentsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.studentsSheetName, headers: GOOGLE_CONFIG.studentsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.productsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.productsSheetName, headers: GOOGLE_CONFIG.productsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.coursesSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.coursesSheetName, headers: GOOGLE_CONFIG.coursesHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.studentProgressSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.studentProgressSheetName, headers: GOOGLE_CONFIG.studentProgressHeaders });

    if (sheetsToCreate.length > 0) {
      const addRequests = sheetsToCreate.map(sheetDef => ({ addSheet: { properties: { title: sheetDef.title } } }));
      await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: addRequests } });
      if (sheetsToCreate.some(s => s.title === GOOGLE_CONFIG.adminsSheetName)) {
        await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.adminsSheetName}!A:M`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [GOOGLE_CONFIG.adminsHeaders, ["Vasilisa Znamenskii", "", "", "", "znamenskiialeksei@gmail.com", "admin", "admin123", "Главный", "Да", "Да", "Да", "Да", "Да"]] } });
      }
      if (sheetsToCreate.some(s => s.title === GOOGLE_CONFIG.coursesSheetName)) {
        const coursesData = [
            GOOGLE_CONFIG.coursesHeaders,
            ["COURSE001", "Брошь 'Муха'", "Научитесь создавать детализированную брошь в виде мухи с нуля.", '{"about": "Полный курс по созданию броши \'Муха\' с использованием техник объемной вышивки, работы с канителью и кристаллами."}', "5900", "RUB", '{"1": "Введение и материалы", "2": "Создание каркаса", "3": "Вышивка крыльев", "4": "Декорирование тела", "5": "Финальная сборка"}', "https://static.tildacdn.com/tild3132-3336-4333-b133-346134333563/DSC_3800.jpg", "Броши", "Да"],
            ["COURSE002", "Брошь 'Жук'", "Освойте технику создания эффектной броши-жука.", '{"about": "Этот курс научит вас работать с различными материалами для создания реалистичной и красивой броши в виде жука."}', "5900", "RUB", '{"1": "Обзор материалов", "2": "Подготовка основы", "3": "Вышивка надкрыльев", "4": "Сборка и обработка края"}', "https://static.tildacdn.com/tild3834-6634-4438-b632-333234643639/DSC_4927.jpg", "Броши", "Да"]
        ];
        await sheets.spreadsheets.values.update({ spreadsheetId, range: `${GOOGLE_CONFIG.coursesSheetName}!A1`, valueInputOption: 'USER_ENTERED', requestBody: { values: coursesData } });
      }
      if (sheetsToCreate.some(s => s.title === GOOGLE_CONFIG.productsSheetName)) {
        const productsData = [
            GOOGLE_CONFIG.productsHeaders,
            ["PROD001", "ART-001", "Готовая брошь 'Муха'", "Эксклюзивная брошь ручной работы, выполненная в смешанной технике.", "12000", "RUB", "5", "https://static.tildacdn.com/tild3132-3336-4333-b133-346134333563/DSC_3800.jpg", "Броши", "Да"]
        ];
        await sheets.spreadsheets.values.update({ spreadsheetId, range: `${GOOGLE_CONFIG.productsSheetName}!A1`, valueInputOption: 'USER_ENTERED', requestBody: { values: productsData } });
      }
      memoryCache.isFormatted = false;
    }

    if (!memoryCache.isFormatted) {
      const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
      const formatRequests = [];
      updatedSs.data.sheets.forEach(sheet => {
          const title = sheet.properties.title;
          const sheetId = sheet.properties.sheetId;
          let headers = null;
          if (title === GOOGLE_CONFIG.adminsSheetName) headers = GOOGLE_CONFIG.adminsHeaders;
          else if (title === GOOGLE_CONFIG.bookingsSettingsSheetName) headers = GOOGLE_CONFIG.bookingsSettingsHeaders;
          else if (title === GOOGLE_CONFIG.ordersSheetName) headers = GOOGLE_CONFIG.ordersHeaders;
          else if (title === GOOGLE_CONFIG.bookingsSheetName) headers = GOOGLE_CONFIG.bookingsHeaders;
          else if (title === GOOGLE_CONFIG.studentsSheetName) headers = GOOGLE_CONFIG.studentsHeaders;
          else if (title === GOOGLE_CONFIG.productsSheetName) headers = GOOGLE_CONFIG.productsHeaders;
          else if (title === GOOGLE_CONFIG.coursesSheetName) headers = GOOGLE_CONFIG.coursesHeaders;
          else if (title === GOOGLE_CONFIG.studentProgressSheetName) headers = GOOGLE_CONFIG.studentProgressHeaders;
          else if (title.startsWith('Chat_')) headers = GOOGLE_CONFIG.chatHeaders;

          if (headers) {
              formatRequests.push({ updateCells: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: headers.length }, rows: [{ values: headers.map(h => ({ userEnteredValue: { stringValue: h }, userEnteredFormat: { backgroundColor: { red: 0.15, green: 0.20, blue: 0.28 }, textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } }, horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE', wrapStrategy: 'WRAP' } })) }], fields: 'userEnteredValue,userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)' } });
              formatRequests.push({ updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } });
          }
      });
      if (formatRequests.length > 0) {
          await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
      }
      memoryCache.isFormatted = true;
    }
  };

  if (action === 'get_settings') {
    try {
      if (memoryCache.settings && (Date.now() - memoryCache.lastFetch < CACHE_TTL)) return res.status(200).json(memoryCache.settings);
      await ensureSystemSheets();
      const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSettingsSheetName}!A:G`});
      const rows = db.data.values || []; let globalRules = null; let dateRules = [];
      
      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        if (row[2] === 'Настройки' && !globalRules) {
          try { globalRules = JSON.parse(row[3]); } catch (e) {}
        } else if (row[2] !== 'Настройки' && row[0] && row[0] !== 'Дата заезда (Старт)') { 
          let isValid = true;
          if (row[2] === 'Блокировка' && row[3] && (row[3] || '').toString().startsWith('HOLD|')) {
              const parts = row[3].split('|');
              if (parts.length === 3) {
                  const expiresAt = new Date(parts[2]).getTime();
                  if (Date.now() > expiresAt) isValid = false;
              }
          }
          if (isValid) {
              dateRules.push({ start: row[0], end: row[1] || row[0], type: row[2], value: row[3], note: row[4] });
          }
        }
      }
      const result = { success: true, globalRules, dateRules }; memoryCache.settings = result; memoryCache.lastFetch = Date.now();
      return res.status(200).json(result);
    } catch (e) { return res.status(200).json({ success: false, error: `Системная ошибка: ${e.message}` }); }
  }

  // --- УПРАВЛЕНИЕ И ПОЛУЧЕНИЕ ПСЕВДО-ГРАФА ЗАДАЧ И КАЛЕНДАРЯ ---
  if (action === 'get_tasks_graph') {
    try {
      let nodes = [];
      let edges = [];
      const clusterMap = new Set();
      const nodeTitles = new Map();
      let warnings = [];

      // 1. GOOGLE TASKS (via OAuth2)
      if (tasksApi) {
        try {
            const listRes = await tasksApi.tasklists.list({ maxResults: 100 });
            const taskLists = listRes.data.items || [];
            for (const list of taskLists) {
                nodes.push({ id: list.id, label: list.title, group: 'list', color: '#3b82f6' });
                const tasksRes = await tasksApi.tasks.list({ tasklist: list.id, maxResults: 100, showCompleted: true });
                const tasks = tasksRes.data.items || [];
                for (const task of tasks) {
                    if (!task.title) continue;
                    nodeTitles.set(task.title.trim().toLowerCase(), task.id);
                    const isCompleted = task.status === 'completed';
                    nodes.push({ id: task.id, listId: list.id, label: task.title, group: 'task', status: task.status, color: isCompleted ? '#10b981' : '#f59e0b' });
                    edges.push({ from: task.id, to: list.id, type: 'belongs' });
                    if (task.notes) {
                        const tags = task.notes.match(/#[a-zA-Z0-9_А-Яа-я]+/g);
                        if (tags) {
                            tags.forEach(tag => {
                                const tagId = `tag_${tag.toLowerCase()}`;
                                if (!clusterMap.has(tagId)) { clusterMap.add(tagId); nodes.push({ id: tagId, label: tag, group: 'cluster', color: '#a855f7' }); }
                                edges.push({ from: task.id, to: tagId, type: 'tag' });
                            });
                        }
                        const linkMatches = task.notes.match(/СВЯЗЬ:\s*\[(.*?)\]/gi);
                        if (linkMatches) {
                            linkMatches.forEach(match => {
                                const targetTitle = match.replace(/СВЯЗЬ:\s*\[/i, '').replace(']', '').trim().toLowerCase();
                                task._pendingLinks = task._pendingLinks || [];
                                task._pendingLinks.push(targetTitle);
                            });
                        }
                    }
                }
            }
            for (const task of tasks) {
                if (task._pendingLinks) {
                    task._pendingLinks.forEach(targetTitle => {
                        const targetId = nodeTitles.get(targetTitle);
                        if (targetId) edges.push({ from: task.id, to: targetId, type: 'cross_link' });
                    });
                }
            }
        } catch(e) { warnings.push(`Ошибка при загрузке Google Tasks: ${e.message}`); }
      } else {
        warnings.push('Google Tasks не отображаются: OAuth-ключи не настроены в переменных окружения.');
      }

      // 2. GOOGLE CALENDAR (via OAuth2 - личные календари)
      if (calendarApi) {
        nodes.push({ id: 'gcalendar_hub', label: 'Google Calendar', group: 'hub', color: '#34A853' });
        try {
            const calendarListRes = await calendarApi.calendarList.list();
            const calendars = calendarListRes.data.items || [];
            for (const calendar of calendars) {
                if (calendar.accessRole === 'owner' || calendar.accessRole === 'writer' || calendar.accessRole === 'reader') {
                    nodes.push({ id: calendar.id, label: calendar.summary, group: 'gcal_list', color: '#81C995' });
                    edges.push({ from: calendar.id, to: 'gcalendar_hub', type: 'belongs' });
                    const eventsRes = await calendarApi.events.list({ calendarId: calendar.id, timeMin: (new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).toISOString(), timeMax: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toISOString(), maxResults: 50, singleEvents: true, orderBy: 'startTime' });
                    const events = eventsRes.data.items || [];
                    for (const event of events) {
                        if (!event.summary) continue;
                        const start = event.start.dateTime || event.start.date;
                        nodes.push({ id: event.id, label: event.summary, group: 'gcal_event', color: '#A5D6A7', details: `Когда: ${new Date(start).toLocaleString()}` });
                        edges.push({ from: event.id, to: calendar.id, type: 'gcal_event' });
                    }
                }
            }
        } catch (e) { warnings.push(`Ошибка при загрузке Google Calendar: ${e.message}`); }
      } else {
        warnings.push('Google Calendar не отображается: OAuth-ключи не настроены.');
      }

      // 3. iCAL BOOKINGS (внешние бронирования)
      nodes.push({ id: 'ical_hub', label: 'Внешние брони (iCal)', group: 'hub', color: '#F4B400' });
      try {
        if (!ical) ical = (await import('node-ical')).default;
        const icalResults = await Promise.allSettled(icalSources.filter(s => s.enabled).map(async (source) => {
            const response = await fetch(`${source.url}${source.url.includes('?') ? '&' : '?'}nocache=${Date.now()}`, { cache: 'no-store' });
            if (!response.ok) throw new Error(`iCal fetch failed for ${source.name} with status ${response.status}`);
            const icsText = await response.text();
            const data = await ical.async.parseICS(icsText);
            return { data, source };
        }));
        icalResults.forEach((result) => {
            if (result.status === 'fulfilled') {
                const { data, source } = result.value;
                for (const k in data) {
                    if (Object.hasOwnProperty.call(data, k)) {
                        const ev = data[k];
                        if (ev.type === 'VEVENT' && ev.start) {
                            const start = normalizeDateToUTC(ev.start); const end = normalizeDateToUTC(ev.end || ev.start);
                            const label = `${source.name}: ${ev.summary?.val || ev.summary || 'Бронь'}`; const nodeId = `ical_${source.id}_${ev.uid?.val || ev.uid || k}`;
                            nodes.push({ id: nodeId, label: label, group: 'ical_event', color: source.color || '#FFD54F', details: `Период: ${start.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}` });
                            edges.push({ from: nodeId, to: 'ical_hub', type: 'ical_booking' });
                        }
                    }
                }
            } else {
                warnings.push(`Ошибка импорта iCal (${result.reason.message})`);
            }
        });
      } catch (e) { warnings.push(`Ошибка при загрузке iCal: ${e.message}`); }

      // 4. SPREADSHEET CALENDAR RULES (из CRM таблицы)
      if (sheets && oauth2Client) { // Требует и того, и другого
        nodes.push({ id: 'calendar_hub', label: 'Календарь Записи (CRM)', group: 'hub', color: '#ef4444' });
        try {
            await ensureSystemSheets();
            const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSettingsSheetName}!A:G` });
            const rows = db.data.values || [];
            let activeRules = [];
            for (let i = rows.length - 1; i >= 0; i--) {
                const r = rows[i];
                if (r[2] !== 'Настройки' && r[0] && r[1] && !String(r[2]).startsWith('Сброс')) activeRules.push(r);
                if (activeRules.length > 20) break;
            }
            activeRules.forEach((row, idx) => {
                const ruleId = `cal_${idx}`;
                nodes.push({ id: ruleId, label: `[${row[2]}] ${row[0]} - ${row[1]}`, group: 'calendar', color: row[2]==='Блокировка'?'#f87171':'#60a5fa', details: row[3] || 'Нет данных', note: row[4] || '' });
                edges.push({ from: ruleId, to: 'calendar_hub', type: 'calendar_rule' });
            });
        } catch (e) { warnings.push(`Ошибка при загрузке расписания из CRM: ${e.message}`); }
      } else {
        warnings.push('Правила календаря из CRM не отображаются: ключи сервисного аккаунта не настроены.');
      }

      return res.status(200).json({ success: true, nodes, edges, warnings });
    } catch (err) { return res.status(500).json({ success: false, error: `Критическая ошибка сбора графа: ${err.message}` }); }
  }

  // --- MUTATIONS: TASKS (via OAuth2) ---
  if (action === 'create_task') {
    try {
      if (!tasksApi) return res.status(400).json({ success: false, error: 'Google Tasks API не настроен.' });
      await tasksApi.tasks.insert({ tasklist: data.listId, requestBody: { title: data.title, notes: data.notes || '' } });
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  if (action === 'update_task_status') {
    try {
      if (!tasksApi) return res.status(400).json({ success: false, error: 'Google Tasks API не настроен.' });
      const task = await tasksApi.tasks.get({ tasklist: data.listId, task: data.taskId });      
      const updatedTask = { ...task.data, status: data.status }; // 'completed' или 'needsAction'
      await tasksApi.tasks.update({ tasklist: data.listId, task: data.taskId, requestBody: updatedTask });
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  // --- MUTATION: Удаление задачи из Графа ---
  if (action === 'delete_task') {
    try {
      if (!tasksApi) return res.status(400).json({ success: false, error: 'Google Tasks API не настроен.' });
      await tasksApi.tasks.delete({ tasklist: data.listId, task: data.taskId });
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  // --- Остальная логика CRM (регистрация, чаты, заявки, правила) ---
  if (action === 'register') {
    try {
      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      let accSheet = ss.data.sheets.find(s => s.properties.title === GOOGLE_CONFIG.studentsSheetName);
      if (!accSheet) {
        await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: GOOGLE_CONFIG.studentsSheetName } } }] } });
        memoryCache.isFormatted = false;
        await ensureSystemSheets();
      }
      const safeContact = (data.contact || '').toString().trim().toLowerCase();
      const existingData = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.studentsSheetName}!C:C` });
      const logins = existingData.data.values ? existingData.data.values.flat().map(v => (v || '').toString().trim().toLowerCase()) : [];
      if (logins.includes(safeContact)) return res.status(200).json({ success: false, error: "Пользователь с таким логином/контактом уже зарегистрирован" });
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.studentsSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, (data.name || '').toString().trim(), (data.contact || '').toString().trim(), (data.password || '').toString().trim() || "123456", "Нет", "Нет", "Нет"]] } });
      return res.status(200).json({ success: true, message: "Регистрация успешна", user: { name: (data.name || '').toString().trim(), contact: (data.contact || '').toString().trim(), isHost: false } });
    } catch (e) { return res.status(200).json({ success: false, error: `Ошибка регистрации: ${e.message}` }); }
  }

  if (action === 'login') {
    try {
      await ensureSystemSheets();
      const safeContact = (data.contact || '').toString().trim().toLowerCase(); const safePassword = (data.password || '').toString().trim();
      const masterDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.adminsSheetName}!A:M` });
      const masterUser = (masterDb.data.values || []).find(r => { const rowEmail = (r[4] || '').toString().trim().toLowerCase(); const rowLogin = (r[5] || '').toString().trim().toLowerCase(); const rowPassword = (r[6] || '').toString().trim(); return (rowEmail === safeContact || rowLogin === safeContact) && rowPassword === safePassword; });
      if (masterUser) {
        const permissions = { finance: (masterUser[8] || '').toString().trim().toLowerCase() === 'да', periods: (masterUser[9] || '').toString().trim().toLowerCase() === 'да', blocks: (masterUser[10] || '').toString().trim().toLowerCase() === 'да', bookingWindow: (masterUser[11] || '').toString().trim().toLowerCase() === 'да', chats: (masterUser[12] || '').toString().trim().toLowerCase() === 'да' };
        return res.status(200).json({ success: true, user: { name: (masterUser[0] || 'Admin').toString().trim(), contact: safeContact, isHost: true, role: (masterUser[7] || 'Admin').toString(), permissions } });
      }
      const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.studentsSheetName}!A:G` });
      const userRow = (db.data.values || []).find(r => (r[2] || '').toString().trim().toLowerCase() === safeContact && (r[3] || '').toString().trim() === safePassword);
      if (!userRow) return res.status(200).json({ success: false, error: "Неверный логин или пароль" });
      if ((userRow[4] || '').toString().trim().toLowerCase() === 'да') return res.status(200).json({ success: false, blockType: 'site', error: "Доступ к сайту заблокирован." });
      if ((userRow[5] || '').toString().trim().toLowerCase() === 'да') return res.status(200).json({ success: false, blockType: 'account', error: "Ваш аккаунт приостановлен." });
      const blockChat = (userRow[6] || '').toString().trim().toLowerCase() === 'да';
      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      const chatExists = !!ss.data.sheets.find(s => s.properties.title === getChatSheetName(userRow[1], userRow[2]));
      return res.status(200).json({ success: true, user: { name: (userRow[1] || 'Guest').toString().trim(), contact: (userRow[2] || '').toString().trim(), isHost: false, blockChat, hasChat: chatExists } });
    } catch (e) { return res.status(200).json({ success: false, error: `Ошибка авторизации: ${e.message}` }); }
  }

  if (action === 'master_get_chats') {
    try {
      await ensureSystemSheets();
      const ss = await sheets.spreadsheets.get({ spreadsheetId });

      const dbBooking = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSheetName}!A:K` });
      const allBookings = (dbBooking.data.values || []).slice(1);
      const requests = allBookings.map((r, i) => {
        let statusFull = r[10] || ''; let status = statusFull; let expiresAt = null;
        if (statusFull.startsWith('СПЕЦПРЕДЛОЖЕНИЕ|')) {
            const parts = statusFull.split('|'); status = 'СПЕЦПРЕДЛОЖЕНИЕ'; expiresAt = parts[1];
        } else if (statusFull.startsWith('ОЖИДАЕТ ОПЛАТЫ|')) {
            const parts = statusFull.split('|'); status = 'ОЖИДАЕТ ОПЛАТЫ'; expiresAt = parts[1];
        }
        return { rowIndex: i + 2, date: r[0], name: r[1], contact: r[2], checkIn: r[3], checkOut: r[4], nights: r[5], adults: r[6], children: r[7], guests: r[8], price: r[9], status, expiresAt };
      });

      let allChats = [];
      for (const sheet of ss.data.sheets.filter(s => s.properties.title.startsWith('Chat_'))) {
        const title = sheet.properties.title; const parts = title.split('_');
        const clientName = parts[1]; const clientContact = parts[2];
        const chatDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${title}!A:G` });
        
        const userRequests = requests.filter(r => r.contact === clientContact && (r.status === 'ЗАПРОС' || r.status === 'ОЖИДАЕТ ОПЛАТЫ' || r.status === 'СПЕЦПРЕДЛОЖЕНИЕ'));
        userRequests.sort((a, b) => {
            const dA = a.checkIn.split('.').reverse().join('');
            const dB = b.checkIn.split('.').reverse().join('');
            return dA.localeCompare(dB);
        });

        allChats.push({ sheetName: title, clientName, clientContact, activeRequests: userRequests, messages: (chatDb.data.values || []).slice(1).map(parseMessageRow) });
      }
      return res.status(200).json({ success: true, chats: allChats });
    } catch (e) { return res.status(200).json({ success: false, error: e.message }); }
  }

  if (action === 'chat') {
    try {
      const chatSheetName = getChatSheetName(data.sender, data.contact);
      if (data.message || data.fileBase64) {
        const safeContact = (data.contact || '').toString().trim().toLowerCase();
        const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.studentsSheetName}!A:G` });
        const userRow = (db.data.values || []).find(r => (r[2] || '').toString().trim().toLowerCase() === safeContact);
        if (userRow && (userRow[6] || '').toString().trim().toLowerCase() === 'да') return res.status(200).json({ success: false, error: "Доступ к чату заблокирован." });

        let fileUrl = "";
        if (data.fileBase64 && data.fileName && data.mimeType && TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
          try {
            const formData = new FormData(); formData.append('chat_id', TELEGRAM_CHAT_ID); formData.append('document', new Blob([Buffer.from(data.fileBase64, 'base64')], { type: data.mimeType }), data.fileName); formData.append('caption', `📁 Вложение!\nОт: ${data.sender}\nКонтакт: ${data.contact}`);
            const tgRes = await fetch(`<https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument>`, { method: 'POST', body: formData });
            fileUrl = (await tgRes.json()).ok ? "Файл доставлен" : "Ошибка доставки";
          } catch (fileErr) { fileUrl = "Сбой передачи"; }
        }
        await sheets.spreadsheets.values.append({ spreadsheetId, range: `${chatSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' }), data.sender || 'Клиент', data.message || '', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', fileUrl]] } });
      }

      const chatDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${chatSheetName}!A:G` });

      const dbBooking = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSheetName}!A:K` });
      const allBookings = dbBooking.data.values || [];
      const userRequests = allBookings.slice(1).map((r, i) => {
        let statusFull = r[10] || ''; let status = statusFull; let expiresAt = null;
        if (statusFull.startsWith('СПЕЦПРЕДЛОЖЕНИЕ|')) { const parts = statusFull.split('|'); status = 'СПЕЦПРЕДЛОЖЕНИЕ'; expiresAt = parts[1]; }
        else if (statusFull.startsWith('ОЖИДАЕТ ОПЛАТЫ|')) { const parts = statusFull.split('|'); status = 'ОЖИДАЕТ ОПЛАТЫ'; expiresAt = parts[1]; }
        return { rowIndex: i + 2, date: r[0], name: r[1], contact: r[2], checkIn: r[3], checkOut: r[4], nights: r[5], adults: r[6], children: r[7], guests: r[8], price: r[9], status, expiresAt };
      }).filter(r => r.contact === data.contact && (r.status === 'ЗАПРОС' || r.status === 'ОЖИДАЕТ ОПЛАТЫ' || r.status === 'СПЕЦПРЕДЛОЖЕНИЕ'));
      
      return res.status(200).json({ success: true, messages: (chatDb.data.values || []).slice(1).map(parseMessageRow), activeRequests: userRequests });
    } catch (e) { return res.status(200).json({ success: false, error: e.message }); }
  }

  if (action === 'approve_request') {
    try {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const statusStr = `ОЖИДАЕТ ОПЛАТЫ|${expiresAt}`;

      const range = `${GOOGLE_CONFIG.bookingsSheetName}!K${data.rowIndex}`;
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [[statusStr]] } });

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const deadlineStr = new Date(expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

      const ruleRow = [data.checkIn, data.checkOut, "Блокировка", `HOLD|${data.contact}|${expiresAt}`, "Ожидание оплаты (Одобрено)", "Система", timestamp];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSettingsSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [ruleRow] } });

      const msg = `✅ Ваша заявка одобрена! Пожалуйста, оплатите бронирование до: ${deadlineStr}.`;
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${data.chatSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Администратор", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });

      memoryCache.settings = null;
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(200).json({ success: false, error: e.message }); }
  }

  if (action === 'special_offer') {
    try {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const statusStr = `СПЕЦПРЕДЛОЖЕНИЕ|${expiresAt}`;

      const range = `${GOOGLE_CONFIG.bookingsSheetName}!D${data.rowIndex}:K${data.rowIndex}`;
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [[data.checkIn, data.checkOut, data.nights, data.adults, data.children, data.guests, data.price, statusStr]] } });

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const deadlineStr = new Date(expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

      const ruleRow = [data.checkIn, data.checkOut, "Блокировка", `HOLD|${data.clientContact}|${expiresAt}`, "Ожидание оплаты (Спецпредложение)", "Система", timestamp];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSettingsSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [ruleRow] } });

      const msg = `🎁 Специальное предложение!\nНовые даты: ${data.checkIn} — ${data.checkOut}\nНовая цена: ${data.price}\nДля подтверждения произведите оплату до: ${deadlineStr}.`;
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${data.chatSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Администратор", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });

      memoryCache.settings = null;
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(200).json({ success: false, error: e.message }); }
  }

  if (action === 'revoke_request') {
    try {
      const range = `${GOOGLE_CONFIG.bookingsSheetName}!K${data.rowIndex}`;
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [["ОТОЗВАНО"]] } });

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      const ruleRow = [data.checkIn, data.checkOut, "Сброс блокировки", "СБРОС", "Отозвано администратором", "Система", timestamp];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSettingsSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [ruleRow] } });

      const msg = `❌ Предложение на даты ${data.checkIn} — ${data.checkOut} было отозвано администратором.`;
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${data.chatSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Администратор", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });

      memoryCache.settings = null;
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(200).json({ success: false, error: e.message }); }
  }

  if (action === 'reject_request') {
    try {
      const range = `${GOOGLE_CONFIG.bookingsSheetName}!K${data.rowIndex}`;
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [["ОТКЛОНЕНО"]] } });

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

      const msg = `❌ Ваша заявка на даты ${data.checkIn} — ${data.checkOut} была отклонена администратором.`;
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${data.chatSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Администратор", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });

      memoryCache.settings = null;
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(200).json({ success: false, error: e.message }); }
  }

  if (action === 'master_send_chats') {
    try {
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      for (const sheetName of (data.targetSheets || [])) {
        const cName = sheetName.split('_')[1] || 'Гость';
        await sheets.spreadsheets.values.append({ spreadsheetId, range: `${sheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, data.sender || 'Администратор', (data.message || '').toString().replace(/\{Имя\}/g, cName), '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      }
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(200).json({ success: false, error: e.message }); }
  }

  if (action === 'master_save_calendar') {
    try {
      await ensureSystemSheets();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const rows = (data.rules || []).map(r => [r.start, r.end, r.type, r.value !== undefined ? r.value : "", r.note !== undefined ? r.note : "", data.sender || "Admin", timestamp]);
      if (rows.length > 0) {
        await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSettingsSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: rows } });
        memoryCache.settings = null; memoryCache.lastFetch = 0;
      }
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(200).json({ success: false, error: e.message }); }
  }

  if (action === 'master_save_global_rules') {
    try {
      await ensureSystemSheets();
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSettingsSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [["Глобальные правила", "Все даты", "Настройки", JSON.stringify(data.rules), "Изменение лимитов", data.sender || "Admin", new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' })]] } });
      memoryCache.settings = null; memoryCache.lastFetch = 0;
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(200).json({ success: false, error: e.message }); }
  }

  // --- E-COMMERCE & LMS ACTIONS ---
  if (req.method === 'GET') {
    const { action: getAction } = req.query;
    if (getAction === 'get_content') {
        try {
            await ensureSystemSheets();
            const productsDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.productsSheetName}!A:J` });
            const coursesDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.coursesSheetName}!A:J` });
            const scheduleDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSheetName}!A:I` });

            const products = (productsDb.data.values || []).slice(1).filter(r => r[9] === 'Да').map(r => ({ id: r[0], sku: r[1], name: r[2], description: r[3], price: r[4], currency: r[5], stock: r[6], images: (r[7] || '').split(','), category: r[8] }));
            const courses = (coursesDb.data.values || []).slice(1).filter(r => r[9] === 'Да').map(r => ({ id: r[0], name: r[1], short_desc: r[2], long_desc: r[3], price: r[4], currency: r[5], lessons: r[6], image: r[7], category: r[8] }));
            const schedule = (scheduleDb.data.values || []).slice(1).filter(r => r[7] === 'Активен').map(r => ({ date: r[0], startTime: r[1], endTime: r[2], name: r[3], capacity: r[4], booked: r[5], price: r[6] }));

            return res.status(200).json({ success: true, products, courses, schedule });
        } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
    }
  }

  if (action === 'request_booking') {
    try {
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const message = `⚠️ ЗАЯВКА НА ЗАПИСЬ (Ручное одобрение)\n👤 Клиент: ${data.name}\n📞 Связь: ${data.contact}\n📅 Дата: ${data.checkIn}\n👥 Участников: ${data.total_guests}\n💰 Итоговая стоимость: ${data.totalPrice}`;
        await fetch(`<https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage>`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }) });
      }

      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      let userObj = null;
      if (!data.isRegistered && data.contact) {
        const safeContact = (data.contact || '').toString().trim().toLowerCase();
        const existingData = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.studentsSheetName}!C:C` });
        const logins = existingData.data.values ? existingData.data.values.flat().map(v => (v || '').toString().trim().toLowerCase()) : [];
        if (!logins.includes(safeContact)) {
            const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
            await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.studentsSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, (data.name || '').toString().trim(), (data.contact || '').toString().trim(), "123456", "Нет", "Нет", "Нет"]] } });
        }
        userObj = { name: (data.name || '').toString().trim(), contact: (data.contact || '').toString().trim(), isHost: false, blockChat: false, hasChat: true };
      } else { userObj = { name: (data.name || '').toString().trim(), contact: (data.contact || '').toString().trim(), isHost: false, blockChat: false, hasChat: true }; }

      const chatSheetName = getChatSheetName(data.name, data.contact);
      if (!ss.data.sheets.find(s => s.properties.title === chatSheetName)) {
        await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] } });
        memoryCache.isFormatted = false;
        await ensureSystemSheets();
      }

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const miniCard = `📋 Заявка на запись отправлена на модерацию.\nДата: ${data.checkIn}\nУчастников: ${data.total_guests}\nОжидайте подтверждения от администратора.`;
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${chatSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Система", miniCard, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSheetName}!A:K`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, data.name, data.contact, data.checkIn, data.checkOut, data.nights, data.total_adults, data.total_children, data.total_guests, data.totalPrice || "", "ЗАПРОС"]] } });

      return res.status(200).json({ success: true, user: userObj });
    } catch (err) { return res.status(200).json({ success: true, warning: err.message }); }
  }

  if (action === 'place_order' || action === 'booking') { // Handles both e-commerce orders and instant class bookings
    try {
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const message = data.itemType 
          ? `📦 НОВЫЙ ЗАКАЗ (E-commerce)!\n👤 Клиент: ${data.name}\n📞 Связь: ${data.contact}\n🛒 Товар: ${data.itemName} (ID: ${data.itemId})\n💰 Сумма: ${data.totalPrice}`
          : `🚀 НОВАЯ ЗАПИСЬ (Мгновенная)!\n👤 Клиент: ${data.name || 'Не указано'}\n📞 Связь: ${data.contact || 'Не указано'}\n📅 Дата: ${data.checkIn}\n👥 Участников: ${data.total_guests}`;
        await fetch(`<https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage>`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }) });
      }

      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

      if (data.itemType) { // This is an e-commerce order
        const orderId = `VA-${Date.now()}`;
        const orderRow = [timestamp, orderId, data.name, data.contact, data.itemType, data.itemId, data.itemName, data.totalPrice, data.status || "В ОБРАБОТКЕ"];
        await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.ordersSheetName}!A:I`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [orderRow] } });

        if (data.itemType === 'Course' && data.status === 'ОПЛАЧЕНО') {
          const progressRow = [data.contact, data.itemId, "ОПЛАЧЕНО", timestamp, "Доступен"];
          await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.studentProgressSheetName}!A:E`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [progressRow] } });
        }
      } else { // This is an instant booking for a class
        await sheets.spreadsheets.values.append({ spreadsheetId, range: `${GOOGLE_CONFIG.bookingsSheetName}!A:K`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, data.name, data.contact, data.checkIn, data.checkOut, data.nights, data.total_adults, data.total_children, data.total_guests, data.totalPrice || "", data.paymentStatus || "ОЖИДАЕТ ОПЛАТЫ"]] } });
      }

      if (data.contact) {
        const chatSheetName = getChatSheetName(data.name, data.contact);
        if (!ss.data.sheets.find(s => s.properties.title === chatSheetName)) {
          await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] } });
          memoryCache.isFormatted = false;
          await ensureSystemSheets();
        }
        const miniCard = data.itemType
          ? `✅ Ваш заказ #${data.itemId} принят!\nТовар: ${data.itemName}\nСтатус: ${data.status || "В ОБРАБОТКЕ"}`
          : `✅ Ваша запись подтверждена!\nДата: ${data.checkIn}\nУчастников: ${data.total_guests}`;
        await sheets.spreadsheets.values.append({ spreadsheetId, range: `${chatSheetName}!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Sistem", miniCard, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      }

      return res.status(200).json({ success: true });
    } catch (err) { return res.status(200).json({ success: true, warning: err.message }); }
  }
}
