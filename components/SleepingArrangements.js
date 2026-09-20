// ==============================================================================
// СПАЛЬНЫЕ МЕСТА ВИЛЛЫ В СТИЛЕ AIRBNB (SLEEPING ARRANGEMENTS)
// Файл: components/SleepingArrangements.js
// Назначение: Наглядные карточки 4 спален с описанием кроватей
// ==============================================================================

import React from 'react';
import { Bed, BedDouble, Sofa } from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function SleepingArrangements({ customBedrooms = null }) {
  const { t, lang } = useLanguage();

  const defaultBedrooms = [
    {
      icon: BedDouble,
      title: t('bedroom1Title'),
      desc: t('bedroom1Desc'),
      badge: "King Bed",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600"
    },
    {
      icon: BedDouble,
      title: t('bedroom2Title'),
      desc: t('bedroom2Desc'),
      badge: "Queen Bed",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600"
    },
    {
      icon: Bed,
      title: t('bedroom3Title'),
      desc: t('bedroom3Desc'),
      badge: "2 Single Beds",
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600"
    },
    {
      icon: Sofa,
      title: t('bedroom4Title'),
      desc: t('bedroom4Desc'),
      badge: "Sofa Bed",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600"
    }
  ];

  const bedrooms = (customBedrooms && customBedrooms.length > 0) ? customBedrooms : defaultBedrooms;

  return (
    <div className="py-8 border-t border-white/10">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        {t('sleepingTitle')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bedrooms.map((b, idx) => {
          const IconComp = b.icon || BedDouble;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-800/60 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all group shadow-lg"
            >
              {b.image && (
                <div className="h-32 w-full overflow-hidden relative bg-slate-900">
                  <img
                    src={b.image}
                    alt={b.title || `Спальня ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-rose-300 border border-rose-500/20">
                    {b.badge || `Комната ${idx + 1}`}
                  </span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-rose-400">
                    <IconComp className="w-4 h-4" />
                    <h3 className="text-sm font-bold text-white line-clamp-1">{b.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{b.desc}</p>
                </div>

                {!b.image && (
                  <div className="mt-3 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">
                      {b.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

