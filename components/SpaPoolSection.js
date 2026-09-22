// ==============================================================================
// СПА-КОМПЛЕКС И БАССЕЙН С СОЛЕНОЙ ВОДОЙ: SPA & POOL SECTION
// Файл: components/SpaPoolSection.js
// Назначение: Интерактивный блок технических параметров бассейна, джакузи и сада
// 100% SSOT: Все параметры и тексты загружаются из Google Таблицы
// ==============================================================================

import React from 'react';
import {
  Waves,
  Sparkles,
  Sun,
  Moon,
  Clock,
  Shield,
  Car,
  Flame,
  Droplets,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function SpaPoolSection({ homeData = null }) {
  const { lang, t } = useLanguage();

  const spa = homeData?.spaData || {};

  const getLoc = (val, fallback = '') => {
    if (!val) return fallback;
    if (typeof val === 'object') {
      return val[lang] || val.ru || fallback;
    }
    return String(val);
  };

  const title = getLoc(spa.title, 'Спа-комплекс и бассейн с соленой водой');
  const subtitle = getLoc(spa.subtitle, 'Приватная закрытая территория, солевой бассейн 36 м², гидромассажное джакузи и лаунж-зона отдыха');

  const poolTitle = getLoc(spa.poolTitle, 'Приватный бассейн с соленой водой');
  const poolDesc = getLoc(spa.poolDesc, 'Чаша 4 × 9 метров [площадь 36 кв. м], постоянная комфортная глубина 150 см по всей площади чаши. Мягкая природная минерализация исключает раздражение кожи и запах хлора.');
  const poolBadge = getLoc(spa.poolBadge, 'Соленая вода без хлора');
  const poolSeason = getLoc(spa.poolSeason, 'Сезон работы: с 1 мая по 1 ноября');
  const poolLighting = getLoc(spa.poolLighting, 'Подводная ночная подсветка: 20:00 - 01:00');
  const poolMaintenance = getLoc(spa.poolMaintenance, 'График чистки: в день заселения и далее каждые 7 дней');

  const jacuzziTitle = getLoc(spa.jacuzziTitle, 'Открытое уличное джакузи');
  const jacuzziDesc = getLoc(spa.jacuzziDesc, 'Гидромассажная спа-ванна в зоне бассейна с подогревом и регулируемыми форсунками для глубокого расслабления на свежем воздухе.');
  const jacuzziBadge = getLoc(spa.jacuzziBadge, 'Вместимость: 4 персоны');
  const jacuzziSchedule = getLoc(spa.jacuzziSchedule, 'Режим работы: 10:00 - 17:00 [15 мин каждые 45 мин]');
  const jacuzziLighting = getLoc(spa.jacuzziLighting, 'Подсветка джакузи: 20:00 - 01:00');
  const jacuzziSeason = getLoc(spa.jacuzziSeason, 'Период активности: с 1 мая по 1 ноября');

  const streetLightingTitle = getLoc(spa.streetLightingTitle, 'Освещение территории');
  const streetLightingDesc = getLoc(spa.streetLightingDesc, 'Автоматическое включение сада: 20:00 - 01:00 и 04:00 - 06:00');

  const parkingTitle = getLoc(spa.parkingTitle, 'Приватная парковка');
  const parkingDesc = getLoc(spa.parkingDesc, 'Закрытая бесплатная парковка на территории виллы на 2 автомобиля');

  const bbqTitle = getLoc(spa.bbqTitle, 'BBQ и обеденная зона');
  const bbqDesc = getLoc(spa.bbqDesc, 'Обеденный стол на 8 мест, гриль на углях, шезлонги и уличный душ');

  return (
    <div className="py-8 border-t border-white/10">
      {/* Шапка блока */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Waves className="w-4 h-4" />
          <span>{t('aquaComplexHeader') || 'Приватный аква-комплекс и лаунж'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>

      {/* Основные карточки комплекса */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
        {/* Карточка 1: Бассейн с соленой водой */}
        <div className="rounded-3xl bg-slate-800/60 border border-white/10 p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <Waves className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {poolBadge}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              {poolTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {poolDesc}
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{poolSeason}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{poolLighting}</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{poolMaintenance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Карточка 2: Открытое гидромассажное джакузи */}
        <div className="rounded-3xl bg-slate-800/60 border border-white/10 p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                {jacuzziBadge}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              {jacuzziTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {jacuzziDesc}
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{jacuzziSchedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{jacuzziLighting}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{jacuzziSeason}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Нижняя полоса параметров: Освещение территории, парковка и лаунж */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">{streetLightingTitle}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {streetLightingDesc}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">{parkingTitle}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {parkingDesc}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">{bbqTitle}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {bbqDesc}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
