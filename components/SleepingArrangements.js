// ==============================================================================
// СПАЛЬНЫЕ МЕСТА ВИЛЛЫ В СТИЛЕ AIRBNB (SLEEPING ARRANGEMENTS)
// Файл: components/SleepingArrangements.js
// Назначение: Наглядные карточки 4 спален с описанием кроватей
// ==============================================================================

import React from 'react';
import { Bed, BedDouble, Sofa } from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function SleepingArrangements() {
  const { t } = useLanguage();

  const bedrooms = [
    {
      icon: BedDouble,
      title: t('bedroom1Title'),
      desc: t('bedroom1Desc'),
      badge: "King Bed"
    },
    {
      icon: BedDouble,
      title: t('bedroom2Title'),
      desc: t('bedroom2Desc'),
      badge: "Queen Bed"
    },
    {
      icon: Bed,
      title: t('bedroom3Title'),
      desc: t('bedroom3Desc'),
      badge: "2 Single Beds"
    },
    {
      icon: Sofa,
      title: t('bedroom4Title'),
      desc: t('bedroom4Desc'),
      badge: "Sofa Bed"
    }
  ];

  return (
    <div className="py-8 border-t border-white/10">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        {t('sleepingTitle')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bedrooms.map((b, idx) => {
          const IconComp = b.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/60 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-rose-400">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{b.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">
                  {b.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

