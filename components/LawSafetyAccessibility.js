// ==============================================================================
// БЕЗОПАСНОСТЬ, ЗАКОН № 7464 И ДОСТУПНАЯ СРЕДА: LAW, SAFETY & ACCESSIBILITY
// Файл: components/LawSafetyAccessibility.js
// Назначение: Юридические требования Турции, система KBS, безопасность и доступная среда
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
  DoorOpen,
  Car
} from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function LawSafetyAccessibility({ homeData = null }) {
  const { t } = useLanguage();

  return (
    <div className="py-8 border-t border-white/10">
      {/* Заголовок секции */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Юридический регламент и комфорт</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Безопасность, Закон № 7464 и Доступная среда
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Полное соответствие законодательству Турции о краткосрочной аренде, защита гостей и безбарьерный доступ
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
                Закон Турции № 7464
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Официальный договор и учет KBS
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Вилла осуществляет деятельность в строгом соответствии с Законом № 7464 о краткосрочной туристической аренде в Турции.
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Обязательный договор краткосрочного найма с описью имущества при заезде</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Регистрация паспортов всех проживающих гостей в полицейской системе KBS [Kimlik Bildirme Sistemi]</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Размещение лиц, не внесенных в государственную систему KBS, строго запрещено</span>
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
                Стандарты безопасности
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Безопасность дома и территории
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Оснащение дома сертифицированными системами предупреждения и постоянного мониторинга.
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Наружные камеры видеонаблюдения по внешнему периметру [без съемки внутри дома]</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Оптические датчики дыма во всех 4 спальнях и в кухне-гостиной</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Порошковый огнетушитель и сертифицированная аптечка первой помощи</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Блок 3: Доступная среда */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <Accessibility className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Accessible Environment
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Элементы доступной среды
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Продуманные решения для комфорта гостей с ограниченной мобильностью и пожилых путешественников.
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Выделенное широкое парковочное место рядом с гостевым входом</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Ровный освещенный путь ко входу без ступеней и порогов</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Входная дверь и проемы первого этажа шириной от 81 см</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Мобильный подъемник для комфортного доступа в чашу бассейна и джакузи</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Блок 4: Политика отмены бронирования */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Правила отмены
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Условия отмены и невозвратный тариф
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Прозрачные регламенты отмены бронирований в зависимости от срока проживания.
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Краткосрочные бронирования [&lt; 28 ночей]: Негибкие правила [Inflexible]</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Долгосрочные бронирования [&gt;= 28 ночей]: Строгие условия для долгосрочной аренды [Strict]</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Скидка 10% за выбор невозвратного тарифа при бронировании заезда в течение 60 дней</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
