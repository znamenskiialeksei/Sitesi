// ==============================================================================
// МОДАЛЬНОЕ ОКНО ПОЛНОГО ОПИСАНИЯ ВИЛЛЫ: ABOUT VILLA MODAL
// Файл: components/Modals/AboutVillaModal.js
// Назначение: Интерактивная витрина из 7 детализированных плиток описания объекта:
// 1. Концепция, геолокация и географические ориентиры
// 2. Архитектура виллы и номерной фонд [240 м², 10 спальных мест]
// 3. Придомовая территория, бассейн 36 м² и уличное джакузи
// 4. Юридический регламент, Закон № 7464, KBS и безопасность
// 5. Профиль суперхозяина Алексея Знаменского
// 6. Морские экспедиции: Парусно-моторная яхта BAVARIA C45
// 7. Мобильный комфорт: Кемпер Adria Adora 673 PK и Тур «Всё»
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import React, { useState } from 'react';
import {
  X,
  Compass,
  Home,
  Waves,
  ShieldCheck,
  Award,
  Anchor,
  Car,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../utils/language';

const SECTION_CONFIGS = [
  {
    index: 0,
    icon: Compass,
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badgeKey: 'aboutSec1Badge',
    fallbackBadge: 'Геолокация • 14 ориентиров',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
  },
  {
    index: 1,
    icon: Home,
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    badgeKey: 'aboutSec2Badge',
    fallbackBadge: '240 м² • 4 спальни • 10 мест',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
  },
  {
    index: 2,
    icon: Waves,
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    badgeKey: 'aboutSec3Badge',
    fallbackBadge: 'Бассейн 36 м² • Джакузи спа',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
  },
  {
    index: 3,
    icon: ShieldCheck,
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    badgeKey: 'aboutSec4Badge',
    fallbackBadge: 'Закон № 7464 • KBS учет',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
  },
  {
    index: 4,
    icon: Award,
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    badgeKey: 'aboutSec5Badge',
    fallbackBadge: 'Суперхозяин • Рейтинг 4.98★',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
  },
  {
    index: 5,
    icon: Anchor,
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    badgeKey: 'aboutSec6Badge',
    fallbackBadge: 'Яхта BAVARIA C45 • 60 м²',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20'
  },
  {
    index: 6,
    icon: Car,
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    badgeKey: 'aboutSec7Badge',
    fallbackBadge: 'Adria Adora 673 PK • Тур «Всё»',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20'
  }
];

export default function AboutVillaModal({ isOpen = false, onClose = () => {}, sections = [] }) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Шапка модального окна */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {t('modalAboutVilla', 'Об этой вилле: Dalyan Turaman')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('modalAboutVillaSubtitle', 'Полный архитектурный, юридический и экспедиционный паспорт объекта')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Скроллируемая сетка из 7 детализированных плиток */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 gap-6">
            {sections.map((sec, idx) => {
              const cfg = SECTION_CONFIGS[idx] || SECTION_CONFIGS[0];
              const IconComp = cfg.icon;

              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-slate-800/60 border border-white/10 p-5 sm:p-6 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  {/* Верхняя строка плитки: Иконка, Заголовок и Бейдж */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl border shrink-0 ${cfg.iconBg}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        {sec.title}
                      </h4>
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 ${cfg.badgeBg}`}>
                      {t(cfg.badgeKey, cfg.fallbackBadge)}
                    </span>
                  </div>

                  {/* Тело описания с поддержкой списков и переносов */}
                  <div className="text-sm text-slate-300 leading-relaxed space-y-2">
                    {sec.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('* ') || paragraph.includes('\n* ')) {
                        const lines = paragraph.split('\n');
                        return (
                          <div key={pIdx} className="space-y-1.5 pt-1">
                            {lines.map((line, lIdx) => {
                              const cleanLine = line.replace(/^\*\s*/, '');
                              return (
                                <div key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                  <span>{cleanLine}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                      return (
                        <p key={pIdx} className="whitespace-pre-line text-xs sm:text-sm text-slate-300">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Нижняя панель действий */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('modalAboutVillaFooter', 'Официальный объект: Ortaca Vergi Dairesi, VKN: 9991120181')}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm transition-colors border border-white/10"
          >
            {t('modalClosePassportBtn', 'Закрыть паспорт объекта')}
          </button>
        </div>

      </div>
    </div>
  );
}
