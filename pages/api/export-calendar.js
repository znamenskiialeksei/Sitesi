// ==============================================================================
// ЭКСПОРТ СОБСТВЕННОГО КАЛЕНДАРЯ В ФОРМАТЕ RFC 5545 (iCal Feed)
// Файл: pages/api/export-calendar.js
// Назначение: Генерация динамического .ics файла для синхронизации броней и блокировок
// виллы с внешними OTA-платформами (Airbnb, Booking.com, Vrbo, Avito и др.).
// ДИНАМИЧЕСКАЯ ПРИВЯЗКА: Листы календаря и бронирований находятся через sheetsRegistry по ID и алиасам.
// ==============================================================================

import { google } from 'googleapis';
import { getLiveSheetMap, resolveRange } from '../../utils/sheetsRegistry';

export default async function handler(req, res) {
  try {
    // Если ключи Google Sheets не настроены, возвращаем базовый пустой валидный календарь
    const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
    const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();
    if (
      !rawKey ||
      !clientEmail ||
      clientEmail.includes('your-service-account-email') ||
      rawKey.includes('YOUR_PRIVATE_KEY') ||
      process.env.GOOGLE_SPREADSHEET_ID === 'your_google_sheet_id'
    ) {
      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      return res.status(200).send('BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Villa Turaman//Airbnb Platform//RU\nEND:VCALENDAR');
    }

    // Универсальный парсер PEM-ключа (обрабатывает все форматы .env)
    const parsePrivateKey = (raw) => {
      if (!raw) return '';
      let key = raw.replace(/^["']|["']$/g, '');
      key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
      key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      return key.trim();
    };
    // Авторизация сервисного аккаунта Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY)
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // Динамический резолвер актуальных названий листов
    const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);
    const calRange = resolveRange(sheetMap, 'CALENDAR', 'A:G');
    const bookRange = resolveRange(sheetMap, 'BOOKINGS', 'A:K');

    // Считываем правила блокировок и подтвержденные бронирования
    const [settingsRes, bookingsRes] = await Promise.allSettled([
      sheets.spreadsheets.values.get({ spreadsheetId, range: calRange }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: bookRange })
    ]);

    // Инициализация заголовка iCal (RFC 5545)
    let icsContent = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Villa Turaman//Airbnb Platform v2.0//RU\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:Villa Turaman Bookings & Blocks\r\nX-WR-TIMEZONE:UTC\r\n';

    // 1. Экспорт ручных блокировок из листа Календаря
    if (settingsRes.status === 'fulfilled' && settingsRes.value?.data?.values) {
      const rows = settingsRes.value.data.values.slice(1);
      rows.forEach((row, i) => {
        // row[0] = start (DD.MM.YYYY), row[1] = end (DD.MM.YYYY), row[2] = type
        if (row[0] && row[1] && String(row[2]).trim().toLowerCase().includes('блокировк')) {
          const sParts = row[0].split('.');
          const eParts = row[1].split('.');
          if (sParts.length === 3 && eParts.length === 3) {
            const startStr = `${sParts[2]}${sParts[1].padStart(2, '0')}${sParts[0].padStart(2, '0')}`;
            const endStr = `${eParts[2]}${eParts[1].padStart(2, '0')}${eParts[0].padStart(2, '0')}`;
            icsContent += 'BEGIN:VEVENT\r\n';
            icsContent += `UID:block-${i}-${Date.now()}@villaturaman.com\r\n`;
            icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\n`;
            icsContent += `DTSTART;VALUE=DATE:${startStr}\r\n`;
            icsContent += `DTEND;VALUE=DATE:${endStr}\r\n`;
            icsContent += 'SUMMARY:Closed Dates (Villa Turaman)\r\n';
            icsContent += 'DESCRIPTION:Manual host calendar block\r\n';
            icsContent += 'STATUS:CONFIRMED\r\n';
            icsContent += 'END:VEVENT\r\n';
          }
        }
      });
    }

    // 2. Экспорт подтвержденных и оплаченных броней из листа Бронирований
    if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.data?.values) {
      const bRows = bookingsRes.value.data.values.slice(1);
      bRows.forEach((row, i) => {
        // row[3]=Старт, row[4]=Завершение, row[10]=Статус оплаты
        const checkIn = row[3];
        const checkOut = row[4];
        const status = String(row[10] || '').toUpperCase();

        if (checkIn && checkOut && (status.includes('ОПЛАЧЕНО') || status.includes('ОЖИДАЕТ ОПЛАТЫ') || status.includes('ПОДТВЕРЖДЕНО'))) {
          const sParts = checkIn.split('.');
          const eParts = checkOut.split('.');
          if (sParts.length === 3 && eParts.length === 3) {
            const startStr = `${sParts[2]}${sParts[1].padStart(2, '0')}${sParts[0].padStart(2, '0')}`;
            const endStr = `${eParts[2]}${eParts[1].padStart(2, '0')}${eParts[0].padStart(2, '0')}`;
            icsContent += 'BEGIN:VEVENT\r\n';
            icsContent += `UID:booking-${i}-${Date.now()}@villaturaman.com\r\n`;
            icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\n`;
            icsContent += `DTSTART;VALUE=DATE:${startStr}\r\n`;
            icsContent += `DTEND;VALUE=DATE:${endStr}\r\n`;
            icsContent += 'SUMMARY:Reserved (Villa Turaman Direct Guest)\r\n';
            icsContent += 'STATUS:CONFIRMED\r\n';
            icsContent += 'END:VEVENT\r\n';
          }
        }
      });
    }

    icsContent += 'END:VCALENDAR\r\n';

    // Установка корректных MIME-заголовков для iCalendar
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="villaturaman-schedule.ics"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).send(icsContent);
  } catch (error) {
    console.error('Ошибка генерации iCal экспорта:', error);
    return res.status(500).json({ error: 'iCal Export Failed', details: error.message });
  }
}
