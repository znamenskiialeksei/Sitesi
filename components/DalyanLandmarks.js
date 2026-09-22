// ==============================================================================
// ГЕОГРАФИЧЕСКИЕ ОРИЕНТИРЫ ДАЛЬЯНА: DALYAN LANDMARKS
// Файл: components/DalyanLandmarks.js
// Назначение: Интерактивная витрина 14 ориентиров Дальяна из Google Sheets
// 100% SSOT: Все тексты, расстояния и тайминги загружаются из таблицы
// ==============================================================================

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Utensils,
  Mountain,
  Waves,
  Sun,
  Plane,
  Car,
  ShoppingBag,
  Eye,
  ExternalLink,
  Clock,
  Footprints
} from 'lucide-react';
import { useLanguage } from '../utils/language';

const ICON_MAP = {
  Footprints,
  Compass,
  Utensils,
  ShoppingBag,
  Mountain,
  Waves,
  Sun,
  Eye,
  Plane,
  Car,
  MapPin
};

export default function DalyanLandmarks({ homeData = null }) {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState('all');

  const officialAddress =
    homeData?.landmarksAddress ||
    homeData?.address ||
    'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey';

  const mapsUrl =
    homeData?.landmarksMapsUrl ||
    homeData?.mapsUrl ||
    'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9';

  const gpsCoordinates =
    homeData?.landmarksGps ||
    '36.8336° N, 28.6439° E';

  const sectionTitle =
    homeData?.landmarksTitle ||
    t('landmarksSectionTitle') ||
    '14 географических ориентиров Дальяна';

  const sectionSubtitle =
    homeData?.landmarksSubtitle ||
    t('landmarksSectionSubtitle') ||
    'Точные расстояния и тайминг от виллы • Пешеходная доступность центра и заповедная природа';

  const rawLandmarks = (homeData?.landmarksList && homeData.landmarksList.length > 0)
    ? homeData.landmarksList
    : [];

  const landmarks = rawLandmarks.map((item, idx) => {
    const IconComp = ICON_MAP[item.icon] || MapPin;
    const title = typeof item.title === 'object' ? (item.title[lang] || item.title.ru || '') : item.title;
    const desc = typeof item.desc === 'object' ? (item.desc[lang] || item.desc.ru || '') : item.desc;
    const badge = typeof item.badge === 'object' ? (item.badge[lang] || item.badge.ru || '') : item.badge;

    return {
      id: item.id || `landmark_${idx + 1}`,
      category: item.category || 'nature',
      icon: IconComp,
      title,
      distance: item.distance || '',
      time: item.time || '',
      desc,
      badge
    };
  });

  const filteredLandmarks = filter === 'all'
    ? landmarks
    : landmarks.filter((l) => l.category === filter);

  const filterButtons = [
    { key: 'all', label: { ru: 'Все ориентиры [14]', en: 'All landmarks [14]', tr: 'Tüm noktalar [14]' } },
    { key: 'walk', label: { ru: 'Пешком и покупки [3]', en: 'Walking & shopping [3]', tr: 'Yürüyüş ve alışveriş [3]' } },
    { key: 'food', label: { ru: 'Рестораны [2]', en: 'Restaurants [2]', tr: 'Restoranlar [2]' } },
    { key: 'nature', label: { ru: 'Природа и история [6]', en: 'Nature & history [6]', tr: 'Doğa ve tarih [6]' } },
    { key: 'transport', label: { ru: 'Транспорт и города [3]', en: 'Transport & cities [3]', tr: 'Ulaşım ve şehirler [3]' } }
  ];

  return (
    <div className="py-8 border-t border-white/10">
      {/* Заголовок секции с плашкой адреса */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Navigation className="w-4 h-4" />
            <span>{t('geolocationHeader') || 'Геолокация и окрестности'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {officialAddress} • GPS: {gpsCoordinates}
          </p>
        </div>

        {/* Кнопка перехода в Google Maps */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-600/20 shrink-0 self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4" />
          <span>{t('openOnGoogleMaps') || 'Открыть на карте Google'}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* Фильтры категорий */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => setFilter(btn.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === btn.key
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-white/5'
            }`}
          >
            {btn.label[lang] || btn.label.ru}
          </button>
        ))}
      </div>

      {/* Сетка карточек ориентиров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLandmarks.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-rose-500/40 hover:bg-slate-800/90 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/10 text-rose-400 group-hover:text-rose-300 group-hover:border-rose-500/30 transition-colors shrink-0">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-white/5">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-sm leading-snug group-hover:text-rose-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="font-extrabold text-rose-400">
                  {item.distance}
                </span>
                {item.time && (
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
