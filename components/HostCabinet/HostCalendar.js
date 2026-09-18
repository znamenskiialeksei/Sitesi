// ==============================================================================
// ПРОФЕССИОНАЛЬНЫЙ КАЛЕНДАРЬ ХОЗЯИНА В СТИЛЕ AIRBNB (HOST CALENDAR PRO)
// Файл: components/HostCabinet/HostCalendar.js
// Назначение: Управление ценами за ночь, минимальными сроками, блокировками и iCal
// ==============================================================================

import React, { useState } from 'react';
import { addMonths, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, format } from 'date-fns';
import { ru, enUS, tr } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, Save, RotateCcw, Lock, Unlock, Zap, Clock, Tag } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';
import { parseDateRU, isSameDay, isDateInRange } from '../../utils/dates';

export default function HostCalendar({
  dynamicRules = {},
  dateRules = [],
  apiEvents = [],
  masterAllChats = [],
  onSaveCalendarRules,
  loading = false
}) {
  const { t, lang, formatMoney } = useLanguage();
  const dateLocale = lang === 'en' ? enUS : (lang === 'tr' ? tr : ru);
  const toast = useToast();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState([null, null]);

  // Форма редактирования правила
  const [editPrice, setEditPrice] = useState('');
  const [editMinNights, setEditMinNights] = useState('');
  const [editStatus, setEditStatus] = useState('Открыто'); // 'Открыто' или 'Заблокировано'
  const [editBookingMode, setEditBookingMode] = useState('');
  const [editNote, setEditNote] = useState('');

  const basePrice = dynamicRules.basePrice || 15000;
  const defaultMinNights = dynamicRules.minNights || 3;

  // Определение динамической цены на дату (с приоритетом последних правил)
  const getPriceForDate = (date) => {
    if (!dateRules || !Array.isArray(dateRules)) return basePrice;
    for (let i = dateRules.length - 1; i >= 0; i--) {
      const rule = dateRules[i];
      const rS = parseDateRU(rule.start);
      const rE = parseDateRU(rule.end);
      if (isDateInRange(date, rS, rE)) {
        if (rule.type === 'Цена') return parseInt(rule.value, 10) || basePrice;
        if (rule.type === 'Сброс цены') return basePrice;
      }
    }
    return basePrice;
  };

  // Определение минимального срока проживания (с приоритетом последних правил)
  const getMinNightsForDate = (date) => {
    if (!dateRules || !Array.isArray(dateRules)) return defaultMinNights;
    for (let i = dateRules.length - 1; i >= 0; i--) {
      const rule = dateRules[i];
      const rS = parseDateRU(rule.start);
      const rE = parseDateRU(rule.end);
      if (isDateInRange(date, rS, rE)) {
        if (rule.type === 'Мин. дней') return parseInt(rule.value, 10) || defaultMinNights;
        if (rule.type === 'Сброс мин. дней') return defaultMinNights;
      }
    }
    return defaultMinNights;
  };

  // Проверка ручной блокировки дат владельцем (с приоритетом последних правил)
  const isManualBlocked = (date) => {
    if (!dateRules || !Array.isArray(dateRules)) return false;
    for (let i = dateRules.length - 1; i >= 0; i--) {
      const rule = dateRules[i];
      const rS = parseDateRU(rule.start);
      const rE = parseDateRU(rule.end);
      if (isDateInRange(date, rS, rE)) {
        if (rule.type === 'Блокировка') return true;
        if (rule.type === 'Сброс блокировки') return false;
      }
    }
    return false;
  };

  // Проверка 24-часового удержания (HOLD) по активным заявкам
  const getHoldDetails = (date) => {
    if (!dateRules || !Array.isArray(dateRules)) return null;
    for (let i = dateRules.length - 1; i >= 0; i--) {
      const rule = dateRules[i];
      const rS = parseDateRU(rule.start);
      const rE = parseDateRU(rule.end);
      if (isDateInRange(date, rS, rE)) {
        if (rule.type === 'Блокировка' && String(rule.value).startsWith('HOLD|')) {
          const parts = String(rule.value).split('|');
          return { contact: parts[1], expiresAt: parts[2] };
        }
      }
    }
    return null;
  };

  // Клик по дню в сетке календаря
  const handleDayClick = (clickedDate) => {
    const [start, end] = selectedRange;
    if (!start || (start && end)) {
      setSelectedRange([clickedDate, null]);
      setEditPrice(getPriceForDate(clickedDate) !== basePrice ? String(getPriceForDate(clickedDate)) : '');
      setEditMinNights(getMinNightsForDate(clickedDate) !== defaultMinNights ? String(getMinNightsForDate(clickedDate)) : '');
      setEditStatus(isManualBlocked(clickedDate) ? 'Заблокировано' : 'Открыто');
    } else {
      if (clickedDate < start) setSelectedRange([clickedDate, start]);
      else setSelectedRange([start, clickedDate]);
    }
  };

  // Применение настроек к выбранному диапазону дат
  const handleApplyRules = () => {
    const [start, end] = selectedRange;
    if (!start) {
      toast.warn('Сначала выберите дату или диапазон дат в сетке календаря.');
      return;
    }

    const startDateStr = format(start, 'dd.MM.yyyy');
    const endDateStr = format(end || start, 'dd.MM.yyyy');
    const rulesToSave = [];

    if (editStatus === 'Заблокировано') {
      rulesToSave.push({ start: startDateStr, end: endDateStr, type: 'Блокировка', value: 'РУЧНАЯ БЛОКИРОВКА', note: editNote });
    } else if (editStatus === 'Открыто') {
      rulesToSave.push({ start: startDateStr, end: endDateStr, type: 'Сброс блокировки', value: 'СБРОС', note: '' });
    }

    if (editPrice.trim() !== '') {
      rulesToSave.push({ start: startDateStr, end: endDateStr, type: 'Цена', value: editPrice.trim(), note: editNote });
    }

    if (editMinNights.trim() !== '') {
      rulesToSave.push({ start: startDateStr, end: endDateStr, type: 'Мин. дней', value: editMinNights.trim(), note: editNote });
    }

    if (editBookingMode !== '') {
      rulesToSave.push({ start: startDateStr, end: endDateStr, type: 'Тип бронирования', value: editBookingMode, note: editNote });
    }

    if (rulesToSave.length === 0) {
      toast.info('Нет параметров для сохранения.');
      return;
    }

    onSaveCalendarRules(rulesToSave);
    setSelectedRange([null, null]);
    setEditPrice('');
    setEditMinNights('');
    setEditBookingMode('');
    setEditNote('');
  };

  // Сброс всех правил для выбранного периода (цена, блокировка, мин. дней)
  const handleResetRules = () => {
    const [start, end] = selectedRange;
    if (!start) {
      toast.warn('Сначала выберите дату или диапазон дат для сброса.');
      return;
    }

    const startDateStr = format(start, 'dd.MM.yyyy');
    const endDateStr = format(end || start, 'dd.MM.yyyy');

    // Набор правил-сброса: освобождаем цену, блокировку и мин. дни
    const resetRules = [
      { start: startDateStr, end: endDateStr, type: 'Сброс цены', value: 'СБРОС', note: '' },
      { start: startDateStr, end: endDateStr, type: 'Сброс блокировки', value: 'СБРОС', note: '' },
      { start: startDateStr, end: endDateStr, type: 'Сброс мин. дней', value: 'СБРОС', note: '' }
    ];

    onSaveCalendarRules(resetRules);
    setSelectedRange([null, null]);
    setEditPrice('');
    setEditMinNights('');
    setEditBookingMode('');
    setEditNote('');
    toast.info('Правила периода сброшены до значений по умолчанию.');
  };

  // Отрисовка календарной сетки
  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDateGrid;
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const header = (
      <div className="grid grid-cols-7 gap-1 mb-2 w-full text-center text-xs font-bold text-slate-500 uppercase">
        {weekDays.map((wd, i) => <div key={i} className="py-1">{wd}</div>)}
      </div>
    );

    while (day <= endDateGrid) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const price = getPriceForDate(cloneDay);
        const minN = getMinNightsForDate(cloneDay);
        const blocked = isManualBlocked(cloneDay);
        const hold = getHoldDetails(cloneDay);
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);

        const [rStart, rEnd] = selectedRange;
        const isSelected = (rStart && isSameDay(cloneDay, rStart)) || (rEnd && isSameDay(cloneDay, rEnd));
        const isInRange = rStart && rEnd && cloneDay > rStart && cloneDay < rEnd;

        // Поиск событий iCal синхронизации
        const dayEvents = apiEvents.filter((ev) => {
          if (!ev || !ev.start) return false;
          const [sY, sM, sD] = ev.start.split('-').map(Number);
          const [eY, eM, eD] = (ev.end || ev.start).split('-').map(Number);
          const sDate = new Date(sY, sM - 1, sD, 0, 0, 0);
          const eDate = new Date(eY, eM - 1, eD, 23, 59, 59);
          return cloneDay >= sDate && cloneDay <= eDate;
        });

        const getChannelColor = (sourceId) => {
          switch (sourceId) {
            case 'airbnb': return 'bg-[#ff5a5f]';
            case 'booking': return 'bg-[#003580]';
            case 'vrbo': return 'bg-[#1f4172]';
            case 'avito': return 'bg-[#965cf4]';
            case 'agoda': return 'bg-[#58a618]';
            case 'google': return 'bg-[#4285f4]';
            default: return 'bg-amber-500';
          }
        };

        days.push(
          <div
            key={cloneDay.toISOString()}
            onClick={() => handleDayClick(cloneDay)}
            className={`relative min-h-[90px] md:min-h-[110px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden select-none ${!isCurrentMonth ? 'opacity-30 bg-slate-950/40 border-transparent' : 'bg-slate-800/60 border-white/5 hover:border-white/20'
              } ${isSelected ? '!bg-rose-600 !border-rose-400 text-white shadow-lg' : ''} ${isInRange ? '!bg-rose-950/50 !border-rose-500/30' : ''
              } ${blocked && !isSelected && !isInRange ? '!bg-red-950/40 border-red-500/20' : ''}`}
          >
            {/* Верхняя строка числа */}
            <div className="flex items-center justify-between z-10">
              <span className={`text-xs font-bold ${blocked ? 'text-red-400 line-through' : 'text-white'}`}>
                {format(cloneDay, 'd')}
              </span>
              {minN !== defaultMinNights && (
                <span className="text-[10px] font-bold text-blue-300 bg-blue-900/50 px-1.5 py-0.5 rounded">
                  {minN}н
                </span>
              )}
            </div>

            {/* Индикация удержания 24ч */}
            {hold && (
              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5 z-10" title={`HOLD: ${hold.contact}`}>
                ⏳ 24h
              </span>
            )}

            {/* Внешние брони iCal цветные полоски */}
            <div className="space-y-0.5 my-1 z-10">
              {dayEvents.map((ev, eIdx) => (
                <div
                  key={eIdx}
                  className={`h-1.5 rounded-full ${getChannelColor(ev.sourceId)} opacity-90 shadow-sm`}
                  title={`${ev.sourceName || ev.sourceId}: ${ev.start} — ${ev.end}`}
                />
              ))}
            </div>

            {/* Нижняя строка стоимости за ночь */}
            <div className="text-right z-10">
              <span className="text-[11px] font-black text-emerald-400">
                {price.toLocaleString()} ₽
              </span>
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-1 mb-1 w-full">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="w-full">
        {header}
        {rows}
      </div>
    );
  };

  return (
    <div className="space-y-6 fade-in">

      {/* Шапка календаря с навигацией по месяцам */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-white/10">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-rose-500" />
          <div>
            <h3 className="text-base font-bold text-white capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: dateLocale })}
            </h3>
            <span className="text-xs text-slate-400">Базовая цена: {basePrice.toLocaleString()} ₽ • Мин. срок: {defaultMinNights} ночи</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            Сегодня
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Календарная сетка (2 колонки) */}
        <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-3xl border border-white/10 shadow-xl overflow-hidden">
          {renderCalendarGrid()}
        </div>

        {/* Панель настроек для выбранных дат (1 колонка) */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between space-y-6 h-fit">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Настройки выбранных дат
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              {selectedRange[0] ? (
                <>Период: <b className="text-rose-400">{format(selectedRange[0], 'dd.MM.yy')}</b> {selectedRange[1] ? `— ${format(selectedRange[1], 'dd.MM.yy')}` : ''}</>
              ) : (
                'Кликните по дате в календаре для редактирования'
              )}
            </p>

            <div className="space-y-4">
              {/* Статус доступности */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Доступность
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('Открыто')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${editStatus === 'Открыто' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                  >
                    <Unlock className="w-3.5 h-3.5" /> Открыто
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('Заблокировано')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${editStatus === 'Заблокировано' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                  >
                    <Lock className="w-3.5 h-3.5" /> Блок
                  </button>
                </div>
              </div>

              {/* Стоимость за ночь */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Цена за ночь (RUB)
                </label>
                <input
                  type="number"
                  placeholder={`Базовая: ${basePrice}`}
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-rose-500"
                />
              </div>

              {/* Мин. ночей */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Мин. срок аренды (ночей)
                </label>
                <input
                  type="number"
                  placeholder={`Базовый: ${defaultMinNights}`}
                  value={editMinNights}
                  onChange={(e) => setEditMinNights(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-rose-500"
                />
              </div>

              {/* Режим бронирования */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Режим бронирования
                </label>
                <select
                  value={editBookingMode}
                  onChange={(e) => setEditBookingMode(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-xs font-bold text-white outline-none"
                >
                  <option value="">По умолчанию (Мгновенное)</option>
                  <option value="instant">⚡ Мгновенное бронирование</option>
                  <option value="manual">✋ Бронирование по запросу</option>
                </select>
              </div>

              {/* Внутренняя заметка */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Внутренняя заметка хозяина
                </label>
                <input
                  type="text"
                  placeholder="Например: Праздничный период"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApplyRules}
              disabled={loading || !selectedRange[0]}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Save className="w-4 h-4" /> Сохранить в календарь
            </button>
            <button
              onClick={handleResetRules}
              disabled={loading || !selectedRange[0]}
              title="Сбросить цену, блокировку и минимальный срок до значений по умолчанию"
              className="py-4 px-4 rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-bold text-xs transition-all border border-white/10 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4" /> Сбросить
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

