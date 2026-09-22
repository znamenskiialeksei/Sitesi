// ==============================================================================
// ВКЛАДКА «МОИ ПОЕЗДКИ» В ЛИЧНОМ КАБИНЕТЕ ПУТЕШЕСТВЕННИКА (GUEST BOOKINGS)
// Файл: components/GuestCabinet/GuestBookings.js
// Назначение: Список бронирований, таймер 24ч HOLD, правила заезда, онлайн-оплата
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, CreditCard, Download, Wifi, KeyRound, ShieldAlert, CheckCircle2, AlertCircle, Gift } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';

export default function GuestBookings({ activeRequests = [], timeLefter = {}, onPayRequest }) {
  const { t } = useLanguage();
  const toast = useToast();

  const getStatusBadge = (st) => {
    if (!st) return null;
    if (st.includes('ЗАПРОС')) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" /> {t('tripStatusPending')}
        </span>
      );
    }
    if (st.includes('ОЖИДАЕТ ОПЛАТЫ')) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
          <CreditCard className="w-3.5 h-3.5 text-rose-400" /> {t('tripStatusAwaitingPay')}
        </span>
      );
    }
    if (st.includes('СПЕЦПРЕДЛОЖЕНИЕ')) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-purple-200 bg-purple-600/30 px-3.5 py-1.5 rounded-full border border-purple-400/40 shadow-md shadow-purple-900/30">
          <Gift className="w-3.5 h-3.5 text-purple-300" /> {t('tripStatusOffer') || 'Специальное предложение от хозяина'}
        </span>
      );
    }
    if (st.includes('ОПЛАЧЕНО')) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {t('tripStatusPaid')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
        {st}
      </span>
    );
  };

  const handleDownloadVoucher = (req) => {
    toast.info('Формирование электронного ваучера бронирования...');
    const params = new URLSearchParams({
      action: 'download_voucher',
      rowIndex: req.rowIndex || '1',
      name: req.name || '',
      contact: req.contact || '',
      checkIn: req.checkIn || '',
      checkOut: req.checkOut || '',
      nights: req.nights || 1,
      guests: req.guests || (req.adults + req.children) || 2,
      price: req.price || ''
    });
    window.open(`/api/booking?${params.toString()}`, '_blank');
  };

  if (!activeRequests || activeRequests.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-white/10 rounded-3xl p-10 text-center fade-in">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{t('noActiveTrips')}</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          Выберите подходящие даты в календаре на главной странице и отправьте заявку на проживание на Villa Turaman.
        </p>
        <Link
          href="/#book"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-600/30"
        >
          Перейти к бронированию виллы
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {activeRequests.map((req, idx) => {
        const remaining = timeLefter[req.rowIndex];
        const isAwaitingPay = req.status === 'ОЖИДАЕТ ОПЛАТЫ' || req.status === 'СПЕЦПРЕДЛОЖЕНИЕ';
        const isOffer = req.status && req.status.includes('СПЕЦПРЕДЛОЖЕНИЕ');

        return (
          <div
            key={idx}
            className={`border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all ${
              isOffer
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-purple-950/40 border-purple-500/40 shadow-purple-950/20'
                : 'bg-slate-800/80 border-white/10'
            }`}
          >
            {/* Верхняя строка статуса */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {getStatusBadge(req.status)}
                <span className="text-xs text-slate-400 font-mono">
                  Заявка #{req.rowIndex}
                </span>
              </div>

              {/* Живой таймер обратного отсчета */}
              {isAwaitingPay && !isExpired && remaining && (
                <div className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full border animate-pulse ${
                  isOffer
                    ? 'text-purple-200 bg-purple-950/80 border-purple-400/40'
                    : 'text-rose-300 bg-rose-950/60 border-rose-500/30'
                }`}>
                  <Clock className={`w-3.5 h-3.5 ${isOffer ? 'text-purple-300' : 'text-rose-400'}`} />
                  <span>{isOffer ? 'Спецпредложение действует:' : t('timeRemainingToPay')} {remaining}</span>
                </div>
              )}
              {isAwaitingPay && isExpired && (
                <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30">
                  Время оплаты истекло
                </span>
              )}
            </div>

            {/* Детали поездки */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Даты проживания
                </span>
                <p className="text-lg font-bold text-white">
                  {req.checkIn} - {req.checkOut}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {req.nights} ночей • {req.guests || (req.adults + req.children)} гостей
                </p>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  {isOffer ? 'Специальная стоимость' : 'Итоговая стоимость'}
                </span>
                <p className="text-xl font-black text-emerald-400">
                  {req.price}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Все сборы и налоги включены</p>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Инструкции по прибытию
                </span>
                <div className="text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>Заезд с 16:00 • Выезд до 10:00</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Wifi className="w-3.5 h-3.5 text-blue-400" />
                    <span>Wi-Fi: VillaTuraman_5G [Код в ваучере]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => handleDownloadVoucher(req)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('downloadVoucherBtn')}</span>
              </button>

              {isAwaitingPay && !isExpired && (
                <button
                  onClick={() => onPayRequest(req)}
                  className={`px-6 py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 ${
                    isOffer
                      ? 'bg-gradient-to-r from-purple-600 via-rose-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-600/30'
                      : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-500/30'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isOffer ? 'Принять спецпредложение и оплатить' : t('proceedToPayBtn')} [{req.price}]</span>
                </button>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}

