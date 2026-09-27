// ==============================================================================
// СПАЛЬНЫЕ МЕСТА ВИЛЛЫ В СТИЛЕ AIRBNB: SLEEPING ARRANGEMENTS
// Файл: components/SleepingArrangements.js
// Назначение: Наглядные карточки спален с универсальной поддержкой медиа Google Drive,
// ликвидацией дублирования текста и интерактивным Вторым слоем [паспорт спальни].
//
// РЕВИЗИЯ 1 : 27.09.2026 11:45 - Ликвидация дублирования заголовка и бейджа,
// универсальная поддержка медиа Google Drive через прямой шлюз lh3,
// увеличение карточек и интерактивный модальный паспорт спальни.
// РЕВИЗИЯ 2 : 27.09.2026 11:45 - Второй слой с детальными удобствами комнат.
// ==============================================================================

import React, { useState } from 'react';
import { Bed, BedDouble, Sofa, Bath, Wind, Eye, X, CheckCircle2, Info } from 'lucide-react';
import { useLanguage } from '../utils/language';

const ICON_BED_MAP = {
  BedDouble,
  Bed,
  Sofa
};

// Универсальный конвертер ссылок медиа [Google Drive, Unsplash, CDN]
export function toDirectMediaUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i)
    || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i)
    || trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);

  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}

// Очистка дублирования заголовка спальни и бейджа
function cleanBedroomTitle(rawTitle, badge) {
  if (!rawTitle) return '';
  let clean = rawTitle;
  if (badge && clean.includes(badge)) {
    const escaped = badge.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    clean = clean.replace(new RegExp(`[•\\-—|]?\\s*${escaped}.*$`, 'i'), '').trim();
  }
  clean = clean.replace(/[•\\-—|]\s*$/, '').trim();
  return clean || rawTitle;
}

export default function SleepingArrangements({ homeData = null, customBedrooms = null }) {
  const { t, lang } = useLanguage();
  const [selectedBedroom, setSelectedBedroom] = useState(null);

  const title = homeData?.sleepingTitle || t('sleepingTitle') || 'Где вы будете спать • 10 спальных мест в 4 спальнях';

  const defaultBedrooms = [
    {
      id: 1,
      icon: BedDouble,
      title: 'Спальня 1 [1 этаж]',
      desc: 'Первый этаж: 1 двуспальная кровать Queen + 1 односпальная кровать, персональная ванная с душевой кабиной, кондиционер',
      badge: 'Queen + Single [3 места]',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000',
      amenities: [
        '1 двуспальная кровать Queen Size [160x200 см]',
        '1 односпальная кровать Single [90x200 см]',
        'Персональная ванная комната с душевой кабиной',
        'Автономный кондиционер',
        'Шкаф для одежды и постельное белье премиум'
      ]
    },
    {
      id: 2,
      icon: BedDouble,
      title: 'Спальня 2 [2 этаж • Master Suite]',
      desc: 'Второй этаж: King size: Большая королевская кровать шириной 180–200 см и длиной 200 см + 1 односпальная кровать, собственная ванная комната, кондиционер, балкон с видом на горы',
      badge: 'King size + Single [3 места]',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000',
      amenities: [
        '1 большая королевская кровать King Size [180–200x200 см]',
        '1 односпальная кровать Single [90x200 см]',
        'Собственная ванная комната с ванной и душем',
        'Автономный кондиционер',
        'Выход на балкон с панорамным видом на горы и бассейн'
      ]
    },
    {
      id: 3,
      icon: BedDouble,
      title: 'Спальня 3 [2 этаж]',
      desc: 'Второй этаж: 1 двуспальная кровать Queen Size, собственная ванная комната, кондиционер, гардероб',
      badge: 'Queen Bed [2 места]',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1000',
      amenities: [
        '1 двуспальная кровать Queen Size [160x200 см]',
        'Собственная ванная комната с душевой кабиной',
        'Автономный кондиционер',
        'Гардеробная зона и вид на цветущий сад'
      ]
    },
    {
      id: 4,
      icon: BedDouble,
      title: 'Спальня 4 [2 этаж]',
      desc: 'Второй этаж: 1 двуспальная кровать Queen + 1 дополнительная односпальная кровать, собственная ванная комната, кондиционер',
      badge: 'Queen + Single [3 места]',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000',
      amenities: [
        '1 двуспальная кровать Queen Size [160x200 см]',
        '1 дополнительная кровать Single [90x200 см]',
        'Собственная ванная комната с душем',
        'Автономный кондиционер',
        'Окно с видом на оливковый сад'
      ]
    }
  ];

  const sourceBedrooms = customBedrooms || homeData?.bedrooms || defaultBedrooms;
  const bedrooms = (sourceBedrooms && sourceBedrooms.length > 0) ? sourceBedrooms : defaultBedrooms;

  return (
    <div className="py-10 border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            4 изолированные спальни с собственными санузлами и кондиционерами
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {bedrooms.map((b, idx) => {
          const IconComp = typeof b.iconName === 'string'
            ? (ICON_BED_MAP[b.iconName] || BedDouble)
            : (b.icon || BedDouble);

          const rawTitle = typeof b.title === 'object' ? (b.title[lang] || b.title.ru || '') : (b.title || `Спальня ${idx + 1}`);
          const itemDesc = typeof b.desc === 'object' ? (b.desc[lang] || b.desc.ru || '') : (b.desc || '');
          const itemBadge = typeof b.badge === 'object' ? (b.badge[lang] || b.badge.ru || '') : (b.badge || `Спальня ${idx + 1}`);
          const itemTitle = cleanBedroomTitle(rawTitle, itemBadge);

          const rawImageUrl = b.image || defaultBedrooms[idx % defaultBedrooms.length]?.image || '';
          const directImageUrl = toDirectMediaUrl(rawImageUrl);

          return (
            <div
              key={idx}
              onClick={() => setSelectedBedroom({
                ...b,
                title: itemTitle,
                desc: itemDesc,
                badge: itemBadge,
                image: directImageUrl,
                amenities: b.amenities || defaultBedrooms[idx % defaultBedrooms.length]?.amenities
              })}
              className="group cursor-pointer rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-950/20 transition-all duration-300"
            >
              <div className="h-48 sm:h-52 w-full overflow-hidden relative bg-slate-950">
                {directImageUrl ? (
                  <img
                    src={directImageUrl}
                    alt={itemTitle}
                    onError={(e) => {
                      if (!e.target.dataset.triedFallback) {
                        e.target.dataset.triedFallback = 'true';
                        e.target.src = defaultBedrooms[idx % defaultBedrooms.length]?.image || '';
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                    <IconComp className="w-12 h-12 stroke-[1.5]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
                <span className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-rose-300 border border-rose-500/30 shadow-md">
                  {itemBadge}
                </span>
                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
                  <IconComp className="w-3.5 h-3.5 text-rose-400" />
                  {itemTitle}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {itemDesc}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-rose-400 group-hover:text-rose-300 transition-colors font-medium">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Подробнее о спальне
                  </span>
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-400">
                    Второй слой →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ВТОРОЙ СЛОЙ: Интерактивный модальный паспорт спальни */}
      {selectedBedroom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedBedroom(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-72 w-full bg-slate-950">
              {selectedBedroom.image ? (
                <img
                  src={selectedBedroom.image}
                  alt={selectedBedroom.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                  <BedDouble className="w-16 h-16 stroke-[1.5]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

              <button
                onClick={() => setSelectedBedroom(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors border border-white/20"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <span className="inline-block bg-rose-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 shadow-lg">
                    {selectedBedroom.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                    {selectedBedroom.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-2">
                  Описание комнаты
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedBedroom.desc}
                </p>
              </div>

              {selectedBedroom.amenities && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-3">
                    Удобства и комплектация спальни
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedBedroom.amenities.map((amenity, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-rose-400" /> Собственный санузел
                </span>
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-cyan-400" /> Кондиционер
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-400" /> Вид на горы и сад
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
