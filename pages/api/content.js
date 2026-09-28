// [ПРЕДЫДУЩАЯ РЕДАКЦИЯ: 28.09.2026 14:15 | ПЛАН: 280920261415 ПЛАН Комплексная модернизация экосистемы.md | TAG: VILLA-FULL-ECOSYSTEM-UPGRADE-280920261415]
// [АКТУАЛЬНАЯ РЕДАКЦИЯ: 28.09.2026 19:40 | ПЛАН: 280920261940 ПЛАН 13 колонок ACCOUNTS и восстановление.md | TAG: VILLA-RAW-SHEETS-API-280920261940]
// ==============================================================================
// СЕРВЕРНЫЙ ЭНДПОИНТ ДИНАМИЧЕСКОГО КОНТЕНТА GOOGLE SHEETS
// Файл: pages/api/content.js
// Назначение: Чтение в реальном времени всех текстов, авто-переводов, фото, видео,
// услуг, видеогидов и галереи напрямую из Google Таблицы с кэшированием и fallback.
// ДИНАМИЧЕСКАЯ ПРИВЯЗКА: Работает через реестр sheetsRegistry по постоянным sheetId и алиасам.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { getOrFetchLiveContent, clearLiveContentCache, updateLiveContentFromPayload } from '../../utils/liveContentSync';
import { MASTER_RAW_SHEETS } from '../../utils/masterSeedContent';

/**
 * Сброс кэша в памяти сервера для обратной совместимости
 */
export function clearMemoryCache() {
  clearLiveContentCache();
}

/**
 * Обработчик запроса получения контента
 * Поддерживает GET и POST: с опцией force=true для сброса или livePayload для прямого обновления
 */
export default async function handler(req, res) {
  const action = req.body?.action || req.query?.action;

  // 1. Экспорт эталонных строк для Google Apps Script: Cloud API Seed Pull
  if (action === 'get_sheet_seed') {
    try {
      const targetSheet = (req.query?.sheet || req.body?.sheet || 'ALL').toString().toUpperCase();
      const contentJsonPath = path.join(process.cwd(), 'utils', 'content.json');
      let contentData = null;

      if (fs.existsSync(contentJsonPath)) {
        try {
          contentData = JSON.parse(fs.readFileSync(contentJsonPath, 'utf8'));
        } catch (e) {}
      }

      if (!contentData) {
        contentData = await getOrFetchLiveContent(false);
      }

      return res.status(200).json({
        success: true,
        sheet: targetSheet,
        rawSheets: MASTER_RAW_SHEETS,
        data: contentData,
        timestamp: new Date().toISOString()
      });
    } catch (seedErr) {
      console.error('Ошибка в get_sheet_seed:', seedErr.message);
      return res.status(500).json({ success: false, error: seedErr.message });
    }
  }

  // 2. Фиксация эталона в masterSeedContent.js и content.json при ручном вызове или публикации
  if ((req.method === 'POST' && req.body?.livePayload) || action === 'save_master_seed') {
    try {
      const payload = req.body?.livePayload || req.body;
      const data = updateLiveContentFromPayload(payload);

      // Атомарное сохранение в локальный файл utils/content.json при наличии прав записи
      try {
        const contentPath = path.join(process.cwd(), 'utils', 'content.json');
        fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf8');
      } catch (fsErr) {
        console.warn('Запись в utils/content.json пропущена [read-only filesystem]:', fsErr.message);
      }

      // Сохранение в межконтейнерный кэш /tmp
      try {
        const tmpPath = path.join('/tmp', 'masterSeedContent.json');
        fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
      } catch (tmpErr) {}

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('X-Content-Source', 'google_apps_script_push');
      return res.status(200).json({
        success: true,
        message: 'Эталон базы данных успешно обновлен в памяти и кэше',
        data
      });
    } catch (pushErr) {
      console.error('Ошибка прямого обновления кэша контента:', pushErr.message);
      return res.status(500).json({ success: false, error: pushErr.message });
    }
  }

  const isForce = req.query.force === 'true' || req.body?.force === true;

  try {
    const data = await getOrFetchLiveContent(isForce);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    if (data && data.source) {
      res.setHeader('X-Content-Source', String(data.source));
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error('Ошибка в API получения контента:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
