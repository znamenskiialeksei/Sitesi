// Этот скрипт вставляется в редактор Apps Script вашей Google Таблицы.
function sendUpdateSignal(e) {
  if (!e) return;
  var sheetName = e.source.getActiveSheet().getName();
  var staticContentSheets = ["HomePage", "About", "Legal", "Templates"];
  var dynamicDataSheets = ["ExtraServices", "VideoGuides", "CalendarSettings", "Gallery"];
  
  var scriptProperties = PropertiesService.getScriptProperties();
  var VERCEL_DEPLOY_HOOK_URL = scriptProperties.getProperty('VERCEL_DEPLOY_HOOK_URL');
  var REVALIDATE_API_URL = scriptProperties.getProperty('REVALIDATE_API_URL');
  var REVALIDATE_SECRET_TOKEN = scriptProperties.getProperty('REVALIDATE_SECRET_TOKEN');
  
  try {
    if (staticContentSheets.indexOf(sheetName) !== -1) {
      if (VERCEL_DEPLOY_HOOK_URL) UrlFetchApp.fetch(VERCEL_DEPLOY_HOOK_URL, { "method": "post", "muteHttpExceptions": true });
    } else if (dynamicDataSheets.indexOf(sheetName) !== -1) {
      if (REVALIDATE_API_URL && REVALIDATE_SECRET_TOKEN) {
        UrlFetchApp.fetch(REVALIDATE_API_URL + '?secret=' + REVALIDATE_SECRET_TOKEN, { "method": "post", "muteHttpExceptions": true });
      }
    }
  } catch (error) { Logger.log("Сбой отправки сигнала: " + error.toString()); }
}
