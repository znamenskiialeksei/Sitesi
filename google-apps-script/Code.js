// ==============================================================================
// АВТОМАТИЗАЦИЯ GOOGLE APPS SCRIPT ДЛЯ СИНХРОНИЗАЦИИ VILLA TURAMAN
// Файл: google-apps-script/Code.js
// Назначение: Скрипт устанавливается в редактор Google Таблицы (Расширения -> Apps Script).
// Обеспечивает мгновенную отправку вебхука ревалидации в Next.js при редактировании любых
// ячеек контента, фото, видео, услуг, цен и бронирований.
// ==============================================================================

/**
 * Триггер редактирования таблицы (Installable OnEdit Trigger)
 * Срабатывает автоматически при внесении любых изменений владельцем
 * @param {Object} e - Событие редактирования Google Sheets
 */
function sendUpdateSignal(e) {
  if (!e) return;

  var sheetName = e.source.getActiveSheet().getName();

  // 1. Листы со статическим контентом (заголовки, описания, правила)
  var staticContentSheets = ["HomePage", "About", "Legal", "Templates"];

  // 2. Листы с динамическими данными (услуги, видеогиды, календарь, фото/видео галерея)
  var dynamicDataSheets = ["ExtraServices", "VideoGuides", "CalendarSettings", "Gallery", "Variables"];

  var scriptProperties = PropertiesService.getScriptProperties();
  var VERCEL_DEPLOY_HOOK_URL = scriptProperties.getProperty('VERCEL_DEPLOY_HOOK_URL');
  var REVALIDATE_API_URL = scriptProperties.getProperty('REVALIDATE_API_URL');
  var REVALIDATE_SECRET_TOKEN = scriptProperties.getProperty('REVALIDATE_SECRET_TOKEN');

  try {
    if (staticContentSheets.indexOf(sheetName) !== -1) {
      // Отправка сигнала обновления статических страниц
      if (REVALIDATE_API_URL && REVALIDATE_SECRET_TOKEN) {
        UrlFetchApp.fetch(REVALIDATE_API_URL + '?secret=' + encodeURIComponent(REVALIDATE_SECRET_TOKEN), {
          "method": "post",
          "muteHttpExceptions": true
        });
      }
      if (VERCEL_DEPLOY_HOOK_URL) {
        UrlFetchApp.fetch(VERCEL_DEPLOY_HOOK_URL, { "method": "post", "muteHttpExceptions": true });
      }
    } else if (dynamicDataSheets.indexOf(sheetName) !== -1) {
      // Мгновенная ревалидация ISR для витрины листинга и галереи
      if (REVALIDATE_API_URL && REVALIDATE_SECRET_TOKEN) {
        UrlFetchApp.fetch(REVALIDATE_API_URL + '?secret=' + encodeURIComponent(REVALIDATE_SECRET_TOKEN), {
          "method": "post",
          "muteHttpExceptions": true
        });
      }
    }
  } catch (error) {
    Logger.log("⚠️ Сбой отправки сигнала ревалидации: " + error.toString());
  }
}

