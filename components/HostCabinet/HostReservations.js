// ==============================================================================
// УПРАВЛЕНИЕ БРОНИРОВАНИЯМИ И ЗАЯВКАМИ ХОЗЯИНА (HOST RESERVATIONS)
// Файл: components/HostCabinet/HostReservations.js
// Назначение: Модерация заявок: одобрение (24h HOLD), спецпредложение, отклонение, отзыв
// ==============================================================================

import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, Tag, Undo2, User, Phone, Calendar, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';

export default function HostReservations({
  requests = [],
  onApprove,
  onSpecialOffer,
  onReject,
  onRevoke,
  loading = false
}) {
  const { t, formatMoney } = useLanguage();
  const toast = useToast();

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerCheckIn, setOfferCheckIn] = useState('');
  const [offerCheckOut, setOfferCheckOut] = useState('');

  const openSpecialOfferModal = (req) => {
    setSelectedReq(req);
    setOfferPrice(req.price ? req.price.replace(/[^\d]/g, '') : '');
    setOfferCheckIn(req.checkIn || '');
    setOfferCheckOut(req.checkOut || '');
    setOfferModalOpen(true);
  };

  const submitSpecialOffer = () => {
    if (!offerPrice || !selectedReq) {
      toast.warn('Укажите стоимость специального предложения.');
      return;
    }

    onSpecialOffer({
      rowIndex: selectedReq.rowIndex,
      clientContact: selectedReq.contact,
      chatSheetName: `Chat_${selectedReq.name || 'Гость'}_${selectedReq.contact}`,
      checkIn: offerCheckIn,
      checkOut: offerCheckOut,
      price: `${offerPrice} RUB`,
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
        <h4 className="text-base font-bold text-white mb-1">Новых заявок на модерацию нет</h4>
        <p className="text-xs">Все поступающие запросы от путешественников появятся здесь.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-500" /> Активные заявки путешественников ({requests.length})
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
                    <User className="w-4 h-4 text-rose-400" /> {req.name || 'Гость'}
                  </span>
                  <span className="text-xs text-slate-400">({req.contact})</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isHold ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 flex flex-wrap items-center gap-4">
                  <span>Период: <b className="text-white">{req.checkIn} — {req.checkOut}</b> ({req.nights} ночей)</span>
                  <span>Гостей: <b className="text-white">{req.guests || (req.adults + req.children)}</b></span>
                  <span>Сумма: <b className="text-emerald-400 font-bold">{req.price}</b></span>
                </div>

                {req.expiresAt && isHold && (
                  <p className="text-[11px] text-amber-300 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" /> Окно оплаты открыто до: {new Date(req.expiresAt).toLocaleString('ru-RU')}
                  </p>
                )}
              </div>

              {/* Кнопки управления заявкой */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
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

                    <button
                      disabled={loading}
                      onClick={() => onReject(req)}
                      className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold text-xs transition-colors border border-red-500/20 flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> {t('rejectRequestBtn')}
                    </button>
                  </>
                )}

                {isHold && (
                  <button
                    disabled={loading}
                    onClick={() => onRevoke(req)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition-colors border border-white/10 flex items-center gap-1.5"
                  >
                    <Undo2 className="w-4 h-4" /> {t('revokeOfferBtn')}
                  </button>
                )}
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
              Специальное предложение для {selectedReq.name}
            </h4>
            <p className="text-xs text-slate-400">
              Вы можете изменить стоимость за весь период или скорректировать даты проживания.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Специальная итоговая стоимость (RUB)
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
                    Заезд
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
                    Выезд
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
                Отмена
              </button>
              <button
                onClick={submitSpecialOffer}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30"
              >
                Отправить предложение
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

