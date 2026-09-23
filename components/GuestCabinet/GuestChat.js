// ==============================================================================
// ПЕРСОНАЛЬНЫЙ ЧАТ ГОСТЯ С ХОЗЯИНОМ (GUEST CHAT)
// Файл: components/GuestCabinet/GuestChat.js
// Назначение: Защищенный диалог с владельцем виллы, вложения, перевод RU/EN/TR
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, MessageCircle, User, Shield, FileText, Sparkles, Clock, CreditCard, Gift, Calendar, Mail } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';

export default function GuestChat({
  messages = [],
  onSendMessage,
  loading = false,
  activeRequests = [],
  timeLefter = {},
  onPayRequest
}) {
  const { t, lang } = useLanguage();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const messagesContainerRef = useRef(null);
  const isUserAtBottomRef = useRef(true);
  const prevCountRef = useRef(0);

  // Изолированный скролл контейнера с защитой позиции чтения пользователя
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const el = messagesContainerRef.current;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isUserAtBottomRef.current = distanceToBottom < 120;
  };

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const isFirstLoad = prevCountRef.current === 0 && messages.length > 0;
    const hasNewMessages = messages.length > prevCountRef.current;

    // Скроллим только при первой загрузке или если пользователь уже у нижней границы
    if (isFirstLoad || (hasNewMessages && isUserAtBottomRef.current)) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast.warn('Файл слишком большой. Максимальный размер: 5 МБ.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFile({
        name: selected.name,
        type: selected.type,
        base64: reader.result.split(',')[1]
      });
    };
    reader.readAsDataURL(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    isUserAtBottomRef.current = true;
    onSendMessage(input.trim(), file);
    setInput('');
    setFile(null);
    if (messagesContainerRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const activeOffer = (activeRequests || []).find((r) => r && r.status && (String(r.status).includes('СПЕЦПРЕДЛОЖЕНИЕ') || String(r.status).includes('ОЖИДАЕТ')));
  const remaining = activeOffer ? timeLefter?.[activeOffer.rowIndex] || null : null;
  const isOffer = activeOffer && String(activeOffer.status || '').includes('СПЕЦПРЕДЛОЖЕНИЕ');

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] fade-in">
      
      {/* Выразительная шапка чата гостя */}
      <div className="p-4 sm:p-5 bg-slate-800/90 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="text-base sm:text-lg font-black text-white flex items-center gap-2 tracking-wide">
            <MessageCircle className="w-5 h-5 text-rose-500" />
            <span>Чат с хозяином</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
              AZ
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 leading-snug">
                <span>Алексей Знаменский</span>
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <div className="text-xs text-slate-300 font-medium leading-none mt-0.5">
                Владелец Villa Turaman
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>[Онлайн]</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-between md:justify-end">
          <a
            href="https://t.me/AlekseiZnamenskii"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
            title="Открыть диалог с хозяином в Telegram"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>Телеграм хозяина</span>
          </a>
          <a
            href="mailto:info@villaturaman.com"
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
            title="Написать письмо владельцу"
          >
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span>Почта хозяина</span>
          </a>
          <span className="text-[11px] text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/10 font-bold tracking-wider uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Авто-перевод: {lang.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* Закрепленная плашка специального предложения или ожидания оплаты */}
      {activeOffer && (
        <div className={`p-4 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg transition-all ${
          isOffer
            ? 'bg-gradient-to-r from-purple-950/90 via-slate-900 to-rose-950/80 border-purple-500/30'
            : 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-rose-950/80 border-amber-500/30'
        }`}>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                isOffer
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {isOffer ? <Gift className="w-3.5 h-3.5 text-purple-400" /> : <Clock className="w-3.5 h-3.5 text-rose-400" />}
                {isOffer ? 'Специальное предложение от хозяина' : 'Ожидает оплаты: 24ч HOLD'}
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {activeOffer.checkIn} - {activeOffer.checkOut} [{activeOffer.nights} ноч.]
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span>Стоимость: <b className="text-emerald-400 font-extrabold text-sm">{activeOffer.price}</b></span>
              {remaining && remaining !== 'EXPIRED' && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-950/90 px-3 py-1 rounded-full border border-rose-500/40 animate-pulse">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Осталось: {remaining}</span>
                </div>
              )}
              {remaining === 'EXPIRED' && (
                <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                  Время оплаты истекло
                </span>
              )}
            </div>
          </div>

          {remaining !== 'EXPIRED' && onPayRequest && (
            <button
              onClick={() => onPayRequest(activeOffer)}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span>Оплатить {activeOffer.price}</span>
            </button>
          )}
        </div>
      )}

      {/* Лента сообщений с изолированным скроллом и защитой позиции пользователя */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40 custom-scrollbar"
      >
        {!messages || messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
            <p>Диалог пуст. Напишите сообщение хозяину виллы!</p>
          </div>
        ) : (
          messages.filter(Boolean).map((m, idx) => {
            const isHost = m.sender === 'Владелец' || m.sender === 'Алексей Знаменский' || m.sender === 'Admin' || m.sender === 'Owner';
            const isAi = (m.sender || '').includes('ИИ') || (m.sender || '').includes('Gemini');
            const isSystem = m.sender === 'Система';
            const isMe = !isHost && !isSystem && !isAi;

            if (isSystem) {
              return (
                <div key={idx} className="flex justify-center my-2">
                  <div className="bg-slate-800/60 border border-white/5 px-4 py-2 rounded-2xl text-xs text-slate-300 text-center max-w-md italic">
                    {m[lang] || m.original}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {isAi ? (
                  <span className="text-[10px] text-purple-400 mb-1 px-1 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>{m.sender} • {m.date}</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 mb-1 px-1">
                    {m.sender} • {m.date}
                  </span>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-[82%] text-xs sm:text-sm whitespace-pre-wrap break-words shadow-md ${
                    isMe
                      ? 'bg-rose-600 text-white rounded-tr-sm'
                      : isAi
                        ? 'bg-gradient-to-br from-slate-900 to-purple-950/60 text-purple-100 border border-purple-500/30 rounded-tl-sm shadow-purple-950/20'
                        : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-sm'
                  }`}
                >
                  {m[lang] || m.original}

                  {m.file && (
                    <div className="mt-2.5 p-2 bg-black/20 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-200">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{m.file}</span>
                    </div>
                  )}

                  {/* Интерактивная кнопка оплаты прямо в сообщении спецпредложения */}
                  {String(m.original || m.ru || '').toLowerCase().includes('специальное предложение') && activeOffer && remaining !== 'EXPIRED' && onPayRequest && (
                    <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-amber-400" /> Спецпредложение активно
                      </span>
                      <button
                        onClick={() => onPayRequest(activeOffer)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Оплатить {activeOffer.price}</span>
                      </button>
                    </div>
                  )}

                  {/* Навигационные кнопки прямой связи с хозяином под сообщением хозяина или ИИ */}
                  {(isHost || isAi) && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <a
                        href="https://t.me/AlekseiZnamenskii"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-200 text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3 h-3 text-sky-300" />
                        <span>Телеграм хозяина</span>
                      </a>
                      <a
                        href="mailto:info@villaturaman.com"
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Mail className="w-3 h-3 text-rose-300" />
                        <span>Почта хозяина</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Прикрепленный файл превью */}
      {file && (
        <div className="px-5 py-2.5 bg-slate-800 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="w-4 h-4 text-rose-400" />
            <span className="truncate">{file.name}</span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Поле ввода сообщения */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-slate-900 border-t border-white/10 flex items-center gap-3"
      >
        <label className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors border border-white/10">
          <Paperclip className="w-4 h-4" />
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('typeMessagePrompt')}
          className="flex-1 bg-slate-800 border border-white/10 px-4 py-3 rounded-2xl text-xs sm:text-sm text-white focus:border-rose-500 outline-none transition-colors"
        />

        <button
          type="submit"
          disabled={loading || (!input.trim() && !file)}
          className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg shadow-rose-600/30 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}

