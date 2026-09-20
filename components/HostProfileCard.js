// ==============================================================================
// КАРТОЧКА ХОЗЯИНА В СТИЛЕ AIRBNB: HOST PROFILE CARD
// Файл: components/HostProfileCard.js
// Назначение: Презентация владельца Алексея Знаменского, статус Superhost и связь
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Clock, MessageCircle, Globe2 } from 'lucide-react';
import { useLanguage } from '../utils/language';
import { useAuth } from '../context/AuthContext';

export default function HostProfileCard({ homeData = null }) {
  const { t } = useLanguage();
  const { currentUser, setContactModalOpen } = useAuth();

  const cardTitle = homeData?.hostCardTitle || t('hostCardTitle') || 'Хозяин: Алексей Знаменский';
  const cardSubtitle = homeData?.hostCardSubtitle || t('superhostSinceDesc') || 'Суперхозяин на Airbnb • Более 5 лет приема гостей';
  const verifiedText = homeData?.hostCardVerified || t('identityVerified') || 'Личность подтверждена';
  const responseTimeText = homeData?.hostCardResponseTime || t('responseTimeOneHour') || 'Время ответа: в течение часа';
  const languagesText = homeData?.hostCardLanguages || t('languagesSpoken') || 'Языки: Русский, English, Türkçe';
  const helpText = homeData?.hostCardHelpText || t('hostAssistanceDesc') || 'Помощь в организации трансфера, туров и бронирования ресторанов';
  const contactBtnText = homeData?.hostCardBtn || (currentUser ? (t('messageHostBtn') || 'Написать хозяину') : (t('contactHostBtn') || 'Написать хозяину'));

  return (
    <div className="py-8 border-t border-white/10">
      <div className="bg-slate-800/60 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        
        {/* Аватар и базовая информация */}
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

        {/* Языки и кнопка связи */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Globe2 className="w-3.5 h-3.5 text-rose-400" />
              <span>{languagesText}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {helpText}
            </p>
          </div>

          {currentUser ? (
            <Link
              href="/guest?tab=chat"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> {contactBtnText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> {contactBtnText}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

