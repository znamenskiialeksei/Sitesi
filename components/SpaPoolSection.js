// ==============================================================================
// СПА-КОМПЛЕКС И БАССЕЙН С СОЛЕНОЙ ВОДОЙ: SPA & POOL SECTION
// Файл: components/SpaPoolSection.js
// Назначение: Интерактивный блок технических параметров бассейна, джакузи и сада
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
  Users,
  Droplets,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function SpaPoolSection({ homeData = null }) {
  const { t } = useLanguage();

  return (
    <div className="py-8 border-t border-white/10">
      {/* Шапка блока */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Waves className="w-4 h-4" />
          <span>Приватный аква-комплекс и лаунж</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Спа-комплекс и бассейн с соленой водой
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Приватная закрытая территория, солевой бассейн 36 м², гидромассажное джакузи и лаунж-зона отдыха
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
                Соленая вода без хлора
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              Приватный бассейн с соленой водой
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Чаша 4 × 9 метров [площадь 36 кв. м], постоянная комфортная глубина 150 см. Мягкая природная минерализация исключает раздражение кожи и запах хлора.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Сезон работы: с 1 мая по 1 ноября</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Подводная ночная подсветка: 20:00 - 01:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>График чистки: в день 1 заселения и каждые 7 дней</span>
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
                Вместимость: 4 персоны
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              Открытое уличное джакузи
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Гидромассажная спа-ванна в зоне бассейна с подогревом и регулируемыми форсунками для глубокого расслабления на свежем воздухе.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Режим работы: 10:00 - 17:00 [15 мин каждые 45 мин]</span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Подсветка джакузи: 20:00 - 01:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Период активности: с 1 мая по 1 ноября</span>
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
            <h4 className="text-xs font-bold text-white mb-1">Освещение территории</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Автоматическое включение сада: 20:00 - 01:00 и 04:00 - 06:00
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">Приватная парковка</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Закрытая бесплатная парковка на территории виллы на 2 автомобиля
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">BBQ и обеденная зона</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Обеденный стол на 8 мест, гриль на углях, шезлонги и уличный душ
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
