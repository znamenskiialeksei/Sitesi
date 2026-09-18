// ==============================================================================
// МОДАЛЬНОЕ ОКНО ПРЕЗЕНТАЦИИ УСЛУГИ / ПУТЕВОДИТЕЛЯ (PRESENTATION MODAL)
// Файл: components/Modals/PresentationModal.js
// Назначение: Подробное описание, медиа-галерея, видео-превью и оформление заказа
// с полной поддержкой Google Drive видео/фото и мультиязычности из Google Sheets.
// ==============================================================================

import React from 'react';
import { X, ShoppingBag, PlayCircle, Eye, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useAuth } from '../../context/AuthContext';
import { useLegalConsent } from '../../context/LegalConsentContext';
import LegalConsentCheckboxes from '../LegalConsentCheckboxes';
import { useToast } from '../Toast';
import { MediaCarousel } from '../../utils/media';

export default function PresentationModal({ item, type, onClose, onPurchase }) {
  const { t, lang, currency, formatMoney, formatRawMoney } = useLanguage();
  const { currentUser, setAuthModalOpen } = useAuth();
  const { allAgreed } = useLegalConsent();
  const toast = useToast();

  if (!item) return null;

  // Словарь для мгновенной локализации названий и описаний даже при сбоях формул в Google Sheets
  const dictionaryFallback = {
    'массаж': { ru: 'Массаж', en: 'Massage', tr: 'Masaj' },
    'massage': { ru: 'Массаж', en: 'Massage', tr: 'Masaj' },
    'masaj': { ru: 'Массаж', en: 'Massage', tr: 'Masaj' },
    'cool, high quality': { ru: 'Первоклассный, высокое качество', en: 'Cool, high quality', tr: 'Harika, yüksek kalite' },
    'первоклассный, высокое качество': { ru: 'Первоклассный, высокое качество', en: 'Cool, high quality', tr: 'Harika, yüksek kalite' },
    'трансфер': { ru: 'Индивидуальный VIP-трансфер', en: 'Private VIP Transfer', tr: 'Özel VIP Transfer' },
    'transfer': { ru: 'Индивидуальный VIP-трансфер', en: 'Private VIP Transfer', tr: 'Özel VIP Transfer' },
    'яхта': { ru: 'Аренда яхты', en: 'Yacht Charter', tr: 'Tekne Turu' },
    'yacht': { ru: 'Аренда яхты', en: 'Yacht Charter', tr: 'Tekne Turu' },
    'шеф-повар': { ru: 'Персональный шеф-повар', en: 'Private Chef', tr: 'Özel Şef' },
    'chef': { ru: 'Персональный шеф-повар', en: 'Private Chef', tr: 'Özel Şef' },
    'барбекю': { ru: 'Барбекю на вилле', en: 'Villa BBQ', tr: 'Villa Barbekü' },
    'bbq': { ru: 'Барбекю на вилле', en: 'Villa BBQ', tr: 'Villa Barbekü' },
    'спа': { ru: 'СПА и термальные источники', en: 'SPA & Thermal Baths', tr: 'SPA ve Termal Kaynaklar' },
    'spa': { ru: 'СПА и термальные источники', en: 'SPA & Thermal Baths', tr: 'SPA ve Termal Kaynaklar' }
  };

  const getLocalized = (obj, field) => {
    if (!obj || !obj[field]) return '';

    if (typeof obj[field] === 'string') {
      const raw = obj[field].trim();
      const lower = raw.toLowerCase();
      if (dictionaryFallback[lower] && dictionaryFallback[lower][lang]) {
        return dictionaryFallback[lower][lang];
      }
      return raw;
    }

    const val = obj[field][lang];
    if (val && typeof val === 'string') {
      const clean = val.trim();
      if (!clean.startsWith('#') && clean.toUpperCase() !== 'ERROR') {
        return clean;
      }
    }

    const anyText = (obj[field]['ru'] || obj[field]['en'] || obj[field]['tr'] || '').toString().trim();
    const anyLower = anyText.toLowerCase();
    if (dictionaryFallback[anyLower] && dictionaryFallback[anyLower][lang]) {
      return dictionaryFallback[anyLower][lang];
    }

    if (lang !== 'en' && obj[field]['en'] && !obj[field]['en'].toString().startsWith('#')) return obj[field]['en'];
    if (lang !== 'ru' && obj[field]['ru'] && !obj[field]['ru'].toString().startsWith('#')) return obj[field]['ru'];
    if (obj[field]['tr'] && !obj[field]['tr'].toString().startsWith('#')) return obj[field]['tr'];

    return anyText;
  };

  const getLocalizedModule = (mod) => {
    if (!mod) return t('guideTypeLabel') || (lang === 'en' ? 'Video guide' : lang === 'tr' ? 'Video rehber' : 'Видео-гид');
    const lower = String(mod).toLowerCase().trim();
    const map = {
      'путеводитель': { ru: 'Путеводитель', en: 'Guide', tr: 'Rehber' },
      'видео-гид': { ru: 'Видео-гид', en: 'Video Guide', tr: 'Video Rehber' },
      'локации': { ru: 'Локации', en: 'Locations', tr: 'Konumlar' },
      'история': { ru: 'История', en: 'History', tr: 'Tarih' },
      'гастрономия': { ru: 'Гастрономия', en: 'Gastronomy', tr: 'Gastronomi' },
      'здоровье': { ru: 'Здоровье', en: 'Wellness', tr: 'Sağlık' },
      'основной': { ru: 'Основной', en: 'Main', tr: 'Ana Modül' },
      'для гостей': { ru: 'Для гостей', en: 'For Guests', tr: 'Misafirler İçin' }
    };
    if (map[lower] && map[lower][lang]) return map[lower][lang];
    return mod;
  };

  const title = getLocalized(item, 'name');
  const desc = getLocalized(item, 'desc');
  const detailed = getLocalized(item, 'detailedDesc') || desc;

  // Объединение изображений и видео в единый список для карусели
  const mediaList = [
    ...(Array.isArray(item.images) ? item.images : (item.images ? [item.images] : [])),
    ...(Array.isArray(item.videos) ? item.videos : (item.videos ? [item.videos] : []))
  ].filter(Boolean);

  // Форматирование стоимости: приоритет прямого значения из ExtraServices и VideoGuides
  const formatItemPrice = (targetItem) => {
    if (!targetItem) return '';
    const p = targetItem.price || {};
    const curr = currency || 'RUB';

    // 1. Если цена напрямую задана в выбранной валюте в таблице Google Sheets
    if (curr === 'RUB' && p.rub && Number(p.rub) > 0) return formatRawMoney(p.rub, 'RUB');
    if (curr === 'EUR' && p.eur && Number(p.eur) > 0) return formatRawMoney(p.eur, 'EUR');
    if (curr === 'TRY' && p.try && Number(p.try) > 0) return formatRawMoney(p.try, 'TRY');
    if (curr === 'USD' && p.usd && Number(p.usd) > 0) return formatRawMoney(p.usd, 'USD');

    // 2. Если в выбранной валюте нет прямой колонки (или USD), конвертируем из имеющейся по курсу ЦБ Турции
    if (p.eur && Number(p.eur) > 0) return formatMoney(p.eur, curr, 'EUR');
    if (p.rub && Number(p.rub) > 0) return formatMoney(p.rub, curr, 'RUB');
    if (p.try && Number(p.try) > 0) return formatMoney(p.try, curr, 'TRY');
    if (p.usd && Number(p.usd) > 0) return formatMoney(p.usd, curr, 'USD');

    return formatRawMoney(0, curr);
  };

  const handleOrder = () => {
    if (!allAgreed) {
      toast.warn(t('legalConsentContract') || 'Необходимо подтвердить все юридические согласия');
      return;
    }
    if (!currentUser) {
      toast.info(t('authRequiredOrderToast') || 'Пожалуйста, авторизуйтесь для оформления заказа.');
      setAuthModalOpen(true);
      return;
    }
    if (onPurchase) {
      onPurchase(formatItemPrice(item), type, item);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 fade-in select-none">
      <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-105 border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Карусель медиафайлов с поддержкой видео и Google Drive */}
        <div className="h-64 sm:h-80 w-full relative bg-black shrink-0 overflow-hidden">
          <MediaCarousel
            media={mediaList}
            type={item.videos && item.videos.length > 0 ? 'video' : 'image'}
          />
        </div>

        {/* Контентная область с описанием */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                {type === 'course' ? (t('authorGuideBadge') || 'Авторский видео-путеводитель') : (t('vipConciergeBadge') || 'Премиальный консьерж-сервис')}
              </span>
              {item.module && (
                <span className="text-[11px] font-medium text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  {getLocalizedModule(item.module)}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {detailed}
            </p>

            {/* Преимущества и особенности */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('officialServiceFeature') || 'Официальный сервис от владельца'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('calendarCrmFeature') || 'Фиксация в календаре и CRM'}</span>
              </div>
            </div>
          </div>

          {/* Юридические согласия со сквозной синхронизацией по сайту */}
          <div className="pt-3 border-t border-white/10">
            <LegalConsentCheckboxes compact />
          </div>

          {/* Нижняя панель с ценой и кнопкой заказа */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                {t('totalToPay') || 'Итого к оплате:'}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                {formatItemPrice(item)}
              </span>
            </div>

            <button
              onClick={handleOrder}
              disabled={!allAgreed}
              className={`px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-500/30 flex items-center gap-2 ${!allAgreed ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {type === 'course' ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>{t('buyGuideBtn') || 'Получить доступ'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('orderServiceBtn') || 'Заказать услугу'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
