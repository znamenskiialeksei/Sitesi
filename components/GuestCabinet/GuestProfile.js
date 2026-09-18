// ==============================================================================
// ВКЛАДКА «ПРОФИЛЬ И НАСТРОЙКИ» В КАБИНЕТЕ ПУТЕШЕСТВЕННИКА
// Файл: components/GuestCabinet/GuestProfile.js
// Назначение: Персональные данные гостя, предпочтения языка/валюты, выход
// ==============================================================================

import React from 'react';
import { User, Phone, Globe, DollarSign, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';

export default function GuestProfile() {
  const { currentUser, logout } = useAuth();
  const { lang, changeLanguage, currency, changeCurrency, t } = useLanguage();
  const toast = useToast();

  const handleLogoutClick = () => {
    logout();
    toast.info('Вы успешно вышли из аккаунта.');
  };

  return (
    <div className="bg-slate-800/80 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl fade-in space-y-8">
      
      <div className="flex items-center gap-4 pb-6 border-b border-white/10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
          {currentUser?.name?.charAt(0).toUpperCase() || 'G'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{currentUser?.name || 'Путешественник'}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{currentUser?.contact}</p>
          <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Аккаунт подтвержден
          </span>
        </div>
      </div>

      {/* Настройки языка и валюты */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Предпочтения отображения
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-400" /> Язык интерфейса
            </span>
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 p-2.5 rounded-xl text-xs font-bold text-white outline-none"
            >
              <option value="ru">Русский (RU)</option>
              <option value="en">English (EN)</option>
              <option value="tr">Türkçe (TR)</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Основная валюта
            </span>
            <select
              value={currency}
              onChange={(e) => changeCurrency(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 p-2.5 rounded-xl text-xs font-bold text-white outline-none"
            >
              <option value="RUB">Рубли (RUB • ₽)</option>
              <option value="EUR">Евро (EUR • €)</option>
              <option value="TRY">Турецкая лира (TRY • ₺)</option>
              <option value="USD">Доллар США (USD • $)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Кнопка выхода */}
      <div className="pt-6 border-t border-white/10 flex justify-end">
        <button
          onClick={handleLogoutClick}
          className="px-6 py-3 rounded-2xl bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-red-500/20 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> {t('logout')}
        </button>
      </div>

    </div>
  );
}

