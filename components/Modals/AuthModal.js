// ==============================================================================
// МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ И РЕГИСТРАЦИИ (AUTH MODAL)
// Файл: components/Modals/AuthModal.js
// Назначение: Вход гостя/владельца, быстрая регистрация без перезагрузки страницы
// ==============================================================================

import React, { useState } from 'react';
import { X, Lock, User, Phone, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import { useLanguage } from '../../utils/language';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, register } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();

  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        const res = await login(contact, password);
        if (res.success) {
          if (res.requires2FA) {
            toast.info('Требуется подтверждение 2FA кода безопасности.');
            setAuthModalOpen(false);
          } else {
            toast.success(`С возвращением!`);
            setAuthModalOpen(false);
          }
        } else {
          toast.error(t(res.error || 'error_invalid_login'));
        }
      } else {
        if (!name.trim()) {
          toast.warn('Пожалуйста, введите ваше имя.');
          setLoading(false);
          return;
        }
        const res = await register(name, contact, password);
        if (res.success) {
          toast.success(`Добро пожаловать, ${name}! Аккаунт успешно создан.`);
          setAuthModalOpen(false);
        } else {
          toast.error(t(res.error || 'error_registration'));
        }
      }
    } catch (err) {
      toast.error('Сетевая ошибка при авторизации.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Кнопка закрытия */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Переключатель Вход / Регистрация */}
        <div className="flex border-b border-white/10 mb-6 pb-2">
          <button
            onClick={() => setAuthModalTab('login')}
            className={`pb-2 px-4 text-sm font-bold transition-all border-b-2 ${
              authModalTab === 'login'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('login')}
          </button>
          <button
            onClick={() => setAuthModalTab('register')}
            className={`pb-2 px-4 text-sm font-bold transition-all border-b-2 ${
              authModalTab === 'register'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('register')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
                Имя и Фамилия
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full bg-slate-800/80 border border-white/10 pl-11 pr-4 py-3 rounded-2xl text-sm text-white focus:border-rose-500 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
              Телефон или Telegram (@username)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+7... или @username"
                className="w-full bg-slate-800/80 border border-white/10 pl-11 pr-4 py-3 rounded-2xl text-sm text-white focus:border-rose-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-white/10 pl-11 pr-4 py-3 rounded-2xl text-sm text-white focus:border-rose-500 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              'Обработка...'
            ) : authModalTab === 'login' ? (
              <>
                <LogIn className="w-4 h-4" /> {t('login')}
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> {t('register')}
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

