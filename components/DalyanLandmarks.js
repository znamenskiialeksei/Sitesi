// ==============================================================================
// ГЕОГРАФИЧЕСКИЕ ОРИЕНТИРЫ ДАЛЬЯНА: DALYAN LANDMARKS
// Файл: components/DalyanLandmarks.js
// Назначение: Интерактивная витрина ориентиров, точных расстояний и карты Дальяна
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

export default function DalyanLandmarks({ homeData = null }) {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState('all');

  const officialAddress = 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey';
  const mapsUrl = 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9';
  const gpsCoordinates = '36.8336° N, 28.6439° E';

  const landmarks = [
    {
      id: 'center',
      category: 'walk',
      icon: Footprints,
      title: 'Пешеходный центр Дальяна',
      distance: '250 м',
      time: '3 мин пешком',
      desc: 'Главная улица с ресторанами, кофейнями, аптеками, банкоматами и сувенирными лавками.',
      badge: 'В шаговой доступности'
    },
    {
      id: 'promenade',
      category: 'walk',
      icon: Compass,
      title: 'Речная набережная и причал',
      distance: '400 м',
      time: '5 мин пешком',
      desc: 'Живописная набережная вдоль реки Дальян, причалы речных лодок-такси и экскурсионных катеров.',
      badge: 'Река Дальян'
    },
    {
      id: 'la_boheme',
      category: 'food',
      icon: Utensils,
      title: 'Ресторан La Boheme Dalyan Bistro',
      distance: '350 м',
      time: '4 мин пешком',
      desc: 'Популярное гастрономическое заведение с авторской средиземноморской и европейской кухней.',
      badge: 'Гастрономия'
    },
    {
      id: 'cicek',
      category: 'food',
      icon: Utensils,
      title: 'Ресторан Çiçek Restoran',
      distance: '500 м',
      time: '6 мин пешком',
      desc: 'Традиционный эгейский рыбный ресторан со свежими морепродуктами и мезе.',
      badge: 'Свежая рыба'
    },
    {
      id: 'market',
      category: 'walk',
      icon: ShoppingBag,
      title: 'Субботний фермерский рынок',
      distance: '600 м',
      time: '7 мин пешком',
      desc: 'Еженедельный базар: домашние оливки, деревенские сыры, гранатовый сок, фрукты и специи.',
      badge: 'Суббота'
    },
    {
      id: 'tombs',
      category: 'nature',
      icon: Mountain,
      title: 'Ликийские скальные гробницы',
      distance: '450 м',
      time: 'Прямая видимость',
      desc: 'Величественные гробницы карийских царей IV века до н.э., высеченные в отвесной скале. Вечерняя подсветка.',
      badge: 'UNESCO Heritage'
    },
    {
      id: 'kaunos',
      category: 'nature',
      icon: Compass,
      title: 'Античный город Каунос',
      distance: '1.5 км',
      time: 'Лодка + прогулка',
      desc: 'Древний город с амфитеатром, римскими банями, базиликой и панорамой с акрополя.',
      badge: 'Античность'
    },
    {
      id: 'iztuzu',
      category: 'nature',
      icon: Sun,
      title: 'Песчаный пляж Изтузу [Turtle Beach]',
      distance: '11 км',
      time: '15 мин авто / 35 мин катер',
      desc: 'Знаменитый природный заповедник и место размножения морских черепах Caretta-Caretta.',
      badge: 'Заповедный пляж'
    },
    {
      id: 'sultaniye',
      category: 'nature',
      icon: Waves,
      title: 'Термы и грязи Султание',
      distance: '4 км',
      time: 'По воде на катере',
      desc: 'Горячие радоновые минеральные источники и омолаживающие лечебные грязи на берегу озера.',
      badge: 'Spa & Wellness'
    },
    {
      id: 'koycegiz',
      category: 'nature',
      icon: Waves,
      title: 'Озеро Кёйджегиз [Köyceğiz]',
      distance: '5 км',
      time: 'Водный маршрут',
      desc: 'Одно из крупнейших прибрежных озер Турции с кристальной водой и горными пейзажами.',
      badge: 'Озерная гладь'
    },
    {
      id: 'radar',
      category: 'nature',
      icon: Eye,
      title: 'Смотровая площадка Радар',
      distance: '8 км',
      time: '20 мин на авто',
      desc: 'Панорамный обзор 360° на весь Дальян, изгибы дельты реки и песчаную косу Изтузу.',
      badge: 'Панорама 360°'
    },
    {
      id: 'dlm',
      category: 'transport',
      icon: Plane,
      title: 'Аэропорт Даламан [DLM]',
      distance: '30 км',
      time: '25-30 мин на авто',
      desc: 'Ближайший международный аэропорт с прямыми рейсами из Европы и регулярным сообщением.',
      badge: 'Авиасообщение'
    },
    {
      id: 'fethiye',
      category: 'transport',
      icon: Car,
      title: 'Фетхие и бухта Олюдениз',
      distance: '60 км',
      time: '55 мин на авто',
      desc: 'Знаменитая Голубая лагуна, Ликийская тропа и мировой центр параглайдинга.',
      badge: 'Маршрут на день'
    },
    {
      id: 'marmaris',
      category: 'transport',
      icon: Car,
      title: 'Город-курорт Мармарис',
      distance: '85 км',
      time: '1 ч 15 мин на авто',
      desc: 'Крупнейшая яхтенная марина Эгейского моря, набережная и старинный замок.',
      badge: 'Яхтенная столица'
    }
  ];

  const filteredLandmarks = filter === 'all'
    ? landmarks
    : landmarks.filter((l) => l.category === filter);

  return (
    <div className="py-8 border-t border-white/10">
      {/* Заголовок секции с плашкой адреса */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Navigation className="w-4 h-4" />
            <span>Геолокация и окрестности</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Географические ориентиры Дальяна
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
          <span>Открыть на карте Google</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* Фильтры категорий */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'Все ориентиры [14]' },
          { key: 'walk', label: 'Пешком и покупки [3]' },
          { key: 'food', label: 'Рестораны [2]' },
          { key: 'nature', label: 'Природа и история [6]' },
          { key: 'transport', label: 'Транспорт и города [3]' }
        ].map((btn) => (
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
            {btn.label}
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
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-white/5">
                    {item.badge}
                  </span>
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
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {item.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
