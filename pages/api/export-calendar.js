import { google } from 'googleapis'; // Подключение Google API для формирования собственного iCal

export default async function handler(req, res) {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY) return res.status(200).send("BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR");
    
    // Авторизация в Google Sheets
    const auth = new google.auth.GoogleAuth({ 
      credentials: { 
        client_email: process.env.GOOGLE_CLIENT_EMAIL, 
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') 
      }, 
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] 
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Получение настроек блокировок из листа CalendarSettings
    const db = await sheets.spreadsheets.values.get({ 
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID, 
      range: `CalendarSettings!A:G` 
    });
    
    const rows = db.data.values || [];
    
    // Инициализация тела ics файла
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Villa Turaman//Booking System//EN\n";
    
    // Генерация событий блокировок
    rows.slice(1).forEach((row, i) => {
      if(row[0] && row[1] && row[2] === 'Блокировка') {
        const start = row[0].split('.').reverse().join(''); 
        const end = row[1].split('.').reverse().join('');
        icsContent += `BEGIN:VEVENT\nUID:block-${i}@villaturaman.com\nDTSTART;VALUE=DATE:${start}\nDTEND;VALUE=DATE:${end}\nSUMMARY:Closed Dates (Villa Turaman)\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
      }
    });
    
    icsContent += "END:VCALENDAR";
    
    // Установка заголовков для отдачи файла как .ics календаря
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8'); 
    res.setHeader('Content-Disposition', 'attachment; filename="villaturaman-schedule.ics"'); 
    res.status(200).send(icsContent);
  } catch (error) { 
    res.status(500).json({ error: "iCal Export Failed" }); 
  }
}
