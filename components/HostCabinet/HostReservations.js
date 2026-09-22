// ==============================================================================
// УПРАВЛЕНИЕ БРОНИРОВАНИЯМИ И ЗАЯВКАМИ ХОЗЯИНА (HOST RESERVATIONS)
// Файл: components/HostCabinet/HostReservations.js
// Назначение: Модерация заявок: одобрение (24h HOLD), спецпредложение, отклонение, отзыв
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, Tag, Undo2, User, Phone, Calendar, AlertCircle, Gift, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';

export default function HostReservations({
  requests = [],
  dynamicRules = {},
  onApprove,
  onSpecialOffer,
  onReject,
  onRevoke,
  onOpenChat,
  loading = false
}) {
  const { t, formatMoney } = useLanguage();
  const toast = useToast();
  const hostCurrency = dynamicRules.currency || 'RUB';

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerCheckIn, setOfferCheckIn] = useState('');
  const [offerCheckOut, setOfferCheckOut] = useState('');
  const [countdownMap, setCountdownMap] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newMap = {};
      requests.forEach((req) => {
        if (req.expiresAt) {
          const diff = new Date(req.expiresAt).getTime() - Date.now();
          if (diff <= 0) {
            newMap[req.rowIndex] = 'EXPIRED';
          } else {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            newMap[req.rowIndex] = `${h}ч ${m}м ${s}с`;
          }
        }
      });
      setCountdownMap(newMap);
    }, 1000);

    return () => clearInterval(interval);
  }, [requests]);

  const openSpecialOfferModal = (req) => {
    setSelectedReq(req);
    setOfferPrice(req.price ? req.price.replace(/[^\d]/g, '') : '');
    setOfferCheckIn(req.checkIn || '');
    setOfferCheckOut(req.checkOut || '');
    setOfferModalOpen(true);
  };

  const getLocalizedStatus = (status) => {
    if (!status) return '';
    const upper = status.toUpperCase();
    if (upper.includes('ЗАПРОС') || upper.includes('REQUEST')) return t('statusRequest');
    if (upper.includes('ОЖИДАЕТ') || upper.includes('AWAITING')) return t('statusAwaitingPayment');
    if (upper.includes('СПЕЦПРЕДЛОЖЕНИЕ') || upper.includes('SPECIAL')) return t('statusSpecialOffer');
    if (upper.includes('ОПЛАЧЕНО') || upper.includes('PAID')) return t('statusPaid');
    if (upper.includes('ОТКЛОНЕНО') || upper.includes('DECLINED')) return t('statusRejected');
    return status;
  };

  const submitSpecialOffer = () => {
    if (!offerPrice || !selectedReq) {
      toast.warn(t('specifyOfferPriceToast'));
      return;
    }

    onSpecialOffer({
      rowIndex: selectedReq.rowIndex,
      clientContact: selectedReq.contact,
      chatSheetName: `Chat_${selectedReq.name || 'Гость'}_${selectedReq.contact}`,
      checkIn: offerCheckIn,
      checkOut: offerCheckOut,
      price: `${offerPrice} ${hostCurrency}`,
      nights: selectedReq.nights,
      adults: selectedReq.adults,
      children: selectedReq.children,
      guests: selectedReq.guests
    });

    setOfferModalOpen(false);
    setSelectedReq(null);
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-10 text-center text-slate-400">
        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40 text-rose-400" />
        <h4 className="text-base font-bold text-white mb-1">{t('noNewRequests')}</h4>
        <p className="text-xs">{t('allIncomingRequestsAppear')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-500" /> {t('activeTravelerRequests')} ({requests.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((req, idx) => {
          const isHold = req.status === 'ОЖИДАЕТ ОПЛАТЫ' || req.status === 'СПЕЦПРЕДЛОЖЕНИЕ';

          return (
            <div
              key={idx}
              className="bg-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-rose-400" /> {req.name || t('guestLabel')}
                  </span>
                  <span className="text-xs text-slate-400">({req.contact})</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isHold ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {getLocalizedStatus(req.status)}
                  </span>
                </div>

                <div className="text-xs text-slate-300 flex flex-wrap items-center gap-4">
                  <span>{t('periodLabel')} <b className="text-white">{req.checkIn} - {req.checkOut}</b> [{req.nights} {t('nightsWord')}]</span>
                  <span>{t('guestsCountLabel')} <b className="text-white">{Number(req.guests) || (Number(req.adults || 0) + Number(req.children || 0)) || 1}</b></span>
                  <span>{t('amountLabel')} <b className="text-emerald-400 font-bold">{req.price}</b></span>
                </div>

                {req.expiresAt && isHold && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                    {countdownMap[req.rowIndex] && countdownMap[req.rowIndex] !== 'EXPIRED' ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-300 font-bold animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        <span>До закрытия окна оплаты: {countdownMap[req.rowIndex]}</span>
                      </span>
                    ) : countdownMap[req.rowIndex] === 'EXPIRED' ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Время оплаты истекло [требуется отзыв]</span>
                      </span>
                    ) : null}
                    <span className="text-[11px] text-slate-400">
                      до {new Date(req.expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Кнопки управления заявкой на любой активной стадии */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {/* Кнопка быстрого перехода в чат с этим гостем */}
                {onOpenChat && (
                  <button
                    disabled={loading}
                    type="button"
                    onClick={() => onOpenChat(req)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs transition-colors border border-blue-500/30 flex items-center gap-1.5 shadow-sm"
                    title="Открыть переписку с гостем в Центре сообщений"
                  >
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span>{t('openChatBtn') || 'Перейти в чат'}</span>
                  </button>
                )}

                {req.status === 'ЗАПРОС' && (
                  <>
                    <button
                      disabled={loading}
                      onClick={() => onApprove(req)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-4 h-4" /> {t('approveRequestBtn')}
                    </button>

                    <button
                      disabled={loading}
                      onClick={() => openSpecialOfferModal(req)}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Tag className="w-4 h-4" /> {t('specialOfferBtn')}
                    </button>
                  </>
                )}

                {/* Возможность отозвать заявку на любой активной стадии */}
                {(req.status === 'ЗАПРОС' || isHold) && (
                  <button
                    disabled={loading}
                    onClick={() => onRevoke(req)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition-colors border border-white/10 flex items-center gap-1.5"
                  >
                    <Undo2 className="w-4 h-4" /> {t('revokeOfferBtn')}
                  </button>
                )}

                <button
                  disabled={loading}
                  onClick={() => onReject(req)}
                  className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold text-xs transition-colors border border-red-500/20 flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> {t('rejectRequestBtn')}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Модальное окно создания специального предложения */}
      {offerModalOpen && selectedReq && (
        <div className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white">
              {t('specialOfferForGuest').replace('{name}', selectedReq.name || t('guestLabel'))}
            </h4>
            <p className="text-xs text-slate-400">
              {t('specialOfferDesc')}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  {t('specialTotalPriceLabel').replace('{currency}', hostCurrency)}
                </label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm text-white font-bold outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    {t('checkIn')}
                  </label>
                  <input
                    type="text"
                    value={offerCheckIn}
                    onChange={(e) => setOfferCheckIn(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-xs text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    {t('checkOut')}
                  </label>
                  <input
                    type="text"
                    value={offerCheckOut}
                    onChange={(e) => setOfferCheckOut(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-xs text-white font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setOfferModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                {t('cancelBtn')}
              </button>
              <button
                onClick={submitSpecialOffer}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30"
              >
                {t('sendOfferBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

