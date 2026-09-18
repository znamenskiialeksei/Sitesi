// ==============================================================================
// УПРАВЛЕНИЕ БАЗОВЫМИ ТАРИФАМИ И ПРАВИЛАМИ ВИЛЛЫ (HOST SETTINGS)
// Файл: components/HostCabinet/HostSettings.js
// Назначение: Базовая цена, валюта, мин/макс ночи, время заезда и выезда
// ==============================================================================

import React, { useState } from 'react';
import { Settings, Save, Clock, DollarSign, Calendar, Shield } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';

export default function HostSettings({ globalRules = {}, onSaveSettings, loading = false }) {
  const { t } = useLanguage();
  const toast = useToast();

  const [form, setForm] = useState({
    basePrice: globalRules.basePrice || 165,
    currency: globalRules.currency || 'USD',
    minNights: globalRules.minNights || 3,
    maxNights: globalRules.maxNights || 30,
    bookingWindowMonths: globalRules.bookingWindowMonths || 18,
    advanceNoticeDays: globalRules.advanceNoticeDays || 2,
    bookingMode: globalRules.bookingMode || 'instant',
    checkInTime: globalRules.checkInTime || '16:00',
    checkOutTime: globalRules.checkOutTime || '10:00'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSaveSettings) {
      await onSaveSettings(form);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-4xl fade-in space-y-6 shadow-xl">
      <div className="pb-4 border-b border-white/10 flex items-center gap-3">
        <Settings className="w-6 h-6 text-rose-500" />
        <div>
          <h3 className="text-lg font-bold text-white">Базовые параметры бронирования виллы</h3>
          <p className="text-xs text-slate-400">
            Эти параметры действуют по умолчанию для всех дней, если в календаре не заданы индивидуальные правила.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Базовая цена */}
        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Базовая цена за ночь
          </label>
          <input
            type="number"
            name="basePrice"
            value={form.basePrice}
            onChange={handleChange}
            required
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-rose-500"
          />
        </div>

        {/* Валюта по умолчанию */}
        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
            Основная валюта расчетов
          </label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm font-bold text-white outline-none"
          >
            <option value="RUB">RUB (₽)</option>
            <option value="EUR">EUR (€)</option>
            <option value="TRY">TRY (₺)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>

        {/* Минимальный срок проживания */}
        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
            Минимальный срок проживания (ночей)
          </label>
          <input
            type="number"
            name="minNights"
            value={form.minNights}
            onChange={handleChange}
            required
            min={1}
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-rose-500"
          />
        </div>

        {/* Максимальный срок проживания */}
        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
            Максимальный срок проживания (ночей)
          </label>
          <input
            type="number"
            name="maxNights"
            value={form.maxNights}
            onChange={handleChange}
            required
            min={1}
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-rose-500"
          />
        </div>

        {/* Окно раннего бронирования */}
        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" /> Окно бронирования (месяцев вперед)
          </label>
          <input
            type="number"
            name="bookingWindowMonths"
            value={form.bookingWindowMonths}
            onChange={handleChange}
            required
            min={1}
            max={36}
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-rose-500"
          />
        </div>

        {/* Пауза перед заездом */}
        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
            Мин. дней до заезда (подготовка виллы)
          </label>
          <input
            type="number"
            name="advanceNoticeDays"
            value={form.advanceNoticeDays}
            onChange={handleChange}
            required
            min={0}
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-rose-500"
          />
        </div>

        {/* Время заезда и выезда */}
        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Стандартное время заезда (Check-in)
          </label>
          <input
            type="time"
            name="checkInTime"
            value={form.checkInTime}
            onChange={handleChange}
            required
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm font-bold text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Стандартное время выезда (Check-out)
          </label>
          <input
            type="time"
            name="checkOutTime"
            value={form.checkOutTime}
            onChange={handleChange}
            required
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm font-bold text-white outline-none"
          />
        </div>

        {/* Режим бронирования */}
        <div className="sm:col-span-2">
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
            Режим бронирования по умолчанию
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${form.bookingMode === 'instant' ? 'bg-rose-950/40 border-rose-500 text-white' : 'bg-slate-800 border-white/5 text-slate-400'
              }`}>
              <input
                type="radio"
                name="bookingMode"
                value="instant"
                checked={form.bookingMode === 'instant'}
                onChange={handleChange}
                className="hidden"
              />
              <span className="font-bold text-xs">⚡ Мгновенное бронирование</span>
            </label>

            <label className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${form.bookingMode === 'manual' ? 'bg-rose-950/40 border-rose-500 text-white' : 'bg-slate-800 border-white/5 text-slate-400'
              }`}>
              <input
                type="radio"
                name="bookingMode"
                value="manual"
                checked={form.bookingMode === 'manual'}
                onChange={handleChange}
                className="hidden"
              />
              <span className="font-bold text-xs">✋ Бронирование по запросу</span>
            </label>
          </div>
        </div>

        <div className="sm:col-span-2 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={async () => {
              try {
                toast.info('Синхронизация с Google Таблицами...');
                const res = await fetch('/api/content?force=true', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                  toast.success('Контент, фото, видео и тарифы успешно обновлены из Google Sheets!');
                } else {
                  toast.warn('Синхронизация завершена с использованием локального кэша');
                }
              } catch (e) {
                toast.error('Ошибка сети при синхронизации: ' + e.message);
              }
            }}
            className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all border border-white/10 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-rose-400" />
            <span>Синхронизировать Google Sheets</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-500/25 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Сохранить настройки
          </button>
        </div>

      </form>
    </div>
  );
}

