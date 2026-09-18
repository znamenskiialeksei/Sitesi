// ==============================================================================
// УТИЛИТА ОБРАБОТКИ МЕДИАФАЙЛОВ И КАРУСЕЛЬ GOOGLE DRIVE / IFRAME
// Файл: utils/media.js
// Назначение: Парсинг ссылок Google Диска, YouTube, Vimeo и встраиваемых iframes
// для отображения в слайдере и фотосетке листинга виллы в стиле Airbnb.
// ==============================================================================

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Maximize2, Image as ImageIcon } from 'lucide-react';

/**
 * Преобразует ссылки любого формата (Google Drive, YouTube, прямые URL) в рабочий адрес
 * @param {string} url - Исходная ссылка или HTML iframe
 * @param {'image' | 'video'} type - Тип контента: изображение или видео
 * @returns {string} Валидный URL для тегов <img> или <iframe>/<video>
 */
export const parseDriveLink = (url, type = 'image') => {
  if (!url) return '';
  const strItem = String(url).trim();

  // Если передан готовый HTML-код iframe (например, Matterport 3D тур или плеер)
  if (strItem.toLowerCase().startsWith('<iframe')) {
    return strItem;
  }

  // 1. Распознавание ссылок Google Drive
  // Форматы: drive.google.com/file/d/ID/... или drive.google.com/open?id=ID или drive.google.com/uc?id=ID
  const driveFileMatch = strItem.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveIdMatch = strItem.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/);
  const driveId = driveFileMatch ? driveFileMatch[1] : (driveIdMatch ? driveIdMatch[1] : null);

  if (driveId) {
    // Для фото используем высококачественный thumbnail с шириной 1920px
    // Для видео используем защищенный Google Drive плеер /preview
    return type === 'image'
      ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920`
      : `https://drive.google.com/file/d/${driveId}/preview`;
  }

  // 2. Распознавание ссылок YouTube
  const ytMatch = strItem.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return type === 'image'
      ? `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`
      : `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  }

  // 3. Распознавание ссылок Vimeo
  const vimeoMatch = strItem.match(/vimeo\.com\/([0-9]+)/);
  if (vimeoMatch && type === 'video') {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Прямой URL возвращается без изменений
  return strItem;
};

/**
 * Интерактивный компонент карусели для карточек услуг, видеогидов и галереи
 * @param {Object} props
 * @param {string[]} props.media - Массив ссылок на фото, видео или iframes
 * @param {'image' | 'video'} props.type - Тип медиа
 * @param {string} props.className - Дополнительные CSS классы контейнера
 * @param {Function} props.onItemClick - Обработчик клика по текущему слайду
 */
export const MediaCarousel = ({
  media = [],
  type = 'image',
  className = '',
  onItemClick = null
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Нормализация массива медиа
  const mediaList = Array.isArray(media) ? media.filter(Boolean) : (media ? [media] : []);

  // Если список медиа пуст — отображаем элегантный плейсхолдер
  if (mediaList.length === 0) {
    return (
      <div className={`w-full h-full bg-slate-800/80 flex flex-col items-center justify-center text-slate-500 text-xs ${className}`}>
        <ImageIcon className="w-8 h-8 mb-1.5 opacity-40" />
        <span>Нет доступных медиа</span>
      </div>
    );
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  const currentItem = mediaList[currentIndex];
  const strItem = String(currentItem).trim();
  const isIframeRaw = strItem.toLowerCase().startsWith('<iframe');
  const finalUrl = parseDriveLink(strItem, type);
  const isIframeUrl = finalUrl.includes('/preview') || finalUrl.includes('youtube.com/embed') || finalUrl.includes('player.vimeo.com');

  return (
    <div
      onClick={() => onItemClick && onItemClick(currentIndex, mediaList)}
      className={`relative w-full h-full group overflow-hidden bg-slate-900 select-none ${className}`}
    >
      {/* 1. Прямой HTML iframe (например, 3D Matterport) */}
      {isIframeRaw ? (
        <div
          className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: strItem }}
        />
      ) : isIframeUrl ? (
        /* 2. Встроенный плеер видео (Google Drive preview, YouTube, Vimeo) */
        <iframe
          src={finalUrl}
          title={`media-preview-${currentIndex}`}
          className="absolute inset-0 w-full h-full border-0 object-cover"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : type === 'video' && !isIframeUrl ? (
        /* 3. Прямой видеофайл HTML5 (.mp4 / .webm) */
        <video
          src={finalUrl}
          controls
          controlsList="nodownload"
          playsInline
          className="absolute inset-0 w-full h-full object-cover bg-black"
        />
      ) : (
        /* 4. Фотография высокого разрешения с фолбэком */
        <img
          src={finalUrl}
          alt={`Villa Media Slide ${currentIndex + 1}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          onError={(e) => {
            // Фолбэк при сетевой недоступности изображения
            e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200";
          }}
        />
      )}

      {/* Затемняющий градиент при наведении для акцента на кнопках */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Кнопки переключения слайдов (показываются только если фото > 1) */}
      {mediaList.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Предыдущее фото"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Следующее фото"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg border border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Индикаторные точки внизу карточки */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md pointer-events-none">
            {mediaList.slice(0, 8).map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`h-1.5 rounded-full transition-all duration-300 ${dotIdx === currentIndex
                    ? 'w-4 bg-white shadow'
                    : 'w-1.5 bg-white/50'
                  }`}
              />
            ))}
            {mediaList.length > 8 && (
              <span className="text-[9px] text-white/80 font-mono ml-0.5">
                +{mediaList.length - 8}
              </span>
            )}
          </div>
        </>
      )}

      {/* Бейдж типа медиа (Видео) */}
      {type === 'video' && !isIframeUrl && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 pointer-events-none">
          <Play className="w-3 h-3 text-rose-400 fill-rose-400" />
          <span>ВИДЕО</span>
        </div>
      )}
    </div>
  );
};

