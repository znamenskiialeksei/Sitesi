// components/Modals/VerificationModal.js - Модальное окно подтверждения Email или Телефона гостя
// [КЛАСТЕР: AUTH_VERIFICATION] [SSOT: GEMINI.md]

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, ShieldCheck, X, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Edit3 } from 'lucide-react';
import { useLanguage } from '../../utils/language';

export default function VerificationModal({
  isOpen,
  onClose,
  targetChannel = 'email', // 'email' или 'phone'
  guestData = {},
  onSuccess
}) {
  const { t } = useLanguage();
  const [channel, setChannel] = useState(targetChannel || 'email');
  const [currentContact, setCurrentContact] = useState('');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [tempContactInput, setTempContactInput] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isDone, setIsDone] = useState(false);
  const [devCode, setDevCode] = useState(null);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Инициализация при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      const activeChan = targetChannel === 'phone' ? 'phone' : 'email';
      setChannel(activeChan);
      const initialContact = activeChan === 'email'
        ? (guestData.email || '').trim()
        : (guestData.phone || '').trim();
      setCurrentContact(initialContact);
      setTempContactInput(initialContact);
      setOtpDigits(['', '', '', '']);
      setErrorMessage('');
      setAttemptsLeft(3);
      setIsDone(false);
      setDevCode(null);
      setIsEditingContact(!initialContact);

      if (initialContact) {
        sendCode(activeChan, initialContact);
      }
    }
  }, [isOpen, targetChannel, guestData.email, guestData.phone]);

  // Таймер обратного отсчета для повторной отправки
  useEffect(() => {
    let timer = null;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, countdown]);

  // Автофокус на первом поле ввода
  useEffect(() => {
    if (isOpen && !isEditingContact && !isDone) {
      setTimeout(() => {
        if (inputRefs[0]?.current) {
          inputRefs[0].current.focus();
        }
      }, 150);
    }
  }, [isOpen, isEditingContact, isDone]);

  if (!isOpen) return null;

  // Отправка проверочного кода на сервер
  const sendCode = async (targetChan, targetVal) => {
    const effChan = targetChan || channel;
    const effContact = (targetVal || currentContact || '').trim();

    if (!effContact) {
      setErrorMessage(
        effChan === 'email'
          ? 'Пожалуйста, укажите адрес электронной почты.'
          : 'Пожалуйста, укажите номер телефона.'
      );
      setIsEditingContact(true);
      return;
    }

    setIsSending(true);
    setErrorMessage('');
    setOtpDigits(['', '', '', '']);
    setCountdown(60);

    try {
      const payload = {
        action: 'send_verification_code',
        channel: effChan,
        target: effContact,
        name: guestData.name || 'Гость'
      };

      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.error || 'Не удалось отправить проверочный код. Попробуйте снова.');
      } else {
        if (data.devCode) {
          setDevCode(data.devCode);
        } else {
          setDevCode(null);
        }
      }
    } catch (err) {
      setErrorMessage('Сетевой сбой при отправке кода. Проверьте соединение.');
    } finally {
      setIsSending(false);
    }
  };

  // Сохранение нового контакта при редактировании
  const handleSaveContact = (e) => {
    e.preventDefault();
    const clean = tempContactInput.trim();
    if (!clean) return;

    if (channel === 'email' && !/\S+@\S+\.\S+/.test(clean)) {
      setErrorMessage('Пожалуйста, укажите корректный email.');
      return;
    }
    if (channel === 'phone' && clean.replace(/\D/g, '').length < 6) {
      setErrorMessage('Пожалуйста, укажите действующий номер телефона.');
      return;
    }

    setCurrentContact(clean);
    setIsEditingContact(false);
    sendCode(channel, clean);
  };

  // Быстрая вставка тестового проверочного кода при отладке
  const handleInsertDevCode = () => {
    if (!devCode) return;
    const digits = devCode.toString().split('').slice(0, 4);
    setOtpDigits(digits);
    if (digits.length === 4) {
      verifyCode(digits.join(''));
    }
  };

  // Обработка ввода цифр
  const handleDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = '';
      setOtpDigits(nextDigits);
      return;
    }

    const digit = cleanVal.slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);
    setErrorMessage('');

    if (index < 3 && digit) {
      inputRefs[index + 1]?.current?.focus();
    }

    if (index === 3 || nextDigits.every((d) => d !== '')) {
      const fullCode = nextDigits.join('');
      if (fullCode.length === 4) {
        verifyCode(fullCode);
      }
    }
  };

  // Обработка клавиши Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  // Поддержка Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pastedData) return;

    const nextDigits = ['', '', '', ''];
    for (let i = 0; i < pastedData.length; i++) {
      nextDigits[i] = pastedData[i];
    }
    setOtpDigits(nextDigits);

    if (pastedData.length === 4) {
      verifyCode(pastedData);
    } else if (inputRefs[pastedData.length]) {
      inputRefs[pastedData.length].current?.focus();
    }
  };

  // Валидация кода на сервере
  const verifyCode = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 4) {
      setErrorMessage('Пожалуйста, введите полный 4-значный проверочный код.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_code',
          channel,
          target: currentContact,
          code
        })
      });
      const data = await res.json();

      if (data.success) {
        setIsDone(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess({
              channel,
              emailVerified: channel === 'email',
              phoneVerified: channel === 'phone',
              email: channel === 'email' ? currentContact : guestData.email,
              phone: channel === 'phone' ? currentContact : guestData.phone
            });
          }
        }, 500);
      } else {
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);
        if (remaining <= 0) {
          setErrorMessage('Превышен лимит попыток. Запросите новый код через 60 секунд.');
          setOtpDigits(['', '', '', '']);
        } else {
          setErrorMessage(
            data.error ||
              `${t('verifyInvalidCode') || 'Неверный проверочный код.'} - ${t('verifyAttemptsLeft') || 'Осталось попыток:'} ${remaining}`
          );
        }
      }
    } catch (err) {
      setErrorMessage('Ошибка проверки кода. Попробуйте еще раз.');
    } finally {
      setIsVerifying(false);
    }
  };

  const isEmail = channel === 'email';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/20 text-slate-100 flex flex-col">
        {/* Кнопка закрытия */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Заголовок и иконка */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            {isEmail ? <Mail className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              {isEmail ? 'Подтверждение Email' : 'Подтверждение телефона'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEmail
                ? 'Проверочный код отправлен на вашу почту'
                : 'Проверочный код для защиты контакта'}
            </p>
          </div>
        </div>

        {/* Экран завершения проверки */}
        {isDone ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isEmail ? 'Email успешно подтвержден!' : 'Телефон успешно подтвержден!'}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Контактные данные зафиксированы в вашем профиле гостя.
            </p>
          </div>
        ) : (
          <>
            {/* Описание текущего контакта и возможность отредактировать */}
            {isEditingContact ? (
              <form onSubmit={handleSaveContact} className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 mb-5">
                <label className="text-xs text-slate-400 block mb-2 font-medium">
                  {isEmail ? 'Укажите адрес электронной почты:' : 'Укажите номер телефона:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type={isEmail ? 'email' : 'tel'}
                    value={tempContactInput}
                    onChange={(e) => setTempContactInput(e.target.value)}
                    placeholder={isEmail ? 'guest@example.com' : '+7 999 123-45-67'}
                    className="flex-1 bg-slate-900 border border-white/20 p-2.5 rounded-xl text-xs sm:text-sm text-white focus:border-rose-500 outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Отправить
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 mb-5 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    {isEmail ? <Mail className="w-3.5 h-3.5 text-rose-400" /> : <Phone className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{isEmail ? 'Код отправлен на почту:' : 'Код для номера:'}</span>
                  </div>
                  <div className="font-bold text-sm text-white tracking-wide break-all">
                    {currentContact}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingContact(true)}
                  className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                  title="Изменить адрес или номер"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Тестовый режим отладки : при ненастроенном шлюзе */}
            {devCode && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col gap-2 text-xs text-amber-300 mb-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-200">Отладка : код подтверждения</span>
                  <span className="font-mono font-bold text-amber-100 text-sm tracking-widest">{devCode}</span>
                </div>
                <button
                  type="button"
                  onClick={handleInsertDevCode}
                  className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-amber-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Вставить проверочный код {devCode}</span>
                </button>
              </div>
            )}

            {/* 4 раздельных инпута для OTP кода */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-5" onPaste={handlePaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  disabled={isVerifying || isSending || isEditingContact}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border outline-none transition-all ${
                    digit
                      ? 'border-rose-500 bg-rose-500/10 text-rose-300 shadow-lg shadow-rose-500/20'
                      : 'border-white/10 bg-slate-950/80 text-white focus:border-rose-500/60 focus:bg-slate-900'
                  } disabled:opacity-50`}
                />
              ))}
            </div>

            {/* Сообщение об ошибке */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-xs text-rose-300 mb-4">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Кнопка отправки / подтверждения */}
            <button
              type="button"
              disabled={isVerifying || otpDigits.join('').length !== 4 || isEditingContact}
              onClick={() => verifyCode()}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-[0.99] transition-all shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('verifyVerifyingBtn') || 'Проверка кода...'}</span>
                </>
              ) : (
                <>
                  <span>{t('verifySubmitBtn') || 'Подтвердить код'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Таймер повторной отправки */}
            <div className="text-center text-xs text-slate-400">
              {countdown > 0 ? (
                <span>
                  {t('verifyResendIn') || 'Повторить отправку через:'}{' '}
                  <span className="font-semibold text-slate-200">{countdown} сек</span>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isSending || isEditingContact}
                  onClick={() => sendCode(channel, currentContact)}
                  className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4 flex items-center justify-center gap-1.5 mx-auto transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                  <span>{t('verifyResendBtn') || 'Отправить код повторно'}</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
