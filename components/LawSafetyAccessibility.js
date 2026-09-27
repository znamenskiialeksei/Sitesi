// [ПРЕДЫДУЩАЯ РЕДАКЦИЯ: 26.09.2026 15:45 | ПЛАН: СТУПЕНЬ_01_Базовый_эталон_старта | TAG: VILLA-LEGAL-BASE-260920261545]
// [АКТУАЛЬНАЯ РЕДАКЦИЯ: 27.09.2026 18:50 | ПЛАН: 270920261820 Комплексный план 7 задач.md | TAG: VILLA-DYNAMIC-LEGAL-ITEMS-270920261850]
// ==============================================================================
// БЕЗОПАСНОСТЬ, ЗАКОН № 7464 И ДОСТУПНАЯ СРЕДА: LAW, SAFETY & ACCESSIBILITY
// Файл: components/LawSafetyAccessibility.js
// Назначение: Юридические требования Турции, система KBS, безопасность и доступная среда
// 100% SSOT: Все тексты и регламенты загружаются из Google Таблицы
// ==============================================================================

import React from 'react';
import {
  ShieldCheck,
  FileText,
  Eye,
  Flame,
  Accessibility,
  CheckCircle2,
  AlertCircle,
  Clock,
  DoorOpen
} from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function LawSafetyAccessibility({ homeData = null }) {
  const { lang, t } = useLanguage();

  const safety = homeData?.safetyData || {};

  const getLoc = (val, fallback = '') => {
    if (!val) return fallback;
    if (typeof val === 'object') {
      return val[lang] || val.ru || fallback;
    }
    return String(val);
  };

  const title = getLoc(safety.title, 'Безопасность, Закон № 7464 и Доступная среда');
  const subtitle = getLoc(safety.subtitle, 'Полное соответствие законодательству Турции о краткосрочной аренде, защита гостей и безбарьерный доступ');

  // Блок 1: Закон 7464
  const law7464Title = getLoc(safety.law7464Title, 'Официальный договор и учет KBS');
  const law7464Desc = getLoc(safety.law7464Desc, 'Вилла осуществляет деятельность в строгом соответствии с Законом № 7464 о краткосрочной туристической аренде в Турции.');
  const law7464Badge = getLoc(safety.law7464Badge, 'Закон Турции № 7464');

  // Блок 2: Безопасность
  const securityTitle = getLoc(safety.securityTitle, 'Безопасность дома и территории');
  const securityDesc = getLoc(safety.securityDesc, 'Оснащение дома сертифицированными системами предупреждения и постоянного мониторинга.');
  const securityBadge = getLoc(safety.securityBadge, 'Стандарты безопасности');

  // Блок 3: Доступная среда
  const accessibleTitle = getLoc(safety.accessibleTitle, 'Инклюзивность и доступная среда');
  const accessibleDesc = getLoc(safety.accessibleDesc, 'Создание безбарьерных условий для комфортного отдыха всех категорий гостей.');
  const accessibleBadge = getLoc(safety.accessibleBadge, 'Безбарьерная среда');

  // Блок 4: Отмена
  const cancellationTitle = getLoc(safety.cancellationTitle, 'Политика отмены и возврата');
  const cancellationDesc = getLoc(safety.cancellationDesc, 'Прозрачные финансовые условия бронирования без скрытых комиссий.');
  const cancellationBadge = getLoc(safety.cancellationBadge, 'Возврат 100%');

  // Разрешение динамических списков с гарантированным сохранением фоллбэков
  const resolveList = (itemsArray, fallbackItems) => {
    if (Array.isArray(itemsArray) && itemsArray.length > 0) {
      return itemsArray.map((it) => getLoc(it, typeof it === 'string' ? it : ''));
    }
    return fallbackItems.map((it) => getLoc(it, '')).filter(Boolean);
  };

  const law7464List = resolveList(safety.law7464Items, [safety.law7464Item1, safety.law7464Item2, safety.law7464Item3]);
  const securityList = resolveList(safety.securityItems, [safety.securityItem1, safety.securityItem2, safety.securityItem3]);
  const accessibleList = resolveList(safety.accessibleItems, [safety.accessibleItem1, safety.accessibleItem2, safety.accessibleItem3]);
  const cancellationList = resolveList(safety.cancellationItems, [safety.cancellationItem1, safety.cancellationItem2, safety.cancellationItem3]);

  return (
    <div className="py-8 border-t border-white/10">
      {/* Заголовок секции */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('legalRegulationHeader') || 'Юридический регламент и комфорт'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>

      {/* Сетка 4 блоков */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Блок 1: Закон № 7464 и система KBS */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                {law7464Badge}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {law7464Title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {law7464Desc}
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              {law7464List.map((text, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {idx === law7464List.length - 1 ? (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Блок 2: Комплексная безопасность виллы */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {securityBadge}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {securityTitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {securityDesc}
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              {securityList.map((text, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {idx === 0 ? (
                    <Eye className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : idx === 1 ? (
                    <Flame className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Блок 3: Доступная среда и безбарьерный отдых */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <Accessibility className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {accessibleBadge}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {accessibleTitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {accessibleDesc}
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              {accessibleList.map((text, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {idx === 0 ? (
                    <DoorOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : idx === 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <Accessibility className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Блок 4: Правила отмены и возврата */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                {cancellationBadge}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {cancellationTitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {cancellationDesc}
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              {cancellationList.map((text, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {idx === 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : idx === 1 ? (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : idx === 2 ? (
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
