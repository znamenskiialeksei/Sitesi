// ==============================================================================
// МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ И РЕГИСТРАЦИИ [AUTH MODAL]
// Файл: components/Modals/AuthModal.js
// Назначение: Вход гостя и владельца, регистрация с двухфакторной верификацией
// почты и телефона в зависимости от глобальных настроек [progressive / strict]
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { X, Lock, User, Phone, Mail, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import { useLanguage } from '../../utils/language';
import VerificationModal from './VerificationModal';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, register } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();

  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Режим верификации [progressive: только email, strict: email + phone]
  const [verificationMode, setVerificationMode] = useState('progressive');
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  // Загрузка глобального режима верификации из настроек
  useEffect(() => {
    fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_settings' })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.globalRules?.verificationMode) {
          setVerificationMode(data.globalRules.verificationMode);
        }
      })
      .catch(() => {});
  }, []);

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
            toast.success('С возвращением!');
            setAuthModalOpen(false);
          }
        } else {
          toast.error(t(res.error || 'error_invalid_login'));
        }
      } else {
        // Проверка полей регистрации
        if (!name.trim()) {
          toast.warn('Пожалуйста, введите ваше имя.');
          setLoading(false);
          return;
        }

        const emailTrimmed = email.trim();
        if (!emailTrimmed || !emailTrimmed.includes('@')) {
          toast.warn('Пожалуйста, укажите корректный Email адрес.');
          setLoading(false);
          return;
        }

        const phoneTrimmed = phone.trim();
        if (verificationMode === 'strict' && !phoneTrimmed) {
          toast.warn('В строгом режиме требуется указать номер телефона.');
          setLoading(false);
          return;
        }

        if (!password || password.length < 4) {
          toast.warn('Пароль должен содержать не менее 4 символов.');
          setLoading(false);
          return;
        }

        // Запуск верификации почты и телефона перед созданием аккаунта
        setIsVerifyOpen(true);
      }
    } catch (err) {
      toast.error('Сетевая ошибка при авторизации.');
    } finally {
      setLoading(false);
    }
  };

  // Коллбэк успешного прохождения верификации OTP-кодов
  const handleVerifySuccess = async (verifiedPayload) => {
    setIsVerifyOpen(false);
    setLoading(true);
    try {
      const primaryContact = email.trim() || phone.trim();
      const res = await register(name, primaryContact, password);
      if (res.success) {
        toast.success(`Добро пожаловать, ${name}! Аккаунт успешно создан и верифицирован.`);
        setAuthModalOpen(false);
      } else {
        toast.error(t(res.error || 'error_registration'));
      }
    } catch (err) {
      toast.error('Ошибка сохранения учетной записи после верификации.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            
            {/* Поля регистрации: Имя, Email, Телефон, Пароль */}
            {authModalTab === 'register' ? (
              <>
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

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
                    Электронная почта [Email]
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="w-full bg-slate-800/80 border border-white/10 pl-11 pr-4 py-3 rounded-2xl text-sm text-white focus:border-rose-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
                    Телефон {verificationMode === 'strict' ? '[Обязательно]' : '[Опционально]'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required={verificationMode === 'strict'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+79991234567"
                      className="w-full bg-slate-800/80 border border-white/10 pl-11 pr-4 py-3 rounded-2xl text-sm text-white focus:border-rose-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Поля входа: Логин / Контакт и Пароль */
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
                  Телефон, Email или Telegram [@username]
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+7... или email@domain.com"
                    className="w-full bg-slate-800/80 border border-white/10 pl-11 pr-4 py-3 rounded-2xl text-sm text-white focus:border-rose-500 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

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

      {/* Модальное окно подтверждения Email и Телефона гостя */}
      <VerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        mode={verificationMode}
        guestData={{ name: name.trim(), email: email.trim(), phone: phone.trim() }}
        onSuccess={handleVerifySuccess}
      />
    </>
  );
}
