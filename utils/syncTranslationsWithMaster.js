// [ПРЕДЫДУЩАЯ РЕДАКЦИЯ: 26.09.2026 23:55 | ПЛАН: 260920262345 Комплексная стабилизация эталона кабинета хозяина и кэша.md | TAG: VILLA-TRANSLATIONS-HOSTCABINET-260920262355]
// [АКТУАЛЬНАЯ РЕДАКЦИЯ: 27.09.2026 00:25 | ПЛАН: 270920260015 Синхронизация translations.md | TAG: VILLA-TRANSLATIONS-SYNC-270920260015]
// ==============================================================================
// УТИЛИТА СИНХРОНИЗАЦИИ АВАРИЙНОЙ СТРАХОВОЧНОЙ ВИТРИНЫ TRANSLATIONS.JS
// Файл: utils/syncTranslationsWithMaster.js
// Назначение: Обеспечивает 100% актуализацию резервного словаря витрины translations.js
// на основе живых данных Google Таблиц при фиксации эталона SSOT.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

const fs = require('fs');
const path = require('path');

const KEY_MAPPINGS = [
  { translationKey: 'heroTitle', sheetKeys: ['hero_title'] },
  { translationKey: 'heroSubtitle', sheetKeys: ['hero_subtitle'] },
  { translationKey: 'locationText', sheetKeys: ['hero_location', 'location_text'] },
  { translationKey: 'aboutVillaTitle', sheetKeys: ['about_title'] },
  { translationKey: 'aboutVillaText', sheetKeys: ['about_text'] },
  { translationKey: 'reviewsCountText', sheetKeys: ['hero_reviews_count'] },
  { translationKey: 'entireVilla', sheetKeys: ['badge_entire_home', 'entire_villa'] },
  { translationKey: 'guestsSummary', sheetKeys: ['specs_summary', 'spec_guests'] },
  { translationKey: 'amenityPool', sheetKeys: ['amenity_pool'] },
  { translationKey: 'amenityMountain', sheetKeys: ['amenity_mountain'] },
  { translationKey: 'amenityWifi', sheetKeys: ['amenity_wifi'] },
  { translationKey: 'amenityAC', sheetKeys: ['amenity_ac'] },
  { translationKey: 'amenityKitchen', sheetKeys: ['amenity_kitchen'] },
  { translationKey: 'amenityParking', sheetKeys: ['amenity_parking'] },
  { translationKey: 'amenityBBQ', sheetKeys: ['amenity_bbq'] },
  { translationKey: 'amenityWasher', sheetKeys: ['amenity_washer'] },
  { translationKey: 'amenityWorkspace', sheetKeys: ['amenity_workspace'] },
  { translationKey: 'amenitySecurity', sheetKeys: ['amenity_security'] }
];

/**
 * Синхронизирует блок витрины в utils/translations.js на основе masterHomeMap
 * @param {Object} masterHomeMap - карта строк Листа 1 [HOME]
 * @returns {boolean} - результат выполнения
 */
function syncTranslationsWithMaster(masterHomeMap) {
  try {
    const translationsPath = path.join(process.cwd(), 'utils', 'translations.js');
    if (!fs.existsSync(translationsPath)) {
      console.warn('[syncTranslationsWithMaster] Файл translations.js не найден по пути:', translationsPath);
      return false;
    }

    // Если masterHomeMap не передан, пытаемся загрузить из masterSeedContent.js
    let homeMap = masterHomeMap;
    if (!homeMap || Object.keys(homeMap).length === 0) {
      try {
        const seed = require('./masterSeedContent');
        homeMap = seed.MASTER_HOME_MAP || {};
      } catch (seedErr) {
        console.warn('[syncTranslationsWithMaster] Не удалось загрузить masterSeedContent:', seedErr.message);
        return false;
      }
    }

    if (!homeMap || Object.keys(homeMap).length === 0) {
      console.warn('[syncTranslationsWithMaster] masterHomeMap пуст: синхронизация пропущена');
      return false;
    }

    let fileContent = fs.readFileSync(translationsPath, 'utf8');

    // Разделение файла на языковые сегменты ru, en, tr
    const ruMarker = '\n  ru: {';
    const enMarker = '\n  en: {';
    const trMarker = '\n  tr: {';
    const endMarker = '\n};';

    const ruIdx = fileContent.indexOf(ruMarker);
    const enIdx = fileContent.indexOf(enMarker);
    const trIdx = fileContent.indexOf(trMarker);
    const endIdx = fileContent.lastIndexOf(endMarker);

    if (ruIdx === -1 || enIdx === -1 || trIdx === -1 || endIdx === -1) {
      console.warn('[syncTranslationsWithMaster] Не удалось распознать маркеры языковых блоков в translations.js');
      return false;
    }

    const prefix = fileContent.slice(0, ruIdx + ruMarker.length);
    let ruBlock = fileContent.slice(ruIdx + ruMarker.length, enIdx);
    const enPrefix = enMarker;
    let enBlock = fileContent.slice(enIdx + enMarker.length, trIdx);
    const trPrefix = trMarker;
    let trBlock = fileContent.slice(trIdx + trMarker.length, endIdx);
    const suffix = fileContent.slice(endIdx);

    // Функция замены значений ключей в рамках языкового блока
    const updateBlock = (block, lang) => {
      let updated = block;
      KEY_MAPPINGS.forEach(({ translationKey, sheetKeys }) => {
        let val = null;
        for (const sk of sheetKeys) {
          if (homeMap[sk] && homeMap[sk][lang]) {
            val = homeMap[sk][lang];
            break;
          }
        }
        if (val && typeof val === 'string' && val.trim().length > 0) {
          // Регулярное выражение для поиска ключа: translationKey: "..." или '...'
          const keyRegex = new RegExp(`(\\b${translationKey}\\s*:\\s*)(["'\`][\\s\\S]*?["'\`])(,)`, 'g');
          if (keyRegex.test(updated)) {
            updated = updated.replace(keyRegex, `$1${JSON.stringify(val.trim())}$3`);
          }
        }
      });
      return updated;
    };

    ruBlock = updateBlock(ruBlock, 'ru');
    enBlock = updateBlock(enBlock, 'en');
    trBlock = updateBlock(trBlock, 'tr');

    const updatedContent = prefix + ruBlock + enPrefix + enBlock + trPrefix + trBlock + suffix;

    fs.writeFileSync(translationsPath, updatedContent, 'utf8');
    console.log('[syncTranslationsWithMaster] Аварийный словарь витрины translations.js успешно синхронизирован с Google Таблицей.');
    return true;
  } catch (err) {
    console.error('[syncTranslationsWithMaster] Ошибка синхронизации translations.js:', err.message);
    return false;
  }
}

module.exports = {
  syncTranslationsWithMaster,
  KEY_MAPPINGS
};
