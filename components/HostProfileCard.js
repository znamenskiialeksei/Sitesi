// ==============================================================================
// КАРТОЧКА ХОЗЯИНА В СТИЛЕ AIRBNB: HOST PROFILE CARD
// Файл: components/HostProfileCard.js
// Назначение: Презентация владельца Алексея Знаменского, статус Superhost и связь
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import {
  Award,
  ShieldCheck,
  Clock,
  MessageCircle,
  Globe2,
  Compass,
  Bike,
  Trees,
  PlaneTakeoff,
  Quote
} from 'lucide-react';
import { useLanguage } from '../utils/language';
import { useAuth } from '../context/AuthContext';

export default function HostProfileCard({ homeData = null }) {
  const { t } = useLanguage();
  const { currentUser, setContactModalOpen } = useAuth();

  const cardTitle = homeData?.hostCardTitle || t('hostCardTitle') || 'Хозяин: Алексей Знаменский';
  const cardSubtitle = homeData?.hostCardSubtitle || t('superhostSinceDesc') || 'Суперхозяин на Airbnb • Яхтсмен на пенсии • Мармарис';
  const verifiedText = homeData?.hostCardVerified || t('identityVerified') || 'Личность подтверждена';
  const responseTimeText = homeData?.hostCardResponseTime || t('responseTimeOneHour') || 'Время ответа: в течение часа';
  const languagesText = homeData?.hostCardLanguages || t('languagesSpoken') || 'Языки: Русский, English, Türkçe';
  const contactBtnText = homeData?.hostCardBtn || (currentUser ? (t('messageHostBtn') || 'Написать хозяину') : (t('contactHostBtn') || 'Написать хозяину'));

  return (
    <div className="py-8 border-t border-white/10">
      <div className="bg-slate-800/60 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Верхняя панель: Аватар, имя, бейджи и кнопка связи */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 p-1 shadow-xl">
                {homeData?.hostAvatar ? (
                  <img
                    src={homeData.hostAvatar}
                    alt={cardTitle}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    <span className="text-2xl font-black text-white">AZ</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md" title="Суперхозяин">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {cardTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {cardSubtitle}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> {verifiedText}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <Clock className="w-3 h-3" /> {responseTimeText}
                </span>
              </div>
            </div>
          </div>

          {/* Кнопка диалога с хозяином */}
          {currentUser ? (
            <Link
              href="/guest?tab=chat"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> {contactBtnText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> {contactBtnText}
            </button>
          )}
        </div>

        {/* Нижняя расширенная панель: Девиз, интересы, путешествия и налоговые данные */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          {/* Кредо хозяина */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold mb-1">
              <Quote className="w-3.5 h-3.5" />
              <span>Жизненное кредо</span>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              «Хочешь сделать хорошо - сделай сам»
            </p>
          </div>

          {/* Мечта и город */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Мечта и базирование</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              База: Мармарис • Мечта: Португалия и Атлантический океан
            </p>
          </div>

          {/* Хобби и увлечения */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
              <Bike className="w-3.5 h-3.5" />
              <span>Хобби и спорт</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Велоспорт, Парусный спорт, Живая природа Дальяна
            </p>
          </div>

          {/* Штампы путешествий */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold mb-1">
              <PlaneTakeoff className="w-3.5 h-3.5" />
              <span>Штампы путешествий</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Дубай [3 поездки], Абу-Даби [март 2026 г.]
            </p>
          </div>

        </div>

        {/* Дополнительная строка: Языки и юридические реквизиты */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-rose-400" />
            <span>{languagesText}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Официальный налогоплательщик: Ortaca Vergi Dairesi, VKN: 9991120181
          </div>
        </div>

      </div>
    </div>
  );
}
