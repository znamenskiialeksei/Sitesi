// ==============================================================================
// МОДУЛЬ ОБРАБОТКИ ДАТ И КАЛЕНДАРЯ VILLA TURAMAN (AIRBNB PLATFORM)
// Файл: utils/dates.js
// Назначение: Единая библиотека парсинга, форматирования, расчёта ночей и валидации
// ==============================================================================

import { differenceInDays, format, parse, isValid, addDays, startOfDay } from 'date-fns';
import { ru, enUS, tr } from 'date-fns/locale';

export const dateLocales = { ru, en: enUS, tr };

/**
 * Безопасный парсинг даты из строки формата 'dd.MM.yyyy' (например '15.05.2026')
 * @param {string} str - Строка даты
 * @returns {Date} Валидный объект Date или Date(NaN)
 */
export const parseDateRU = (str) => {
  if (!str || typeof str !== 'string') return new Date(NaN);
  const parts = str.trim().split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const d = new Date(year, month, day);
      return startOfDay(d);
    }
  }
  return new Date(NaN);
};

/**
 * Форматирование объекта Date в строку 'dd.MM.yyyy'
 * @param {Date} date - Дата
 * @returns {string} Форматированная строка
 */
export const formatDateRU = (date) => {
  if (!date || !isValid(date)) return '';
  return format(date, 'dd.MM.yyyy');
};

/**
 * Форматирование даты в компактный iCal формат 'YYYYMMDD' (RFC 5545)
 * @param {Date} date - Дата
 * @returns {string} 8-значная строка даты
 */
export const formatDateICal = (date) => {
  if (!date || !isValid(date)) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

/**
 * Подсчёт количества ночей между датой заезда и выезда
 * @param {Date} start - Дата заезда
 * @param {Date} end - Дата выезда
 * @returns {number} Количество ночей (целое положительное число)
 */
export const calculateNights = (start, end) => {
  if (!start || !end || !isValid(start) || !isValid(end)) return 0;
  const nights = differenceInDays(startOfDay(end), startOfDay(start));
  return nights > 0 ? nights : 0;
};

/**
 * Проверка, являются ли две даты одним и тем же календарным днём
 * @param {Date} d1 - Первая дата
 * @param {Date} d2 - Вторая дата
 * @returns {boolean}
 */
export const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Нормализация даты к формату UTC (для защиты от сдвига часовых поясов)
 * @param {Date} d - Локальная дата
 * @returns {Date} UTC Date
 */
export const normalizeToUTC = (d) => {
  if (!d || !isValid(d)) return null;
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

/**
 * Проверка, попадает ли проверяемая дата в интервал [start, end] включительно
 * @param {Date} checkDate 
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {boolean}
 */
export const isDateInRange = (checkDate, startDate, endDate) => {
  if (!checkDate || !startDate || !endDate) return false;
  const c = startOfDay(checkDate).getTime();
  const s = startOfDay(startDate).getTime();
  const e = startOfDay(endDate).getTime();
  return c >= s && c <= e;
};

