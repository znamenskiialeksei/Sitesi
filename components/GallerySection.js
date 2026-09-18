// ==============================================================================
// КАТЕГОРИЗИРОВАННАЯ ФОТО- И ВИДЕОГАЛЕРЕЯ VILLA TURAMAN
// Файл: components/GallerySection.js
// Назначение: Отображение альбомов виллы (территория, интерьер, кухня, окрестности),
// динамически загружаемых из Google Sheets с авто-переводом, видео и каруселями.
// ==============================================================================

import React, { useState } from 'react';
import { Camera, Play, Image as ImageIcon, Sparkles, ChevronRight, Maximize2 } from 'lucide-react';
import { useLanguage } from '../utils/language';
import { MediaCarousel, parseDriveLink } from '../utils/media';

export default function GallerySection({ gallery = [], onOpenLightbox = null }) {
  const { t, lang } = useLanguage();
  const [activeGroupFilter, setActiveGroupFilter] = useState('all');

  const getLocalized = (obj, field) => {
    if (!obj || !obj[field]) return '';
    if (typeof obj[field] === 'string') return obj[field];
    return obj[field][lang] || obj[field]['ru'] || '';
  };

  const defaultGallery = [
    {
      id: 'gal-default-1',
      group: { ru: 'Бассейн и лаунж-терраса', en: 'Pool & Lounge', tr: 'Havuz ve Dinlenme Alanı' },
      groupDesc: { ru: 'Кристально чистый бассейн глубиной 1.5м с шезлонгами', en: 'Crystal clean 1.5m pool with sun loungers', tr: 'Şezlonglu 1.5m derinliğinde kristal havuz' },
      type: 'image',
      media: ['https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1600'],
      caption: { ru: 'Приватный бассейн виллы с удобными шезлонгами', en: 'Private pool with sunbeds', tr: 'Özel havuz' }
    },
    {
      id: 'gal-default-2',
      group: { ru: 'Интерьер виллы и спальни', en: 'Villa Interior & Bedrooms', tr: 'Villa İç Mekan ve Yatak Odaları' },
      groupDesc: { ru: '4 просторные мастер-спальни с индивидуальными ванными', en: '4 spacious master bedrooms with en-suite bathrooms', tr: 'Özel banyolu 4 geniş ebeveyn yatak odası' },
      type: 'image',
      media: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600'],
      caption: { ru: 'Мастер-спальня №1 с кроватью King-Size', en: 'Master Bedroom #1 with King-Size bed', tr: 'King-Size yataklı 1 numaralı yatak odası' }
    },
    {
      id: 'gal-default-3',
      group: { ru: 'Окрестности Дальяна и река', en: 'Dalyan & River Surroundings', tr: 'Dalyan Çevresi ve Nehir' },
      groupDesc: { ru: 'Уникальная природа: Ликийские гробницы и пляж Изтузу', en: 'Unique nature: Lycian rock tombs and Iztuzu beach', tr: 'Eşsiz doğa: Likya kaya mezarları ve İztuzu plajı' },
      type: 'image',
      media: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600'],
      caption: { ru: 'Ликийские скальные гробницы IV века до н.э.', en: 'Lycian rock tombs IV century BC', tr: 'M.Ö. 4. yüzyıl Likya kaya mezarları' }
    }
  ];

  const effectiveGallery = gallery && gallery.length > 0 ? gallery : defaultGallery;

  // Группировка элементов галереи по категориям из Google Sheets
  const groupedGallery = effectiveGallery.reduce((acc, item) => {
    const groupName = getLocalized(item, 'group') || 'Общая галерея';
    if (!acc[groupName]) {
      acc[groupName] = {
        groupRaw: item.group,
        descRaw: item.groupDesc,
        title: groupName,
        desc: getLocalized(item, 'groupDesc'),
        items: []
      };
    }
    acc[groupName].items.push(item);
    return acc;
  }, {});

  const groupKeys = Object.keys(groupedGallery);

  // Фильтрация отображаемых групп
  const displayedGroups =
    activeGroupFilter === 'all'
      ? Object.values(groupedGallery)
      : Object.values(groupedGallery).filter((g) => g.title === activeGroupFilter);

  if (!effectiveGallery || effectiveGallery.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-14 border-t border-white/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Camera className="w-6 h-6 text-rose-500" />
            <span>{t('galleryTitle') || 'Галерея виллы и окрестностей'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Живые фотографии и видеотуры территории, спален и живописных мест Дальяна
          </p>
        </div>

        {/* Табы фильтрации альбомов */}
        {groupKeys.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1 rounded-2xl border border-white/10 max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveGroupFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeGroupFilter === 'all'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Все альбомы ({gallery.length})
            </button>
            {groupKeys.map((grpTitle) => (
              <button
                key={grpTitle}
                onClick={() => setActiveGroupFilter(grpTitle)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeGroupFilter === grpTitle
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {grpTitle} ({groupedGallery[grpTitle].items.length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Отображение альбомов и карточек */}
      <div className="space-y-12">
        {displayedGroups.map((groupObj, gIdx) => (
          <div key={gIdx} className="space-y-6">
            {/* Заголовок группы и описание альбома */}
            <div className="border-l-4 border-rose-500 pl-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {groupObj.title}
              </h3>
              {groupObj.desc && (
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {groupObj.desc}
                </p>
              )}
            </div>

            {/* Сетка карточек с медиа-каруселями */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupObj.items.map((item) => {
                const caption = getLocalized(item, 'caption');
                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/60 border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col hover:border-white/20 transition-all hover:-translate-y-1 group/card"
                  >
                    {/* Карусель фотографий / видео для текущего элемента */}
                    <div className="h-64 relative overflow-hidden bg-slate-900">
                      <MediaCarousel
                        media={item.media}
                        type={item.type || 'image'}
                        onItemClick={(idx, list) => {
                          if (onOpenLightbox) {
                            onOpenLightbox(list[idx], list);
                          }
                        }}
                      />
                    </div>

                    {/* Подпись к фото/видео из Google Таблицы */}
                    {caption && (
                      <div className="p-4 bg-slate-900/60 border-t border-white/5 flex-1 flex items-center justify-between">
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                          {caption}
                        </p>
                        {item.type === 'video' ? (
                          <span className="shrink-0 ml-2 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                            Видео
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

