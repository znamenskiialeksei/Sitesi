// ==============================================================================
// ПЛАВАЮЩИЙ ВИДЖЕТ БРОНИРОВАНИЯ В СТИЛЕ AIRBNB (STICKY BOOKING WIDGET)
// Файл: components/BookingWidget.js
// Назначение: Выбор дат, подсчёт гостей, динамический расчёт стоимости, 24ч HOLD
// Кастомный 2-месячный интерактивный календарь по образцу стартового проекта
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// Импорт date-fns утилит для кастомного рендера календаря (без react-datepicker)
import {
  addMonths, addDays, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, format,
  differenceInDays
} from 'date-fns';
import { ru, enUS, tr } from 'date-fns/locale';
import {
  Calendar, Users, Zap, Clock, ShieldCheck,
  ChevronDown, ChevronLeft, ChevronRight, Plus, Minus, AlertCircle,
  Mail, Phone, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../utils/language';
import { useAuth } from '../context/AuthContext';
import { useLegalConsent } from '../context/LegalConsentContext';
import LegalConsentCheckboxes from './LegalConsentCheckboxes';
import VerificationModal from './Modals/VerificationModal';
import { useToast } from './Toast';
import { calculateNights, formatDateRU, parseDateRU, isSameDay, isDateInRange } from '../utils/dates';

// Вспомогательная функция безопасного сравнения дат (поддерживает Date, строки YYYY-MM-DD, DD.MM.YYYY)
const isSameDayHelper = (a, b) => {
  if (!a || !b) return false;
  let dateA = a;
  let dateB = b;
  if (typeof a === 'string') {
    if (a.includes('.')) {
      const p = a.split('.');
      if (p.length === 3) dateA = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
    } else if (a.includes('-')) {
      const p = a.split('-');
      if (p.length === 3) dateA = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
    } else {
      dateA = new Date(a);
    }
  }
  if (typeof b === 'string') {
    if (b.includes('.')) {
      const p = b.split('.');
      if (p.length === 3) dateB = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
    } else if (b.includes('-')) {
      const p = b.split('-');
      if (p.length === 3) dateB = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
    } else {
      dateB = new Date(b);
    }
  }
  if (!(dateA instanceof Date) || isNaN(dateA.getTime())) return false;
  if (!(dateB instanceof Date) || isNaN(dateB.getTime())) return false;
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

export default function BookingWidget({
  dynamicRules = {},
  dateRules = [],
  occupiedDates = [],
  apiEvents = [],
  onBookingSubmit
}) {
  const { t, lang, currency, formatMoney, CURRENCY_SYMBOLS } = useLanguage();
  const { currentUser, setAuthModalOpen, updateCurrentUser } = useAuth();
  const toast = useToast();

  // Выбранный диапазон дат гостем
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Текущий месяц отображения в кастомном календаре
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  // Синхронизация полей гостя с профилем currentUser (включая неполные профили из быстрого чата)
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !guestName) setGuestName(currentUser.name);
      if (currentUser.email && !guestEmail) setGuestEmail(currentUser.email);
      if (currentUser.phone && !guestPhone) setGuestPhone(currentUser.phone);
      if (!guestEmail && currentUser.contact && currentUser.contact.includes('@')) {
        setGuestEmail(currentUser.contact);
      }
      if (!guestPhone && currentUser.contact && !currentUser.contact.includes('@')) {
        setGuestPhone(currentUser.contact);
      }
    }
  }, [currentUser]);

  // Расчет статуса подтверждения контактов гостя
  const verificationMode = dynamicRules.verificationMode || 'progressive';
  const isEmailVerified = Boolean(
    currentUser?.emailVerified &&
    currentUser?.email &&
    guestEmail &&
    currentUser.email.trim().toLowerCase() === guestEmail.trim().toLowerCase()
  );
  const isPhoneVerified = Boolean(
    currentUser?.phoneVerified &&
    currentUser?.phone &&
    guestPhone &&
    currentUser.phone.replace(/\D/g, '') === guestPhone.replace(/\D/g, '')
  );
  const isFullyVerified = verificationMode === 'strict'
    ? (isEmailVerified && isPhoneVerified)
    : isEmailVerified;

  const { agreedKVKK, agreedContract, agreedPrivacy, allAgreed } = useLegalConsent();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calendarRef = useRef(null);
  const guestPickerRef = useRef(null);

  // Минимально допустимая дата — сегодня
  const safeMinDate = new Date();
  safeMinDate.setHours(0, 0, 0, 0);

  // Базовые параметры бронирования виллы, установленные хозяином в CalendarSettings
  const villaCurrency = dynamicRules.currency || 'RUB';
  const basePrice = Number(dynamicRules.basePrice) || 15000;
  const maxTotalGuests = 10;
  const totalGuests = adults + children;

  // Форматирование стоимости виллы с конвертацией из базовой валюты виллы (villaCurrency) в выбранную гостем (currency)
  const formatVillaMoney = (amount) => {
    return formatMoney(amount, currency, villaCurrency);
  };

  // Закрытие выпадающих меню при клике снаружи
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setIsCalendarOpen(false);
      if (guestPickerRef.current && !guestPickerRef.current.contains(e.target)) setIsGuestPickerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Проверка ручной блокировки дат из Google Таблицы (CalendarSettings)
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

  // Получение цены для конкретного дня с гарантией числового значения (в валюте виллы villaCurrency)
  const getPriceForDate = (date) => {
    if (!date) return basePrice;
    if (!dateRules || !Array.isArray(dateRules)) return basePrice;
    for (let i = dateRules.length - 1; i >= 0; i--) {
      const rule = dateRules[i];
      const rS = parseDateRU(rule.start);
      const rE = parseDateRU(rule.end);
      if (isDateInRange(date, rS, rE)) {
        if (rule.type === 'Цена') {
          const val = Number(rule.value);
          if (!isNaN(val) && val > 0) {
            return val;
          }
          return basePrice;
        }
        if (rule.type === 'Сброс цены') return basePrice;
      }
    }
    return basePrice;
  };

  // Получение минимального срока проживания для даты (с приоритетом последних правил)
  const getMinNightsForDate = (date) => {
    const defaultMin = dynamicRules.minNights || 3;
    if (!date) return defaultMin;
    if (!dateRules || !Array.isArray(dateRules)) return defaultMin;
    for (let i = dateRules.length - 1; i >= 0; i--) {
      const rule = dateRules[i];
      const rS = parseDateRU(rule.start);
      const rE = parseDateRU(rule.end);
      if (isDateInRange(date, rS, rE)) {
        if (rule.type === 'Мин. дней') return parseInt(rule.value, 10) || defaultMin;
        if (rule.type === 'Сброс мин. дней') return defaultMin;
      }
    }
    return defaultMin;
  };

  // Определение режима бронирования (мгновенное или по запросу)
  const getBookingModeForRange = (sDate, eDate) => {
    const defaultMode = dynamicRules.bookingMode || 'instant';
    if (!sDate) return defaultMode;
    let isManual = false;
    let cur = new Date(sDate);
    const end = eDate ? new Date(eDate) : new Date(sDate);
    while (cur <= end) {
      if (dateRules && Array.isArray(dateRules)) {
        for (let i = dateRules.length - 1; i >= 0; i--) {
          const rule = dateRules[i];
          const rS = parseDateRU(rule.start);
          const rE = parseDateRU(rule.end);
          if (isDateInRange(cur, rS, rE)) {
            if (rule.type === 'Тип бронирования' || rule.type === 'Тип записи') {
              if (rule.value === 'manual') isManual = true;
              break;
            }
          }
        }
      }
      cur.setDate(cur.getDate() + 1);
    }
    return isManual ? 'manual' : defaultMode;
  };

  const nights = calculateNights(startDate, endDate);
  const minRequiredNights = startDate ? getMinNightsForDate(startDate) : (dynamicRules.minNights || 3);
  const isShortStay = nights > 0 && nights < minRequiredNights;
  const effectiveMode = isShortStay ? 'manual' : getBookingModeForRange(startDate, endDate);

  // Расчет итоговой стоимости за весь период проживания (в базовой валюте USD)
  const calculateTotal = () => {
    if (!startDate || !endDate || nights <= 0) return 0;
    let sum = 0;
    let cur = new Date(startDate);
    const end = new Date(endDate);
    while (cur < end) {
      sum += Number(getPriceForDate(cur)) || 0;
      cur.setDate(cur.getDate() + 1);
    }
    return Math.round(sum);
  };

  const totalPrice = calculateTotal();
  const activeNightPrice = startDate ? getPriceForDate(startDate) : basePrice;

  // Проверка занятых (недоступных) дат: объединяет ручные блокировки CRM и внешние iCal каналы
  const isOccupiedDate = (date) => {
    if (isManualBlocked(date)) return true;
    return occupiedDates.some((occ) => isSameDayHelper(occ, date));
  };

  // Обработка клика по дню кастомного календаря
  const handleGuestDayClick = (clickedDate) => {
    const checkDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
    if (checkDate < safeMinDate) return;

    if (!startDate || (startDate && endDate)) {
      if (isOccupiedDate(checkDate)) {
        const prevDay = addDays(checkDate, -1);
        if (isOccupiedDate(prevDay)) return;
      }
      setDateRange([checkDate, null]);
    } else {
      const sDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      if (checkDate <= sDate) {
        if (!isOccupiedDate(checkDate)) setDateRange([checkDate, null]);
        return;
      }
      let cur = new Date(sDate); cur.setDate(cur.getDate() + 1);
      let hasOverlap = false;
      while (cur < checkDate) {
        if (isOccupiedDate(cur)) { hasOverlap = true; break; }
        cur.setDate(cur.getDate() + 1);
      }
      if (hasOverlap) {
        toast.warn('Выбранный диапазон пересекается с занятыми датами.');
        return;
      }
      setDateRange([sDate, checkDate]);
      setIsCalendarOpen(false);
    }
  };

  // Кастомный рендер одного месяца в сетке
  const renderCalendarMonth = (monthDate) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const weekDayLabels = lang === 'en'
      ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
      : (lang === 'tr' ? ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'] : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']);
    const header = (
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDayLabels.map((wd, i) => (
          <div key={i} className="text-center text-[9px] text-slate-500 font-bold py-1 uppercase">{wd}</div>
        ))}
      </div>
    );

    const rows = [];
    let days = [];
    let day = startDateGrid;

    while (day <= endDateGrid) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const checkDate = new Date(cloneDay.getFullYear(), cloneDay.getMonth(), cloneDay.getDate());
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);
        const isOccupied = isOccupiedDate(checkDate);
        const isPast = checkDate < safeMinDate;

        let isSelected = false;
        let isInRange = false;
        let isCheckoutOnly = false;

        if (startDate && isSameDayHelper(checkDate, startDate)) isSelected = true;
        if (endDate && isSameDayHelper(checkDate, endDate)) isSelected = true;
        if (startDate && endDate && checkDate > startDate && checkDate < endDate) isInRange = true;

        if (isOccupied && !isPast) {
          const prevDay = addDays(checkDate, -1);
          if (!isOccupiedDate(prevDay)) isCheckoutOnly = true;
        }

        const currentMinNights = getMinNightsForDate(startDate || checkDate);
        let cellClass = 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-white/5';

        if (!isCurrentMonth) {
          cellClass = 'opacity-0 pointer-events-none';
        } else if (isPast) {
          cellClass = 'opacity-30 bg-slate-900 text-slate-500 cursor-not-allowed border border-transparent';
        } else if (isOccupied) {
          if (isCheckoutOnly) {
            if (startDate && checkDate > startDate) {
              cellClass = 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-white/5 border-l-red-500 border-l-2';
            } else {
              cellClass = 'opacity-50 bg-slate-900 text-red-300 cursor-not-allowed border border-transparent';
            }
          } else {
            cellClass = 'opacity-40 bg-slate-900 text-slate-500 cursor-not-allowed border border-transparent line-through';
          }
        }

        if (isSelected) {
          cellClass = '!bg-rose-600 !border-rose-400 !text-white shadow-[0_0_8px_rgba(225,29,72,0.5)] font-bold z-20 scale-105 rounded-xl';
        }
        if (isInRange) {
          cellClass = '!bg-rose-900/40 !border-rose-500/20 !text-rose-100 rounded-none';
        }

        if (startDate && !endDate && isCurrentMonth && !isPast && !isOccupied && checkDate > startDate) {
          const diff = differenceInDays(checkDate, startDate);
          if (diff < currentMinNights) {
            cellClass += ' !bg-yellow-500/10 border-dashed !border-yellow-500/50';
          }
        }

        const dayEvents = (apiEvents || []).filter(ev => {
          if (!ev || !ev.start) return false;
          const [sY, sM, sD] = ev.start.split('-').map(Number);
          const [eY, eM, eD] = (ev.end || ev.start).split('-').map(Number);
          const eS = new Date(sY, sM - 1, sD, 0, 0, 0);
          const eE = new Date(eY, eM - 1, eD, 23, 59, 59);
          return checkDate >= eS && checkDate <= eE;
        });

        const getChannelColor = (sourceId) => {
          switch (sourceId) {
            case 'airbnb': return 'bg-[#ff5a5f]';
            case 'booking': return 'bg-[#003580]';
            case 'vrbo': return 'bg-[#1f4172]';
            case 'avito': return 'bg-[#965cf4]';
            case 'agoda': return 'bg-[#58a618]';
            case 'google': return 'bg-[#4285f4]';
            default: return 'bg-slate-600';
          }
        };

        days.push(
          <div
            key={day.toISOString()}
            onClick={() => handleGuestDayClick(cloneDay)}
            className={`relative flex flex-col items-center justify-center w-full h-10 text-xs rounded-lg transition-all box-border overflow-hidden ${cellClass}`}
          >
            <span className="z-10 leading-none">{format(cloneDay, 'd')}</span>
            {isCurrentMonth && !isPast && !isOccupied && (
              <span className="text-[7px] text-slate-400 leading-none mt-0.5 font-medium truncate max-w-full px-0.5">
                {formatVillaMoney(getPriceForDate(checkDate))}
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-[1px] z-0 pointer-events-none opacity-80">
              {dayEvents.map((ev, idx) => {
                const [sY, sM, sD] = ev.start.split('-').map(Number);
                const [eY, eM, eD] = (ev.end || ev.start).split('-').map(Number);
                const eS = new Date(sY, sM - 1, sD);
                const eE = new Date(eY, eM - 1, eD);
                const isStart = isSameDayHelper(checkDate, eS);
                const isEnd = isSameDayHelper(checkDate, eE);
                if (isStart && isEnd) return null;
                const bgColor = getChannelColor(ev.sourceId);
                let widthClass = 'w-full';
                if (isStart) widthClass = 'w-1/2 ml-auto';
                else if (isEnd) widthClass = 'w-1/2 mr-auto';
                return <div key={idx} className={`h-1 ${bgColor} ${widthClass}`}></div>;
              })}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-0.5 mb-0.5" key={day.toISOString()}>{days}</div>
      );
      days = [];
    }

    const dateLocale = lang === 'en' ? enUS : (lang === 'tr' ? tr : ru);
    return (
      <div className="flex flex-col w-full">
        <div className="text-center font-bold text-white mb-3 capitalize text-sm">
          {format(monthStart, 'LLLL yyyy', { locale: dateLocale })}
        </div>
        {header}
        {rows}
      </div>
    );
  };

  // Обработка отправки формы бронирования
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.warn(t('datesNotSelected'));
      setIsCalendarOpen(true);
      return;
    }

    if (!allAgreed) {
      toast.warn(t('legalConsentContract') || 'Необходимо подтвердить все юридические согласия');
      return;
    }

    if (totalGuests > maxTotalGuests) {
      toast.error(`${t('maxGuestsError') || 'Максимальное количество гостей: '}${maxTotalGuests}`);
      return;
    }

    const finalName = guestName.trim() || currentUser?.name || 'Гость';
    const finalEmail = guestEmail.trim() || currentUser?.email || '';
    const finalPhone = guestPhone.trim() || currentUser?.phone || '';
    const combinedContact = finalPhone && finalEmail ? `${finalPhone} | ${finalEmail}` : (finalPhone || finalEmail || currentUser?.contact || '');

    // Обязательная проверка заполненности контактов для ВСЕХ пользователей
    if (!finalName) {
      toast.warn(t('contactNamePlaceholder') || 'Пожалуйста, укажите ваше имя');
      return;
    }
    if (!finalEmail || !/\S+@\S+\.\S+/.test(finalEmail)) {
      toast.warn(t('guestEmailPlaceholder') || 'Пожалуйста, укажите корректный адрес электронной почты');
      return;
    }
    if (!finalPhone || finalPhone.replace(/\D/g, '').length < 6) {
      toast.warn(t('guestPhonePlaceholder') || 'Пожалуйста, укажите действующий номер телефона');
      return;
    }

    const payload = {
      action: effectiveMode === 'manual' ? 'request_booking' : 'booking',
      name: finalName,
      contact: combinedContact,
      email: finalEmail,
      phone: finalPhone,
      emailVerified: isEmailVerified,
      phoneVerified: isPhoneVerified,
      checkIn: formatDateRU(startDate),
      checkOut: formatDateRU(endDate),
      nights,
      total_adults: adults,
      total_children: children,
      total_guests: totalGuests,
      totalPrice: formatVillaMoney(totalPrice),
      isRegistered: !!currentUser
    };

    // Если контакты НЕ подтверждены — обязательно запускаем модальное окно верификации
    if (!isFullyVerified) {
      setPendingPayload(payload);
      setIsVerificationModalOpen(true);
      return;
    }

    // Если гость уже полностью подтвержден — отправляем сразу
    setIsSubmitting(true);
    try {
      await onBookingSubmit(payload, effectiveMode);
    } catch (err) {
      toast.error(t('bookingError') || 'Произошла ошибка при отправке заявки.');
    } finally {
      setIsSubmitting(false);
    }
    return;
  };

  // Коллбэк успешного прохождения верификации
  const handleVerificationSuccess = async (verificationResult) => {
    setIsVerificationModalOpen(false);
    if (!pendingPayload) return;

    const verifiedEmail = verificationResult.email || guestEmail.trim();
    const verifiedPhone = verificationResult.phone || guestPhone.trim();
    const verifiedEmailFlag = verificationResult.emailVerified ?? true;
    const verifiedPhoneFlag = verificationResult.phoneVerified ?? false;

    // Реактивно обновляем профиль в сессии
    if (updateCurrentUser) {
      updateCurrentUser({
        name: pendingPayload.name,
        email: verifiedEmail,
        phone: verifiedPhone,
        emailVerified: verifiedEmailFlag,
        phoneVerified: verifiedPhoneFlag
      });
    }

    setIsSubmitting(true);
    try {
      const enrichedPayload = {
        ...pendingPayload,
        email: verifiedEmail,
        phone: verifiedPhone,
        emailVerified: verifiedEmailFlag,
        phoneVerified: verifiedPhoneFlag
      };
      await onBookingSubmit(enrichedPayload, effectiveMode);
    } catch (err) {
      toast.error(t('bookingError') || 'Произошла ошибка при отправке заявки.');
    } finally {
      setIsSubmitting(false);
      setPendingPayload(null);
    }
  };

  return (
    <div className="w-full bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-airbnb sticky top-28 transition-all">

      {/* Верхняя строка: Цена за ночь и бейдж режима */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {formatVillaMoney(activeNightPrice)}
          </span>
          <span className="text-xs text-slate-400 font-medium ml-1.5">
            {t('pricePerNight')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
          {effectiveMode === 'instant' ? (
            <>
              <Zap className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>{t('instantBookingBadge')}</span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('requestBookingBadge')}</span>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">

        {/* Блок выбора дат (AirBnB Check-in / Checkout box) */}
        <div className="relative" ref={calendarRef}>
          <div
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="grid grid-cols-2 rounded-2xl border border-white/10 bg-slate-900/80 cursor-pointer overflow-hidden hover:border-rose-500/40 transition-colors"
          >
            <div className="p-3 border-r border-white/10">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t('checkIn')}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate block mt-0.5">
                {startDate ? formatDateRU(startDate) : t('datesNotSelected')}
              </span>
            </div>
            <div className="p-3">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t('checkOut')}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate block mt-0.5">
                {endDate ? formatDateRU(endDate) : '—'}
              </span>
            </div>
          </div>

          {/* Всплывающий кастомный 2-месячный интерактивный календарь */}
          {isCalendarOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 fade-in bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4">
              {/* Навигация по месяцам */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentCalendarMonth(addMonths(currentCalendarMonth, -1))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-300">
                  {startDate ? `${formatDateRU(startDate)}${endDate ? ` — ${formatDateRU(endDate)}` : ' →'}` : (t('selectDatesTitle') || 'Выберите даты')}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentCalendarMonth(addMonths(currentCalendarMonth, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 2 месяца рядом */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderCalendarMonth(currentCalendarMonth)}
                {renderCalendarMonth(addMonths(currentCalendarMonth, 1))}
              </div>

              {/* Кнопка сброса выбора дат */}
              {(startDate || endDate) && (
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => { setDateRange([null, null]); }}
                    className="text-xs text-slate-400 hover:text-white underline transition-colors"
                  >
                    {t('resetDatesBtn') || 'Сбросить выбор дат'}
                  </button>
                </div>
              )}

              {/* Легенда */}
              <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-rose-600 inline-block"></span> {t('yourSelection')}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#ff5a5f] inline-block"></span> {t('airbnbSync')}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-slate-600 inline-block"></span> {t('directBooking')}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-yellow-500/20 border border-dashed border-yellow-500/50 inline-block"></span> {t('minStayBadge')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Блок выбора количества гостей */}
        <div className="relative" ref={guestPickerRef}>
          <div
            onClick={() => setIsGuestPickerOpen(!isGuestPickerOpen)}
            className="p-3.5 rounded-2xl border border-white/10 bg-slate-900/80 cursor-pointer flex items-center justify-between hover:border-rose-500/40 transition-colors"
          >
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t('guestsLabel')}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5">
                {totalGuests} {totalGuests === 1 ? t('guestOne') : t('guestsMany')}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isGuestPickerOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Выпадающий селектор гостей */}
          {isGuestPickerOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl z-40 fade-in space-y-4">
              {/* Взрослые */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{t('adultsLabel')}</p>
                  <p className="text-[10px] text-slate-400">{t('adultsDesc')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-white w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    disabled={totalGuests >= maxTotalGuests}
                    onClick={() => setAdults((prev) => prev + 1)}
                    className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Дети */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div>
                  <p className="text-xs font-bold text-white">{t('childrenLabel')}</p>
                  <p className="text-[10px] text-slate-400">{t('childrenDesc')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={children <= 0}
                    onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                    className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-white w-4 text-center">{children}</span>
                  <button
                    type="button"
                    disabled={totalGuests >= maxTotalGuests}
                    onClick={() => setChildren((prev) => prev + 1)}
                    className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 italic text-center">
                {t('maxCapacityNotice')}
              </div>
            </div>
          )}
        </div>

        {/* Данные гостя: форма ввода для неподтвержденных пользователей или бейдж для подтвержденных */}
        {isFullyVerified ? (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-300 my-2">
            <div className="flex items-center gap-2 truncate">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white block truncate">{currentUser?.name || guestName}</span>
                <span className="text-[11px] text-slate-300 truncate">{guestEmail || currentUser?.email}</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3 h-3" /> {t('emailVerifiedBadge') || 'Подтвержден'}
            </span>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <div>
              <input
                name="guestName"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={t('guestNamePlaceholder') || 'Ваше имя'}
                className="w-full bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-xs sm:text-sm text-white focus:border-rose-500 outline-none transition-colors"
              />
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                name="guestEmail"
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder={t('guestEmailLabel') || 'Электронная почта (Email)'}
                className={`w-full bg-slate-900/80 border ${isEmailVerified ? 'border-emerald-500/50' : 'border-white/10'} pl-10 pr-24 py-3.5 rounded-2xl text-xs sm:text-sm text-white focus:border-rose-500 outline-none transition-colors`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium pointer-events-none">
                {isEmailVerified ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {t('emailVerifiedBadge') || 'Подтвержден'}
                  </span>
                ) : (
                  <span className="text-amber-400/90 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {t('verifyRequired') || 'Код на email'}
                  </span>
                )}
              </span>
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                name="guestPhone"
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder={t('guestPhoneLabel') || 'Номер телефона (WhatsApp / Связь)'}
                className={`w-full bg-slate-900/80 border ${isPhoneVerified ? 'border-emerald-500/50' : 'border-white/10'} pl-10 pr-24 py-3.5 rounded-2xl text-xs sm:text-sm text-white focus:border-rose-500 outline-none transition-colors`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium pointer-events-none">
                {isPhoneVerified ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {t('phoneVerifiedBadge') || 'Подтвержден'}
                  </span>
                ) : (
                  <span className="text-slate-400/80 text-[10px]">
                    {verificationMode === 'strict' ? 'SMS код' : 'Связь'}
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Предупреждение о коротком сроке аренды */}
        {isShortStay && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {t('shortStayNotice', { min: minRequiredNights })}
            </span>
          </div>
        )}

        {/* Юридические согласия со сквозной синхронизацией по сайту */}
        <div className="pt-2 border-t border-white/10">
          <LegalConsentCheckboxes />
        </div>

        {/* Кнопка отправки формы */}
        <button
          type="submit"
          disabled={isSubmitting || !allAgreed}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-[0.99] transition-all shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {effectiveMode === 'instant' ? (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>{isSubmitting ? (t('submittingOrder') || 'Обработка...') : t('bookNowBtn')}</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span>{isSubmitting ? (t('submittingRequest') || 'Отправка...') : t('sendRequestBtn')}</span>
            </>
          )}
        </button>
      </form>

      {/* Детализация стоимости при выбранных датах */}
      {nights > 0 && (
        <div className="mt-6 pt-5 border-t border-white/10 space-y-3 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="underline cursor-pointer">
              {formatVillaMoney(activeNightPrice)} × {nights} {t('nightsCountLabel')}
            </span>
            <span>{formatVillaMoney(totalPrice)}</span>
          </div>

          <div className="flex justify-between">
            <span>{t('cleaningFeeLabel')}</span>
            <span className="text-emerald-400 font-semibold">{t('includedLabel')}</span>
          </div>

          <div className="flex justify-between">
            <span>{t('serviceFeeLabel')}</span>
            <span className="text-emerald-400 font-semibold">{t('includedLabel')}</span>
          </div>

          <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-bold text-white">
            <span>{t('totalPriceLabel')}</span>
            <span className="text-rose-400 text-lg">{formatVillaMoney(totalPrice)}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-white/5 mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('holdTimerNotice')}</span>
          </div>
        </div>
      )}

      {/* Модальное окно пошаговой верификации Email и Телефона гостя */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        mode={dynamicRules.verificationMode || 'progressive'}
        guestData={{
          name: guestName.trim() || 'Гость',
          email: guestEmail.trim(),
          phone: guestPhone.trim()
        }}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
}

