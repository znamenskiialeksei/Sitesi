// ==============================================================================
// ЗАГОЛОВОК И БЕЙДЖИ ОБЪЕКТА В СТИЛЕ AIRBNB: HERO
// Файл: components/Hero.js
// Назначение: Название виллы, подзаголовок, рейтинг, бейдж Superhost,
// локация и интерактивные кнопки поделиться и в избранное.
// ==============================================================================

import React from 'react';
import { Star, MapPin, Award, Share2, Heart } from 'lucide-react';
import { useLanguage } from '../utils/language';
import { useToast } from './Toast';

export default function Hero({ homeData }) {
  const { t } = useLanguage();
  const toast = useToast();

  const title = homeData?.title || 'Dalyan Turaman [частный бассейн, 10 спальных мест]';
  const subtitle = homeData?.subtitle || '';
  const rating = homeData?.rating || '4.98';
  const reviewsCount = homeData?.reviewsCount || '48 отзывов';
  const superhostBadge = homeData?.superhostBadge || 'Суперхозяин';
  const location = homeData?.location || 'Дальян, Ортаджа, Мугла, Турция';
  const shareBtnText = homeData?.shareBtn || 'Поделиться';
  const favoriteBtnText = homeData?.favoriteBtn || 'В избранное';

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

      {/* Подзаголовок виллы из Google Sheets */}
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
            <span>{rating}</span>
            <span className="text-slate-400 font-normal">[{reviewsCount}]</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          {/* Бейдж Суперхозяин */}
          <div className="flex items-center gap-1 text-amber-300 font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{superhostBadge}</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          {/* Локация */}
          <div className="flex items-center gap-1 text-slate-300 hover:text-white underline cursor-pointer transition-colors">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{location}</span>
          </div>
        </div>

        {/* Кнопки Поделиться и В избранное */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{shareBtnText}</span>
          </button>

          <button
            type="button"
            onClick={handleFavorite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">{favoriteBtnText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
