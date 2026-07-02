import { google } from 'googleapis';
export default async function handler(req, res) {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY) return res.status(200).send("BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Vasilisa Academy//Schedule//EN\nEND:VCALENDAR");
    const auth = new google.auth.GoogleAuth({ credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') }, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
    const sheets = google.sheets({ version: 'v4', auth });
    const db = await sheets.spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID, range: `Schedule!A:G` });
    const rows = db.data.values || [];
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Vasilisa Academy//Schedule//EN\n";
    rows.slice(1).forEach((row, i) => {
      // row[0] = Дата (dd.mm.yyyy), row[1] = Время начала (hh:mm), row[2] = Время конца (hh:mm), row[3] = Название
      if(row[0] && row[1] && row[2] && row[3]) {
        const [day, month, year] = row[0].split('.');
        const [startHour, startMinute] = row[1].split(':');
        const [endHour, endMinute] = row[2].split(':');
        const startDate = new Date(Date.UTC(year, month - 1, day, startHour, startMinute));
        const endDate = new Date(Date.UTC(year, month - 1, day, endHour, endMinute));
        const startDateISO = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const endDateISO = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        icsContent += `BEGIN:VEVENT\nUID:class-${i}@vasilisa.academy\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}\nDTSTART:${startDateISO}\nDTEND:${endDateISO}\nSUMMARY:${row[3]}\nLOCATION:Vasilisa Academy Workshop\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
      }
    });
    icsContent += "END:VCALENDAR";
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8'); res.setHeader('Content-Disposition', 'attachment; filename="vasilisa-academy.ics"'); res.status(200).send(icsContent);
  } catch (error) { res.status(500).json({ error: "iCal Export Failed" }); }
}
