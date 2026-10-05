require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const contentFilePath = path.join(__dirname, '../utils/content.json');
const emptyContent = JSON.stringify({ home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] }, null, 2);

async function syncContent() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !GOOGLE_SPREADSHEET_ID || GOOGLE_SPREADSHEET_ID === "your_google_sheet_id") {
    console.warn('⚠️ Переменные Google Sheets не заданы корректно. Используется пустой content.json.');
    fs.writeFileSync(contentFilePath, emptyContent);
    return;
  }
  
  try {
    const auth = new google.auth.GoogleAuth({ credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL.trim(), private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').trim() }, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
    const sheets = google.sheets({ version: 'v4', auth });
    
    const content = { home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] };
    
    const safeGet = async (range) => {
        try { return await sheets.spreadsheets.values.get({ spreadsheetId: GOOGLE_SPREADSHEET_ID, range }); }
        catch (e) { console.warn(`- Не удалось получить данные для диапазона ${range}.`); return { data: { values: [] } }; }
    };

    console.log('Скачиваем тексты (HomePage, About, Legal, Templates)...');
    
    const homeData = await safeGet('HomePage!A:E');
    (homeData.data.values || []).slice(1).forEach(r => {
        if(r[0]) {
            content.home[r[0]] = { ru: r[1] || '', en: r[2] || '', tr: r[3] || '', media: r[4] || '' };
        }
    });

    const aboutData = await safeGet('About!A:G');
    const legalData = await safeGet('Legal!A:G');
    const templatesData = await safeGet('Templates!A:G');

    (aboutData.data.values || []).slice(1).forEach(r => { if(r[0]) content.about[r[0]] = { title: {ru: r[1], en: r[2], tr: r[3]}, text: {ru: r[4], en: r[5], tr: r[6]} }; });
    (legalData.data.values || []).slice(1).forEach(r => { if(r[0]) content.legal[r[0]] = { title: {ru: r[1], en: r[2], tr: r[3]}, text: {ru: r[4], en: r[5], tr: r[6]} }; });
    (templatesData.data.values || []).slice(1).forEach(r => {
        if(r[0]) {
          if (!content.templates[r[0]]) content.templates[r[0]] = [];
          content.templates[r[0]].push({ name: {ru: r[1], en: r[2], tr: r[3]}, text: {ru: r[4], en: r[5], tr: r[6]} });
        }
    });

    console.log('Скачиваем E-Commerce (Продукты и Гиды) и Галерею...');
    const productsSheet = await safeGet('ExtraServices!A:Q');
    content.products = (productsSheet.data.values || []).slice(1).map(r => ({
        id: r[0], name: { ru: r[1], en: r[3], tr: r[5] }, desc: { ru: r[2], en: r[4], tr: r[6] },
        price: { eur: r[7], rub: r[8], try: r[9] }, images: (r[10] || '').split(',').map(s => s.trim()).filter(Boolean),
        videos: (r[13] || '').split(',').map(s => s.trim()).filter(Boolean), detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
        type: { ru: r[12] === 'Пакет' ? 'Пакет услуг' : 'Услуга', en: r[12] === 'Пакет' ? 'Service Package' : 'Service', tr: r[12] === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet' }
    })).filter(p => p.id && p.name.ru);

    const coursesSheet = await safeGet('VideoGuides!A:Q');
    content.courses = (coursesSheet.data.values || []).slice(1).map(r => ({
        id: r[0], name: { ru: r[1], en: r[3], tr: r[5] }, desc: { ru: r[2], en: r[4], tr: r[6] },
        images: (r[7] || '').split(',').map(s => s.trim()).filter(Boolean), module: r[8] || 'Основной', privateLink: r[9],
        price: { eur: r[10], rub: r[11], try: r[12] }, videos: (r[13] || '').split(',').map(s => s.trim()).filter(Boolean),
        detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' }, level: 'Для гостей'
    })).filter(c => c.id && c.name.ru);

    const gallerySheet = await safeGet('Gallery!A:L');
    content.gallery = (gallerySheet.data.values || []).slice(1).map(r => ({
        id: r[0], group: { ru: r[1], en: r[3], tr: r[5] }, groupDesc: { ru: r[2], en: r[4], tr: r[6] },
        type: r[7] === 'Видео' ? 'video' : 'image', media: (r[8] || '').split(',').map(s => s.trim()).filter(Boolean), caption: { ru: r[9], en: r[10], tr: r[11] }
    })).filter(g => g.id && g.media.length > 0);

    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2));
    console.log('✅ Контент успешно выкачан и сохранен в content.json.');
  } catch (err) { fs.writeFileSync(contentFilePath, emptyContent); }
}

syncContent();
