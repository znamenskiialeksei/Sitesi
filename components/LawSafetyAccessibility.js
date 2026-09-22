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
  const law7464Item1 = getLoc(safety.law7464Item1, 'Обязательный договор краткосрочного найма с описью имущества при заезде');
  const law7464Item2 = getLoc(safety.law7464Item2, 'Регистрация паспортов всех проживающих гостей в полицейской системе KBS [Kimlik Bildirme Sistemi]');
  const law7464Item3 = getLoc(safety.law7464Item3, 'Размещение лиц, не внесенных в государственную систему KBS, строго запрещено');

  // Блок 2: Безопасность
  const securityTitle = getLoc(safety.securityTitle, 'Безопасность дома и территории');
  const securityDesc = getLoc(safety.securityDesc, 'Оснащение дома сертифицированными системами предупреждения и постоянного мониторинга.');
  const securityBadge = getLoc(safety.securityBadge, 'Стандарты безопасности');
  const securityItem1 = getLoc(safety.securityItem1, 'Наружные камеры видеонаблюдения установлены строго по периметру забора и у калитки [без съемки бассейна]');
  const securityItem2 = getLoc(safety.securityItem2, 'Сертифицированные автономные датчики дыма и угарного газа на обоих этажах виллы');
  const securityItem3 = getLoc(safety.securityItem3, 'Огнетушители на 1 и 2 этажах, аптечка первой медицинской помощи');

  // Блок 3: Доступная среда
  const accessibleTitle = getLoc(safety.accessibleTitle, 'Инклюзивность и доступная среда');
  const accessibleDesc = getLoc(safety.accessibleDesc, 'Создание безбарьерных условий для комфортного отдыха всех категорий гостей.');
  const accessibleBadge = getLoc(safety.accessibleBadge, 'Безбарьерная среда');
  const accessibleItem1 = getLoc(safety.accessibleItem1, 'Безбарьерный доступ: спальня №1 на 1 этаже оборудована широкими дверными проемами без порогов');
  const accessibleItem2 = getLoc(safety.accessibleItem2, 'Санузел первого этажа спроектирован с возможностью комфортного использования гостями с ограниченной мобильностью');
  const accessibleItem3 = getLoc(safety.accessibleItem3, 'Возможность установки мобильного подъемника для спуска в бассейн по предварительному запросу');

  // Блок 4: Отмена
  const cancellationTitle = getLoc(safety.cancellationTitle, 'Политика отмены и возврата');
  const cancellationDesc = getLoc(safety.cancellationDesc, 'Прозрачные финансовые условия бронирования без скрытых комиссий.');
  const cancellationBadge = getLoc(safety.cancellationBadge, 'Возврат 100%');
  const cancellationItem1 = getLoc(safety.cancellationItem1, 'Полный 100% возврат предоплаты при отмене более чем за 14 суток до даты заезда');
  const cancellationItem2 = getLoc(safety.cancellationItem2, 'При отмене менее чем за 14 суток удерживается стоимость первых суток');
  const cancellationItem3 = getLoc(safety.cancellationItem3, 'Официальное оформление e-Arşiv Fatura на имя гостя согласно VUK 213 Madde 230');

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
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{law7464Item1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{law7464Item2}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{law7464Item3}</span>
              </li>
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
              <li className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{securityItem1}</span>
              </li>
              <li className="flex items-start gap-2">
                <Flame className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{securityItem2}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{securityItem3}</span>
              </li>
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
              <li className="flex items-start gap-2">
                <DoorOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{accessibleItem1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{accessibleItem2}</span>
              </li>
              <li className="flex items-start gap-2">
                <Accessibility className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{accessibleItem3}</span>
              </li>
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
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{cancellationItem1}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{cancellationItem2}</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{cancellationItem3}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
