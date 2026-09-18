// ==============================================================================
// ЗАГОЛОВОК И БЕЙДЖИ ОБЪЕКТА В СТИЛЕ AIRBNB (HERO)
// Файл: components/Hero.js
// Назначение: Название виллы, подзаголовок, рейтинг 4.98, бейдж Superhost,
// локация и интерактивные кнопки (поделиться, добавить в избранное) без блокирующих модалок.
// ==============================================================================

import React from 'react';
import { Star, MapPin, Award, Share2, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../utils/language';
import { useToast } from './Toast';

export default function Hero({ homeData }) {
  const { t } = useLanguage();
  const toast = useToast();

  const title = homeData?.title || t('heroTitle') || 'Villa Turaman Luxury Waterfront';
  const subtitle = homeData?.subtitle || t('heroSubtitle') || '';
  const location = t('locationText') || 'Дальян, Ортаджа, Мугла, Турция';

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => { });
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('linkCopiedToast') || 'Ссылка на виллу скопирована в буфер обмена!');
    }
  };

  const handleFavorite = (e) => {
    e.currentTarget.classList.toggle('text-rose-500');
    toast.info(t('addedToFavoritesToast') || 'Вилла добавлена в список сохраненных объектов');
  };

  return (
    <div className="pt-6 pb-4">
      {/* Главный заголовок листинга */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
        {title}
      </h1>

      {/* Подзаголовок виллы из Google Sheets (таблица HomePage) */}
      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-300 mb-3 max-w-4xl leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Мета-информация в стиле AirBnB */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">

          {/* Рейтинг */}
          <div className="flex items-center gap-1 font-bold text-white">
            <Star className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>4.98</span>
            <span className="text-slate-400 font-normal">({t('reviewsCountText') || '48 отзывов'})</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          {/* Бейдж Суперхозяин */}
          <div className="flex items-center gap-1 text-amber-300 font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t('superhostBadge') || 'Суперхозяин'}</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          {/* Локация */}
          <div className="flex items-center gap-1 text-slate-300 hover:text-white underline cursor-pointer transition-colors">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{location}</span>
          </div>
        </div>

        {/* Кнопки "Поделиться" и "Сохранить" */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('shareBtn') || 'Поделиться'}</span>
          </button>

          <button
            type="button"
            onClick={handleFavorite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">{t('saveFavoriteBtn') || 'В избранное'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
