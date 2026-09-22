// components/Modals/VerificationModal.js - Модальное окно подтверждения Email и Телефона гостя
// [КЛАСТЕР: AUTH_VERIFICATION] [SSOT: GEMINI.md]

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, ShieldCheck, X, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../utils/language';

export default function VerificationModal({
  isOpen,
  onClose,
  mode = 'progressive', // 'progressive' (по умолчанию: только Email) или 'strict' (Email + Телефон)
  guestData = {},
  onSuccess
}) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState('email'); // 'email' | 'phone' | 'done'
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [devCode, setDevCode] = useState(null);
  const [telegramSent, setTelegramSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Сброс и отправка первого кода при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('email');
      setOtpDigits(['', '', '', '']);
      setErrorMessage('');
      setAttemptsLeft(3);
      setEmailVerified(false);
      setPhoneVerified(false);
      setDevCode(null);
      setTelegramSent(false);
      setEmailSent(false);
      sendCode('email');
    }
  }, [isOpen]);

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

  // Фокус на первом поле ввода при смене шага
  useEffect(() => {
    if (isOpen && (currentStep === 'email' || currentStep === 'phone')) {
      setTimeout(() => {
        if (inputRefs[0]?.current) {
          inputRefs[0].current.focus();
        }
      }, 150);
    }
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  // Отправка проверочного кода на сервер
  const sendCode = async (channel) => {
    setIsSending(true);
    setErrorMessage('');
    setOtpDigits(['', '', '', '']);
    setCountdown(60);

    try {
      const payload = {
        action: 'send_verification_code',
        channel, // 'email' или 'phone'
        target: channel === 'email' ? guestData.email : guestData.phone,
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
        setTelegramSent(Boolean(data.telegramSent));
        setEmailSent(Boolean(data.emailSent));
      }
    } catch (err) {
      setErrorMessage('Сетевой сбой при отправке кода. Проверьте соединение.');
    } finally {
      setIsSending(false);
    }
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

    // Автоматический переход к следующему полю
    if (index < 3 && digit) {
      inputRefs[index + 1]?.current?.focus();
    }

    // Если заполнены все 4 цифры — автоматически инициируем проверку
    if (index === 3 || nextDigits.every((d) => d !== '')) {
      const fullCode = nextDigits.join('');
      if (fullCode.length === 4) {
        verifyCode(fullCode);
      }
    }
  };

  // Обработка клавиши Backspace для плавного удаления
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  // Поддержка быстрой вставки из буфера обмена (Paste)
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
      const target = currentStep === 'email' ? guestData.email : guestData.phone;
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_code',
          channel: currentStep,
          target,
          code
        })
      });
      const data = await res.json();

      if (data.success) {
        if (currentStep === 'email') {
          setEmailVerified(true);
          // Если режим прогрессивный (по умолчанию) — сразу завершаем верификацию!
          if (mode === 'progressive') {
            setCurrentStep('done');
            setTimeout(() => {
              if (onSuccess) {
                onSuccess({
                  emailVerified: true,
                  phoneVerified: false,
                  email: guestData.email,
                  phone: guestData.phone
                });
              }
            }, 600);
          } else {
            // Если режим строгий — переходим ко второму шагу (Телефон)
            setCurrentStep('phone');
            setOtpDigits(['', '', '', '']);
            setCountdown(60);
            sendCode('phone');
          }
        } else if (currentStep === 'phone') {
          setPhoneVerified(true);
          setCurrentStep('done');
          setTimeout(() => {
            if (onSuccess) {
              onSuccess({
                emailVerified: true,
                phoneVerified: true,
                email: guestData.email,
                phone: guestData.phone
              });
            }
          }, 600);
        }
      } else {
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);
        if (remaining <= 0) {
          setErrorMessage('Превышен лимит попыток. Запросите новый код через 60 секунд.');
          setOtpDigits(['', '', '', '']);
        } else {
          setErrorMessage(
            data.error ||
              `${t('verifyInvalidCode') || 'Неверный проверочный код.'} - ${t('verifyAttemptsLeft') || 'Осталось:'} ${remaining}`
          );
        }
      }
    } catch (err) {
      setErrorMessage('Ошибка проверки кода. Попробуйте еще раз.');
    } finally {
      setIsVerifying(false);
    }
  };

  const isStrict = mode === 'strict';

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
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              {t('verifyModalTitle') || 'Подтверждение бронирования'}
            </h3>
            <p className="text-xs text-slate-400">
              {isStrict
                ? 'Двухэтапная защита контактов виллы'
                : 'Быстрое подтверждение почты для защиты брони'}
            </p>
          </div>
        </div>

        {/* Индикатор шагов для строгого режима */}
        {isStrict && (
          <div className="grid grid-cols-2 gap-2 mb-6 text-xs font-semibold">
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                currentStep === 'email' || emailVerified
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t('verifyStepEmail') || '1. Email'}</span>
              {emailVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
            </div>
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                currentStep === 'phone' || phoneVerified
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('verifyStepPhone') || '2. Телефон'}</span>
              {phoneVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
            </div>
          </div>
        )}

        {/* Экран завершения проверки */}
        {currentStep === 'done' ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">
              {t('verifySuccess') || 'Контакты успешно подтверждены!'}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Оформляем бронирование и подготавливаем ваш персональный диалог с хозяином...
            </p>
          </div>
        ) : (
          <>
            {/* Описание текущего шага */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 mb-6 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                {currentStep === 'email' ? <Mail className="w-4 h-4 text-rose-400" /> : <Phone className="w-4 h-4 text-rose-400" />}
                <span>
                  {currentStep === 'email'
                    ? t('verifyEmailSentDesc') || 'Код подтверждения отправлен на почту:'
                    : t('verifyPhoneSentDesc') || 'Код подтверждения отправлен на номер:'}
                </span>
              </div>
              <div className="font-bold text-sm text-white tracking-wide break-all">
                {currentStep === 'email' ? guestData.email : guestData.phone}
              </div>
            </div>

            {/* Уведомление о дублировании кода в Telegram */}
            {telegramSent && (
              <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-xl flex items-center gap-2 text-xs text-sky-300 mb-4">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Код также успешно отправлен владельцу виллы в Telegram</span>
              </div>
            )}

            {/* Тестовый режим при отсутствии внешнего почтового шлюза : только в среде разработки */}
            {process.env.NODE_ENV !== 'production' && devCode && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col gap-2 text-xs text-amber-300 mb-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-200">Тестовый режим : шлюз в .env.local еще не задан</span>
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

            {/* 4 раздельных инпута для OTP кода с поддержкой автозаполнения на смартфонах */}
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
                  disabled={isVerifying || isSending}
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
              disabled={isVerifying || otpDigits.join('').length !== 4}
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
                  disabled={isSending}
                  onClick={() => sendCode(currentStep)}
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
