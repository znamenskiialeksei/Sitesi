# План: Управление контентом через Google Sheets CMS и Медиа Пайплайн Google Drive

- **Дата утверждения:** 18.09.2026 17:15
- **Статус:** ✅ Успешно реализовано
- **Ключевой модуль:** Dynamic CMS / Google Sheets API + Google Drive Media Pipeline + Next.js ISR Cache

---

## 1. Цель и контекст задачи
Требовалось обеспечить 100% управление контентом виллы (Hero, описания, услуги, путеводители, юридические реквизиты VKN 9991120181, фотоальбомы и видео) напрямую из Google Таблицы:
1. Создать динамический серверный эндпоинт `/api/content` с оперативным кэшированием (30 сек) и принудительным сбросом кэша `force=true`.
2. Реализовать модуль `utils/media.js` с поддержкой любых ссылок Google Drive (включая ссылки общего доступа) с авто-конвертацией в прямые HD-превью и встраиваемые видеоплееры.
3. Разработать медиа-галерею `components/GallerySection.js` в стиле Airbnb с фильтрацией по категориям и поддержкой каруселей.
4. Наполнить `utils/content.json` реальными производственными данными на 3 языках.

---

## 2. Затронутые файлы и компоненты
| Файл | Описание | Ссылка |
| :--- | :--- | :--- |
| `utils/media.js` | Конвертация ссылок Google Drive, YouTube, Vimeo в прямые веб-потоки | [utils/media.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/utils/media.js) |
| `pages/api/content.js` | Серверный шлюз параллельного считывания 7 листов Google Таблиц | [pages/api/content.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/pages/api/content.js) |
| `utils/content.json` | Локальный кэш производственного контента на RU, EN, TR | [utils/content.json](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/utils/content.json) |
| `components/GallerySection.js` | Полноэкранная медиа-галерея виллы с альбомами и модальным лайтбоксом | [components/GallerySection.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/components/GallerySection.js) |

---

## 3. Ключевые фрагменты кода
```javascript
// Конвертер Google Drive ID в прямое превью высокого разрешения
export function parseDriveLink(link) {
  if (!link) return { type: 'unknown', url: '' };
  const driveMatch = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || link.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    return {
      type: 'drive',
      id: fileId,
      previewUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`,
      embedVideoUrl: `https://drive.google.com/file/d/${fileId}/preview`
    };
  }
  return { type: 'direct', url: link };
}
```

---

## 4. Результаты верификации
- Контент сайта мгновенно обновляется при изменении ячеек в Google Таблицах.
- Ссылки на Google Drive корректно отображаются в каруселях фотосетки и модальных окнах без блокировок CORS.
