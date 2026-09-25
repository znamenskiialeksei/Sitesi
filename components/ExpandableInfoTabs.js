// ==============================================================================
// РАСКРЫВАЮЩИЕСЯ РАЗДЕЛЫ И ВКЛАДКИ САЙТА (EXPANDABLE INFO TABS)
// Файл: components/ExpandableInfoTabs.js
// Назначение: Компактный аккордеон/вкладки перед карточкой хозяина на главной странице:
// Вкладка 1: Безопасность, Закон № 7464 и Доступная среда
// Вкладка 2: 14 географических ориентиров Дальяна
// Вкладка 3: 4.98 • Рейтинг гостей на основе 48 отзывов
// ==============================================================================

import React, { useState } from 'react';
import { ShieldCheck, MapPin, Star, ChevronDown, ChevronUp } from 'lucide-react';
import LawSafetyAccessibility from './LawSafetyAccessibility';
import DalyanLandmarks from './DalyanLandmarks';
import ReviewsSection from './ReviewsSection';

export default function ExpandableInfoTabs({ homeData = null }) {
  const [activeTab, setActiveTab] = useState('law'); // 'law' | 'landmarks' | 'reviews' | null
  const [isOpen, setIsOpen] = useState(true);

  const toggleTab = (tabKey) => {
    if (activeTab === tabKey && isOpen) {
      setIsOpen(false);
    } else {
      setActiveTab(tabKey);
      setIsOpen(true);
    }
  };

  const tabs = [
    {
      id: 'law',
      label: 'Безопасность, Закон № 7464 и Доступная среда',
      icon: ShieldCheck,
      badge: 'Сертифицировано'
    },
    {
      id: 'landmarks',
      label: '14 географических ориентиров Дальяна',
      icon: MapPin,
      badge: 'Карта и расстояния'
    },
    {
      id: 'reviews',
      label: '4.98 • Рейтинг гостей на основе 48 отзывов',
      icon: Star,
      badge: 'Суперхозяин'
    }
  ];

  return (
    <section className="space-y-4 pt-6 pb-2" id="info-tabs-section">
      {/* Навигационная панель переключения вкладок */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-2.5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id && isOpen;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => toggleTab(tab.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition-all text-left ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25 ring-1 ring-white/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-700/60 text-rose-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate leading-tight">{tab.label}</p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>{tab.badge}</p>
                  </div>
                </div>
                <div className="shrink-0 pl-1">
                  {isSelected ? (
                    <ChevronUp className="w-4 h-4 opacity-90" />
                  ) : (
                    <ChevronDown className="w-4 h-4 opacity-60" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Контейнер активной вкладки */}
      {isOpen && (
        <div className="rounded-3xl transition-all duration-300">
          {activeTab === 'law' && (
            <div className="animate-fadeIn">
              <LawSafetyAccessibility homeData={homeData} />
            </div>
          )}

          {activeTab === 'landmarks' && (
            <div className="animate-fadeIn">
              <DalyanLandmarks homeData={homeData} />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fadeIn">
              <ReviewsSection homeData={homeData} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
