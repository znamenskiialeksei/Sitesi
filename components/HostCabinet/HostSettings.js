// ==============================================================================
// УПРАВЛЕНИЕ БАЗОВЫМИ ТАРИФАМИ И ПРАВИЛАМИ ВИЛЛЫ (HOST SETTINGS)
// Файл: components/HostCabinet/HostSettings.js
// Назначение: Базовая цена, валюта, мин/макс ночи, время заезда и выезда
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Settings, Save, Clock, DollarSign, Calendar, Shield, Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';

export default function HostSettings({ globalRules = {}, onSaveSettings, loading = false }) {
  const { t } = useLanguage();
  const toast = useToast();

  const [aiSettings, setAiSettings] = useState({
    aiMode: 'copilot',
    geminiModel: 'gemini-3.6-flash',
    minPriceUsd: 180,
    systemPrompt: ''
  });
  const [isAiSaving, setIsAiSaving] = useState(false);
  const [isRestoringSheets, setIsRestoringSheets] = useState(false);
  const [isSavingMasterSeed, setIsSavingMasterSeed] = useState(false);

  const handleSaveMasterSeed = async () => {
    setIsSavingMasterSeed(true);
    try {
      const res = await fetch('/api/admin/save-master-seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Эталон SSOT успешно зафиксирован: разделов ABOUT ${data.aboutCount}, ключей HOME ${data.homeKeysCount}, параметров SETTINGS ${data.settingsCount}`);
      } else {
        toast.error(`Ошибка фиксации эталона: ${data.error}`);
      }
    } catch (err) {
      toast.error(`Сбой связи: ${err.message}`);
    } finally {
      setIsSavingMasterSeed(false);
    }
  };

  const handleRestoreSheets = async () => {
    setIsRestoringSheets(true);
    try {
      const res = await fetch('/api/admin/restore-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Самоисцеление завершено! Восстановлено листов: ${data.restoredCount}`);
      } else {
        toast.error(`Ошибка: ${data.error}`);
      }
    } catch (err) {
      toast.error(`Сбой связи: ${err.message}`);
    } finally {
      setIsRestoringSheets(false);
    }
  };

  // Загрузка актуальных настроек ИИ из базы Google Sheets
  const fetchAiSettings = async () => {
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_ai_settings', force: true })
      });
      const data = await res.json();
      if (data.success) {
        setAiSettings({
          aiMode: data.aiMode || 'copilot',
          geminiModel: data.geminiModel || 'gemini-3.6-flash',
          minPriceUsd: data.minPriceUsd || 180,
          systemPrompt: data.systemPrompt || ''
        });
      }
    } catch (e) { /* non-fatal */ }
  };

  useEffect(() => {
    fetchAiSettings();
  }, []);

  const handleToggleAiMode = async (newMode) => {
    setIsAiSaving(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_ai_settings',
          aiMode: newMode,
          minPriceUsd: aiSettings.minPriceUsd,
          geminiModel: aiSettings.geminiModel,
          systemPrompt: aiSettings.systemPrompt
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiSettings((prev) => ({ ...prev, aiMode: newMode }));
        toast.success(`Режим ИИ изменен на: ${newMode.toUpperCase()}`);
      } else {
        toast.error('Не удалось сохранить режим ИИ');
      }
    } catch (e) {
      toast.error('Ошибка сохранения режима ИИ: ' + e.message);
    } finally {
      setIsAiSaving(false);
    }
  };

  const [form, setForm] = useState({
    basePrice: globalRules.basePrice !== undefined ? globalRules.basePrice : 250,
    currency: globalRules.currency || 'USD',
    minNights: globalRules.minNights || 3,
    maxNights: globalRules.maxNights || 30,
    bookingWindowMonths: globalRules.bookingWindowMonths || 18,
    advanceNoticeDays: globalRules.advanceNoticeDays !== undefined ? globalRules.advanceNoticeDays : 2,
    bookingMode: globalRules.bookingMode || 'instant',
    checkInTime: globalRules.checkInTime || '16:00',
    checkOutTime: globalRules.checkOutTime || '10:00'
  });

  // Синхронизация формы при асинхронной загрузке настроек из Google Sheets [CalendarSettings]
  useEffect(() => {
    if (globalRules && Object.keys(globalRules).length > 0) {
      setForm({
        basePrice: globalRules.basePrice !== undefined ? globalRules.basePrice : 250,
        currency: globalRules.currency || 'USD',
        minNights: globalRules.minNights !== undefined ? globalRules.minNights : 3,
        maxNights: globalRules.maxNights !== undefined ? globalRules.maxNights : 30,
        bookingWindowMonths: globalRules.bookingWindowMonths !== undefined ? globalRules.bookingWindowMonths : 18,
        advanceNoticeDays: globalRules.advanceNoticeDays !== undefined ? globalRules.advanceNoticeDays : 2,
        bookingMode: globalRules.bookingMode || 'instant',
        checkInTime: globalRules.checkInTime || '16:00',
        checkOutTime: globalRules.checkOutTime || '10:00'
      });
    }
  }, [globalRules]);

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
          <h3 className="text-lg font-bold text-white">{t('villaBaseParamsTitle')}</h3>
          <p className="text-xs text-slate-400">
            {t('villaBaseParamsDesc')}
          </p>
        </div>
      </div>

      {/* ПАНЕЛЬ УПРАВЛЕНИЯ ИИ-АГЕНТОМ GEMINI В 1 КЛИК */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>ИИ-Консьерж & Gemini 3.6 Flash</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {aiSettings.aiMode.toUpperCase()}
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Переключение режима работы ИИ в 1 клик со сквозной синхронизацией в Google Таблице и Telegram
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
            <button
              type="button"
              disabled={isAiSaving}
              onClick={() => handleToggleAiMode('autopilot')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                aiSettings.aiMode === 'autopilot'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🚀 Автопилот</span>
            </button>
            <button
              type="button"
              disabled={isAiSaving}
              onClick={() => handleToggleAiMode('copilot')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                aiSettings.aiMode === 'copilot'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>💡 Суфлер</span>
            </button>
            <button
              type="button"
              disabled={isAiSaving}
              onClick={() => handleToggleAiMode('off')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                aiSettings.aiMode === 'off'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⏸️ Выкл</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 text-xs text-slate-300">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Модель Gemini:</span>
            <span className="font-semibold text-purple-300">{aiSettings.geminiModel}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Минимальный тариф:</span>
            <span className="font-semibold text-emerald-400">{aiSettings.minPriceUsd} USD / ночь</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">База Знаний:</span>
            <span className="font-semibold text-blue-300">14 шаблонов + 5 листов Таблицы</span>
          </div>
        </div>
      </div>

      {/* Карточка самоисцеления и восстановления листов Google Sheets */}
      <div className="bg-slate-900/70 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Самоисцеление Google Sheets: 15 листов</h3>
              <p className="text-xs text-slate-400 mt-0.5">Восстановить любые удаленные вкладки, структуру, формулы и эталонные данные</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRestoreSheets}
              disabled={isRestoringSheets || isSavingMasterSeed}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isRestoringSheets ? 'Восстановление...' : '🛠️ Восстановить листы в 1 клик'}
            </button>
            <button
              type="button"
              onClick={handleSaveMasterSeed}
              disabled={isSavingMasterSeed || isRestoringSheets}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isSavingMasterSeed ? 'Фиксация эталона...' : '💾 Зафиксировать эталон SSOT'}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Базовая цена */}
        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {t('baseNightPriceLabel')}
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
            {t('mainCurrencyLabel')}
          </label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-white/10 p-3 rounded-xl text-sm font-bold text-white outline-none"
          >
            <option value="USD">USD [$]</option>
            <option value="EUR">EUR [€]</option>
            <option value="RUB">RUB [₽]</option>
            <option value="TRY">TRY [₺]</option>
          </select>
        </div>

        {/* Минимальный срок проживания */}
        <div>
          <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
            {t('minStayNightsLabel')}
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
            {t('maxStayNightsLabel')}
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
            <Calendar className="w-3.5 h-3.5 text-blue-400" /> {t('bookingWindowLabel')}
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
            {t('advanceNoticeDaysLabel')}
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
            <Clock className="w-3.5 h-3.5 text-amber-400" /> {t('standardCheckInLabel')}
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
            <Clock className="w-3.5 h-3.5 text-amber-400" /> {t('standardCheckOutLabel')}
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
            {t('defaultBookingModeLabel')}
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
              <span className="font-bold text-xs">⚡ {t('instantBookingOption')}</span>
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
              <span className="font-bold text-xs">✋ {t('manualBookingOption')}</span>
            </label>
          </div>
        </div>

        <div className="sm:col-span-2 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={async () => {
              try {
                toast.info(t('syncingWithSheetsToast'));
                const res = await fetch('/api/content?force=true', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                  toast.success(t('syncSuccessToast'));
                } else {
                  toast.warn(t('syncCacheToast'));
                }
              } catch (e) {
                toast.error(t('syncErrorToast') + ': ' + e.message);
              }
            }}
            className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all border border-white/10 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-rose-400" />
            <span>{t('syncGoogleSheetsBtn')}</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-500/25 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {t('saveSettingsBtn')}
          </button>
        </div>

      </form>
    </div>
  );
}

