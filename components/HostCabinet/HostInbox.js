// ==============================================================================
// ЦЕНТР СООБЩЕНИЙ И CRM ХОЗЯИНА (HOST INBOX & CRM)
// Файл: components/HostCabinet/HostInbox.js
// Назначение: Сплит-мессенджер, массовые рассылки с плейсхолдерами, шаблоны и LMS
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Users, Search, Sparkles, MessageSquare, Tag, PlayCircle, CheckSquare, Square, X, CheckCircle, XCircle, RotateCcw, Gift } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';

export default function HostInbox({
  chats = [],
  lmsModules = [],
  onSendMessage,
  onBroadcast,
  onApprove,
  onSpecialOffer,
  onReject,
  onRevoke,
  loading = false
}) {
  const { t, lang } = useLanguage();
  const toast = useToast();

  const [selectedSheet, setSelectedSheet] = useState(chats[0]?.sheetName || null);
  const [selectedMultiSheets, setSelectedMultiSheets] = useState([]);
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [messageInput, setMessageInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  const activeChat = chats.find((c) => c.sheetName === selectedSheet) || chats[0];
  const chatBottomRef = useRef(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // Фильтрация чатов по поиску
  const filteredChats = chats.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.clientName || '').toLowerCase().includes(q) ||
      (c.clientContact || '').toLowerCase().includes(q)
    );
  });

  // Быстрые шаблоны ответов
  const quickTemplates = [
    { title: "Приветствие", text: "Здравствуйте, [FIRST_NAME]! С радостью ждем вас на Villa Turaman. Подскажите, во сколько планируете прибытие?" },
    { title: "Подтверждение", text: "Ваша бронь на Villa Turaman с [CHECKIN_DATE] по [CHECKOUT_DATE] успешно подтверждена! Ждем вас в гости." },
    { title: "Wi-Fi и правила", text: "Код от Wi-Fi: VillaTuraman_5G (пароль: turaman2026). Бассейн открыт с 08:00 до 23:00. Буду рад ответить на любые вопросы!" }
  ];

  const handleInsertTemplate = (templateText) => {
    let replaced = templateText;
    if (activeChat) {
      replaced = replaced.replace(/\[FIRST_NAME\]/g, activeChat.clientName || 'Гость');
      const curReq = activeChat.activeRequests?.[0];
      if (curReq) {
        replaced = replaced.replace(/\[CHECKIN_DATE\]/g, curReq.checkIn || '');
        replaced = replaced.replace(/\[CHECKOUT_DATE\]/g, curReq.checkOut || '');
      }
    }
    setMessageInput(replaced);
  };

  const handleSendLessonLink = (lesson) => {
    if (!lesson) return;
    const lessonTitle = lesson.name?.[lang] || lesson.name?.ru || lesson.name || 'Путеводитель';
    setMessageInput(
      `🎓 Доступ к авторскому путеводителю открыт!\nГид: ${lessonTitle}\nКатегория: ${lesson.module}\n\nВаша персональная ссылка:\n${lesson.privateLink}\n\nПриятного просмотра!`
    );
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim() && !attachedFile) return;

    if (isBroadcastMode) {
      if (selectedMultiSheets.length === 0) {
        toast.warn('Выберите хотя бы одного получателя для массовой рассылки.');
        return;
      }
      onBroadcast(selectedMultiSheets, messageInput.trim());
      toast.success(`Рассылка отправлена ${selectedMultiSheets.length} гостям!`);
      setMessageInput('');
      setIsBroadcastMode(false);
    } else {
      if (!activeChat) return;
      onSendMessage(activeChat.sheetName, messageInput.trim(), attachedFile);
      setMessageInput('');
      setAttachedFile(null);
    }
  };

  const toggleSelectMulti = (sheetName) => {
    setSelectedMultiSheets((prev) =>
      prev.includes(sheetName) ? prev.filter((s) => s !== sheetName) : [...prev, sheetName]
    );
  };

  const selectAllChats = () => {
    if (selectedMultiSheets.length === chats.length) setSelectedMultiSheets([]);
    else setSelectedMultiSheets(chats.map((c) => c.sheetName));
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-[700px] flex flex-col fade-in">

      {/* Верхняя панель управления инбоксом */}
      <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-white">Центр сообщений с гостями</h3>
          <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-white/5">
            Диалогов: {chats.length}
          </span>
        </div>

        <button
          onClick={() => {
            setIsBroadcastMode(!isBroadcastMode);
            if (!isBroadcastMode) setSelectedMultiSheets(chats.map((c) => c.sheetName));
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isBroadcastMode ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
            }`}
        >
          <Users className="w-4 h-4" />
          <span>{isBroadcastMode ? 'Обычный режим чата' : 'Массовая рассылка'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">

        {/* Левая колонка: Список диалогов с гостями (4 колонки) */}
        <div className="md:col-span-4 border-r border-white/10 flex flex-col bg-slate-950/50">
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени или контакту..."
                className="w-full bg-slate-800/80 border border-white/5 pl-9 pr-3 py-2 rounded-xl text-xs text-white outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {isBroadcastMode && (
            <div className="p-2.5 bg-slate-800/60 border-b border-white/5 flex items-center justify-between text-xs text-slate-300">
              <button onClick={selectAllChats} className="font-bold hover:text-white flex items-center gap-1.5">
                {selectedMultiSheets.length === chats.length ? <CheckSquare className="w-4 h-4 text-rose-400" /> : <Square className="w-4 h-4" />}
                <span>Выбрать всех ({selectedMultiSheets.length})</span>
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredChats.map((c, idx) => {
              const isSelected = isBroadcastMode
                ? selectedMultiSheets.includes(c.sheetName)
                : selectedSheet === c.sheetName;
              const lastMsg = c.messages?.[c.messages.length - 1];

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isBroadcastMode) toggleSelectMulti(c.sheetName);
                    else setSelectedSheet(c.sheetName);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${isSelected ? 'bg-rose-950/40 border-l-4 border-rose-500' : 'hover:bg-slate-800/50'
                    }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                    {c.clientName?.charAt(0).toUpperCase() || 'G'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">{c.clientName}</span>
                      <span className="text-[10px] text-slate-500">{lastMsg?.date?.split(' ')?.[0] || ''}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.clientContact}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-1">
                      {lastMsg ? `${lastMsg.sender}: ${lastMsg.original}` : 'Нет сообщений'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Центральная колонка: Активная переписка и поле ввода (5 колонок) */}
        <div className="md:col-span-5 flex flex-col bg-slate-900 justify-between overflow-hidden">

          {/* Верхняя строка активного чата */}
          <div className="p-3.5 border-b border-white/10 bg-slate-800/40 flex items-center justify-between">
            <span className="text-xs font-bold text-white truncate">
              {isBroadcastMode ? `Массовая рассылка (${selectedMultiSheets.length} получателей)` : `Диалог: ${activeChat?.clientName || 'Гость'}`}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">{activeChat?.clientContact}</span>
            </div>
          </div>

          {/* Сообщения активного диалога */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/30">
            {activeChat?.messages?.map((m, mIdx) => {
              const isOwner = m.sender === 'Владелец' || m.sender === 'Система';
              return (
                <div key={mIdx} className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-500 mb-1 px-1">
                    {m.sender} • {m.date}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs whitespace-pre-wrap break-words shadow-md ${isOwner ? 'bg-rose-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-sm'
                      }`}
                  >
                    {m[lang] || m.original}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Быстрые шаблоны ответов (полоса над полем ввода) */}
          <div className="p-2 bg-slate-850 border-t border-white/5 flex gap-1.5 overflow-x-auto">
            {quickTemplates.map((tItem, tIdx) => (
              <button
                key={tIdx}
                type="button"
                onClick={() => handleInsertTemplate(tItem.text)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white shrink-0 border border-white/5 transition-colors"
              >
                + {tItem.title}
              </button>
            ))}
          </div>

          {/* Поле ввода */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Введите ответ гостю (поддерживаются переменные [FIRST_NAME]...)"
              className="flex-1 bg-slate-800 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-white outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={loading || !messageInput.trim()}
              className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Правая колонка: Детали гостя, текущая бронь и выдача LMS видео-гидов (3 колонки) */}
        <div className="md:col-span-3 border-l border-white/10 bg-slate-950/60 p-4 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              Информация о госте
            </h4>

            <div className="space-y-2 text-xs">
              <p className="text-slate-400">Имя: <b className="text-white">{activeChat?.clientName || 'Гость'}</b></p>
              <p className="text-slate-400">Контакт: <b className="text-white">{activeChat?.clientContact || '—'}</b></p>
            </div>

            {/* Активные брони гостя */}
            {activeChat?.activeRequests && activeChat.activeRequests.length > 0 && (
              <div className="p-3 bg-slate-900 rounded-2xl border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
                  Текущая бронь
                </span>
                {activeChat.activeRequests.map((r, rIdx) => (
                  <div key={rIdx} className="text-xs space-y-1">
                    <p className="font-bold text-white">{r.checkIn} — {r.checkOut}</p>
                    <p className="text-emerald-400 font-bold">{r.price}</p>
                    <p className="text-slate-400 text-[11px]">Статус: {r.status}</p>

                    {/* Кнопки управления заявкой (только для статуса ЗАПРОС) */}
                    {(r.status === 'ЗАПРОС' || (r.status && r.status.includes('ОЖИДАЕТ'))) && (
                      <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                        <button
                          onClick={() => onApprove && onApprove(r)}
                          disabled={loading}
                          title="Одобрить на 24 часа — гость получит ссылку на оплату"
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold transition-all disabled:opacity-40"
                        >
                          <CheckCircle className="w-3 h-3" /> Одобрить 24ч
                        </button>
                        <button
                          onClick={() => onSpecialOffer && onSpecialOffer({ rowIndex: r.rowIndex, contact: r.contact, name: r.name, checkIn: r.checkIn, checkOut: r.checkOut, chatSheetName: `Chat_${r.name}_${r.contact}` })}
                          disabled={loading}
                          title="Отправить специальное предложение"
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border border-purple-500/30 text-[10px] font-bold transition-all disabled:opacity-40"
                        >
                          <Gift className="w-3 h-3" /> Спецпредл.
                        </button>
                        <button
                          onClick={() => onRevoke && onRevoke(r)}
                          disabled={loading}
                          title="Отозвать предложение — освободить даты"
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-500/30 text-[10px] font-bold transition-all disabled:opacity-40"
                        >
                          <RotateCcw className="w-3 h-3" /> Отозвать
                        </button>
                        <button
                          onClick={() => onReject && onReject(r)}
                          disabled={loading}
                          title="Отклонить заявку"
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 text-[10px] font-bold transition-all disabled:opacity-40"
                        >
                          <XCircle className="w-3 h-3" /> Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Блок отправки путеводителя */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1">
                <PlayCircle className="w-3.5 h-3.5" /> Открыть доступ к гиду
              </span>
              <select
                onChange={(e) => {
                  const lesson = lmsModules.find((m) => m.privateLink === e.target.value);
                  if (lesson) handleSendLessonLink(lesson);
                  e.target.value = "";
                }}
                className="w-full bg-slate-800 border border-white/10 p-2 rounded-xl text-xs text-white font-bold outline-none cursor-pointer"
              >
                <option value="">Выберите видео-путеводитель...</option>
                {lmsModules.map((m, mIdx) => (
                  <option key={mIdx} value={m.privateLink}>
                    {m.name?.ru || m.name?.en || m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-white/5 pt-3">
            Все сообщения автоматически архивируются в таблице гостевых чатов Google Таблиц.
          </div>
        </div>

      </div>
    </div>
  );
}

