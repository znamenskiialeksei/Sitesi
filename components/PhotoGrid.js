// ==============================================================================
// 5-КОМПОНЕНТНАЯ ФОТОСЕТКА В СТИЛЕ AIRBNB С ПОЛНОЭКРАННОЙ ГАЛЕРЕЕЙ
// Файл: components/PhotoGrid.js
// Назначение: Презентация интерьера и территории, полноэкранный лайтбокс
// с динамической поддержкой ссылок Google Drive, альбомов и подписей из Google Sheets.
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, X, ChevronLeft, ChevronRight, Play, Maximize2, Layers } from 'lucide-react';
import { useLanguage } from '../utils/language';
import { parseDriveLink } from '../utils/media';

export default function PhotoGrid({ photos = [], gallery = [], heroImage = '' }) {
  const { t, lang } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // Набор фотографий по умолчанию (высокое разрешение 1600px)
  const defaultPhotos = [
    { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600", caption: "Главный фасад Villa Turaman" },
    { url: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200", caption: "Приватный бассейн с шезлонгами" },
    { url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200", caption: "Затененная зона отдыха в саду" },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200", caption: "Просторная видовая гостиная" },
    { url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200", caption: "Полностью оборудованная кухня" }
  ];

  // Сборка и нормализация всех доступных изображений из Google Sheets
  const allMediaItems = useMemo(() => {
    const list = [];

    // 1. Главное фото из таблицы HomePage
    if (heroImage) {
      list.push({
        url: parseDriveLink(heroImage, 'image'),
        caption: 'Dalyan Turaman [частный бассейн, 10 спальных мест]',
        group: 'Фасад виллы'
      });
    }

    // 2. Медиафайлы из таблицы Gallery
    if (Array.isArray(gallery) && gallery.length > 0) {
      gallery.forEach((item) => {
        const mediaUrls = Array.isArray(item.media) ? item.media : (item.media ? [item.media] : []);
        const groupName = item.group?.[lang] || item.group?.ru || 'Галерея';
        const captionText = item.caption?.[lang] || item.caption?.ru || '';

        mediaUrls.forEach((rawUrl) => {
          if (rawUrl) {
            list.push({
              url: parseDriveLink(rawUrl, item.type || 'image'),
              rawUrl: rawUrl,
              type: item.type || 'image',
              caption: captionText,
              group: groupName
            });
          }
        });
      });
    }

    // 3. Прямо переданный массив photos
    if (Array.isArray(photos) && photos.length > 0) {
      photos.forEach((p) => {
        if (p) {
          const urlStr = typeof p === 'string' ? p : p.url;
          if (urlStr && !list.some((item) => item.url === urlStr)) {
            list.push({
              url: parseDriveLink(urlStr, 'image'),
              caption: (typeof p === 'object' && p.caption) || '',
              group: (typeof p === 'object' && p.group) || 'Вилла'
            });
          }
        }
      });
    }

    // Фолбэк на дефолтный набор, если фото меньше 5
    if (list.length < 5) {
      defaultPhotos.forEach((dp) => {
        if (!list.some((item) => item.url === dp.url)) {
          list.push({
            url: dp.url,
            caption: dp.caption,
            group: 'Вилла'
          });
        }
      });
    }

    return list;
  }, [heroImage, gallery, photos, lang]);

  const openLightbox = (index = 0) => {
    setCurrentPhotoIdx(index);
    setLightboxOpen(true);
  };

  const nextPhoto = (e) => {
    e?.stopPropagation();
    setCurrentPhotoIdx((prev) => (prev + 1) % allMediaItems.length);
  };

  const prevPhoto = (e) => {
    e?.stopPropagation();
    setCurrentPhotoIdx((prev) => (prev - 1 + allMediaItems.length) % allMediaItems.length);
  };

  // Навигация стрелками клавиатуры и клавиша Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allMediaItems.length]);

  const currentItem = allMediaItems[currentPhotoIdx] || allMediaItems[0];

  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden mb-8 group select-none">
      {/* 5-компонентная сетка AirBnB */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:h-[480px]">

        {/* Главная большая фотография (слева, 2 колонки) */}
        <div
          onClick={() => openLightbox(0)}
          className="md:col-span-2 h-64 md:h-full relative cursor-pointer overflow-hidden group/main"
        >
          <img
            src={allMediaItems[0]?.url}
            alt="Villa Turaman Main View"
            className="w-full h-full object-cover group-hover/main:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover/main:bg-transparent transition-colors" />
        </div>

        {/* Сетка из 4 малых фотографий (справа) */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
          {allMediaItems.slice(1, 5).map((item, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx + 1)}
              className="relative cursor-pointer overflow-hidden group/thumb h-full"
            >
              <img
                src={item.url}
                alt={`Villa View ${idx + 2}`}
                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-transparent transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка "Показать все фото" в правом нижнем углу */}
      <button
        onClick={() => openLightbox(0)}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-slate-900/90 hover:bg-black text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl border border-white/20 shadow-xl backdrop-blur-md transition-all hover:scale-105"
      >
        <LayoutGrid className="w-4 h-4" />
        <span>{t('showAllPhotos') || 'Показать все фото'} ({allMediaItems.length})</span>
      </button>

      {/* Полноэкранный лайтбокс */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-between p-4 select-none fade-in">

          {/* Верхняя панель управления */}
          <div className="w-full max-w-6xl flex items-center justify-between z-20 py-2">
            <div className="flex items-center gap-3">
              <span className="text-white text-xs md:text-sm font-bold bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                {currentPhotoIdx + 1} / {allMediaItems.length}
              </span>
              {currentItem?.group && (
                <span className="hidden sm:inline-block text-slate-400 text-xs font-medium">
                  {t('albumLabel') || 'Альбом:'} <strong className="text-white">{currentItem.group}</strong>
                </span>
              )}
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Центральная зона с кнопками переключения и активным изображением */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center min-h-0">
            {/* Стрелка влево */}
            <button
              onClick={prevPhoto}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110 z-20 shadow-xl backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Активное полноразмерное изображение */}
            <div className="max-w-full max-h-[75vh] flex items-center justify-center p-2">
              <img
                src={currentItem?.url}
                alt={currentItem?.caption || "Villa Turaman Full View"}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-opacity duration-300"
              />
            </div>

            {/* Стрелка вправо */}
            <button
              onClick={nextPhoto}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110 z-20 shadow-xl backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Нижняя панель с подписью и лентой миниатюр */}
          <div className="w-full max-w-4xl flex flex-col items-center gap-3 py-3 z-20">
            {currentItem?.caption && (
              <p className="text-center text-xs md:text-sm text-slate-200 font-medium px-4">
                {currentItem.caption}
              </p>
            )}

            {/* Горизонтальная лента миниатюр для быстрого перехода */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 scrollbar-none">
              {allMediaItems.map((item, thumbIdx) => (
                <button
                  key={thumbIdx}
                  onClick={() => setCurrentPhotoIdx(thumbIdx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${thumbIdx === currentPhotoIdx
                      ? 'border-rose-500 scale-110 shadow-lg'
                      : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                >
                  <img src={item.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
