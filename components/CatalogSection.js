// ==============================================================================
// КАТАЛОГ УСЛУГ И АВТОРСКИХ ПУТЕВОДИТЕЛЕЙ (EXPERIENCES & GUIDES)
// Файл: components/CatalogSection.js
// Назначение: Дополнительные сервисы виллы, трансферы, яхты и видео-гиды,
// динамически загружаемые из Google Sheets с каруселями и поддержкой презентаций.
// ==============================================================================

import React, { useState } from 'react';
import { ShoppingBag, PlayCircle, Compass, Car, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { useLanguage } from '../utils/language';
import { useAuth } from '../context/AuthContext';
import { useLegalConsent } from '../context/LegalConsentContext';
import LegalConsentCheckboxes from './LegalConsentCheckboxes';
import { useToast } from './Toast';
import { MediaCarousel } from '../utils/media';

export default function CatalogSection({
  products = [],
  courses = [],
  onSelectPresentation
}) {
  const { t, lang, currency, formatMoney, formatRawMoney } = useLanguage();
  const { currentUser, setAuthModalOpen } = useAuth();
  const { allAgreed } = useLegalConsent();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('services'); // 'services' или 'guides'

  // Словарь часто используемых сервисных названий и фраз для мгновенной локализации
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

    // Если передана прямая строка
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

    // Если на выбранном языке в таблице пусто или #ERROR!, проверяем словарь
    const anyText = (obj[field]['ru'] || obj[field]['en'] || obj[field]['tr'] || '').toString().trim();
    const anyLower = anyText.toLowerCase();
    if (dictionaryFallback[anyLower] && dictionaryFallback[anyLower][lang]) {
      return dictionaryFallback[anyLower][lang];
    }

    // Каскадный фоллбэк: EN -> RU -> TR
    if (lang !== 'en' && obj[field]['en'] && !obj[field]['en'].toString().startsWith('#')) return obj[field]['en'];
    if (lang !== 'ru' && obj[field]['ru'] && !obj[field]['ru'].toString().startsWith('#')) return obj[field]['ru'];
    if (obj[field]['tr'] && !obj[field]['tr'].toString().startsWith('#')) return obj[field]['tr'];

    return anyText;
  };

  const getLocalizedType = (typeObj) => {
    if (!typeObj) return t('serviceTypeLabel') || 'Услуга';
    if (typeof typeObj === 'object') {
      const v = typeObj[lang] || typeObj.ru || '';
      if (v) return v;
    }
    const str = String(typeObj).toLowerCase();
    if (str.includes('пакет') || str.includes('package') || str.includes('paket')) {
      return t('packageTypeLabel') || (lang === 'en' ? 'Service Package' : lang === 'tr' ? 'Hizmet Paketi' : 'Пакет услуг');
    }
    return t('serviceTypeLabel') || (lang === 'en' ? 'Service' : lang === 'tr' ? 'Hizmet' : 'Услуга');
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

  // Получение и форматирование цены карточки: приоритет прямого значения из ExtraServices и VideoGuides
  const formatItemPrice = (item) => {
    if (!item) return '';
    const p = item.price || {};
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

  const handleBuy = (item, type) => {
    if (!allAgreed) {
      toast.warn(t('legalConsentContract') || 'Необходимо подтвердить все юридические согласия');
      return;
    }
    if (!currentUser) {
      toast.info(t('authRequiredOrderToast') || 'Пожалуйста, авторизуйтесь для оформления заказа.');
      setAuthModalOpen(true);
      return;
    }
    const itemName = getLocalized(item, 'name');
    const toastTemplate = t('orderCreatedToast') || 'Заказ на «{name}» сформирован! Переходим к деталям...';
    toast.success(toastTemplate.replace('{name}', itemName));
    if (onSelectPresentation) {
      onSelectPresentation(item, type);
    }
  };

  const defaultProducts = [
    {
      id: 'prod-default-1',
      name: { ru: 'Индивидуальный VIP-трансфер', en: 'Private VIP Airport Transfer', tr: 'Özel VIP Havalimanı Transferi' },
      desc: { ru: 'Комфортабельный Mercedes Vito с кондиционером и напитками прямо из аэропорта Даламан к дверям виллы.', en: 'Comfortable Mercedes Vito with AC, Wi-Fi, and cold drinks directly from Dalaman Airport to the villa.', tr: 'Dalaman Havalimanı\'ndan villaya klimalı ve konforlu Mercedes Vito transferi.' },
      price: { eur: 50, rub: 5000, try: 1800 },
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200'],
      type: { ru: 'Услуга', en: 'Service', tr: 'Hizmet' }
    },
    {
      id: 'prod-default-2',
      name: { ru: 'Аренда приватной яхты по реке Дальян', en: 'Private Dalyan River Yacht Charter', tr: 'Özel Dalyan Nehri Tekne Turu' },
      desc: { ru: 'Эксклюзивный круиз по реке Дальян, скальным гробницам, термальным источникам и черепашьему пляжу Изтузу.', en: 'Exclusive riverboat cruise visiting rock tombs, thermal mud baths, and Iztuzu turtle beach.', tr: 'Likya mezarları, çamur banyoları ve İztuzu plajına özel nehir teknesi turu.' },
      price: { eur: 220, rub: 22000, try: 8000 },
      images: ['https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?w=1200'],
      type: { ru: 'Пакет услуг', en: 'Service Package', tr: 'Hizmet Paketi' }
    },
    {
      id: 'prod-default-3',
      name: { ru: 'Приватный шеф-повар на вилле', en: 'Private Villa Chef Service', tr: 'Villada Özel Şef Hizmeti' },
      desc: { ru: 'Приготовление традиционного турецкого завтрака или изысканного барбекю-ужина у бассейна из фермерских продуктов.', en: 'Traditional Turkish breakfast or an exquisite poolside BBQ dinner cooked with fresh local produce.', tr: 'Taze köy ürünleriyle geleneksel serpme kahvaltı veya havuz başında akşam mangal ziyafeti.' },
      price: { eur: 90, rub: 9000, try: 3300 },
      images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'],
      type: { ru: 'Услуга', en: 'Service', tr: 'Hizmet' }
    }
  ];

  const defaultCourses = [
    {
      id: 'course-default-1',
      name: { ru: 'Ликийские гробницы и древний Каунос', en: 'Lycian Tombs & Ancient Kaunos Guide', tr: 'Likya Mezarları ve Antik Kaunos Rehberi' },
      desc: { ru: 'Авторский видеогид Алексея Знаменского: скрытые тропы, история скальных гробниц и амфитеатра Кауноса.', en: 'Exclusive video guide by Aleksei Znamenskii: secret trails, rock tombs history, and Kaunos theater.', tr: 'Aleksei Znamenskii\'nin özel video rehberi: kaya mezarları ve Kaunos antik kenti tarihi.' },
      images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200'],
      price: { eur: 15, rub: 1500, try: 550 }
    },
    {
      id: 'course-default-2',
      name: { ru: 'Пляж Изтузу и заповедник Caretta Caretta', en: 'Iztuzu Beach & Turtle Sanctuary Secrets', tr: 'İztuzu Plajı ve Caretta Caretta Rehberi' },
      desc: { ru: 'Как добраться, секретная пресноводная лагуна, центр спасения черепах и лучший ресторан голубых крабов.', en: 'How to reach the beach, secret freshwater lagoon, turtle rescue center, and best blue crab spots.', tr: 'Ulaşım rehberi, gizli tatlı su gölü, deniz kaplumbağaları koruma merkezi ve mavi yengeç noktaları.' },
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'],
      price: { eur: 15, rub: 1500, try: 550 }
    }
  ];

  const effectiveProducts = products && products.length > 0 ? products : defaultProducts;
  const effectiveCourses = courses && courses.length > 0 ? courses : defaultCourses;

  return (
    <section id="catalog" className="py-12 border-t border-white/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-rose-500" />
            <span>{t('catalogTitle') || 'Впечатления и сервис'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('catalogSubtitle') || 'Сделайте ваш отдых на Villa Turaman по-настоящему незабываемым'}
          </p>
        </div>

        {/* Табы переключения категорий */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'services'
              ? 'bg-rose-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            <Car className="w-4 h-4" />
            <span>{t('tabServices') || 'Консьерж-сервис'} ({effectiveProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'guides'
              ? 'bg-rose-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t('tabEducation') || 'Видео-путеводители'} ({effectiveCourses.length})</span>
          </button>
        </div>
      </div>

      {/* Список услуг консьерж-сервиса */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
          {effectiveProducts.map((p) => {
            const name = getLocalized(p, 'name');
            const desc = getLocalized(p, 'desc');
            const mediaList = p.images && p.images.length > 0
              ? p.images
              : ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200"];

            return (
              <div
                key={p.id}
                className="bg-slate-800/60 border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg group/item"
              >
                <div>
                  {/* Карусель изображений услуги с перелистыванием */}
                  <div className="h-52 overflow-hidden relative bg-slate-900">
                    <MediaCarousel media={mediaList} type="image" />
                    <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 z-10">
                      {getLocalizedType(p.type)}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{desc}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-3 mt-2">
                  {/* Кнопка открытия полной презентации */}
                  <button
                    type="button"
                    onClick={() => onSelectPresentation && onSelectPresentation(p, 'product')}
                    className="w-full py-2 px-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t('serviceDetailsBtn') || 'Подробнее об услуге'}</span>
                  </button>

                  {/* Чекбоксы юридических согласий со сквозной синхронизацией */}
                  <div className="pt-2 border-t border-white/5">
                    <LegalConsentCheckboxes compact />
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{t('priceLabel') || 'Стоимость:'}</span>
                      <span className="text-lg font-extrabold text-emerald-400">{formatItemPrice(p)}</span>
                    </div>

                    <button
                      onClick={() => handleBuy(p, 'product')}
                      disabled={!allAgreed}
                      className={`px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-900/20 ${!allAgreed ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('productBuy') || 'Заказать'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Список авторских видео-путеводителей */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
          {effectiveCourses.map((c) => {
            const name = getLocalized(c, 'name');
            const desc = getLocalized(c, 'desc');
            const mediaList = c.images && c.images.length > 0
              ? c.images
              : ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"];

            return (
              <div
                key={c.id}
                className="bg-slate-800/60 border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg group/item"
              >
                <div>
                  {/* Карусель изображений путеводителя с перелистыванием */}
                  <div className="h-52 overflow-hidden relative bg-slate-900">
                    <MediaCarousel media={mediaList} type="image" />
                    <span className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white z-10 shadow">
                      {getLocalizedModule(c.module)}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{desc}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-3 mt-2">
                  {/* Кнопка открытия презентации видеогида */}
                  <button
                    type="button"
                    onClick={() => onSelectPresentation && onSelectPresentation(c, 'course')}
                    className="w-full py-2 px-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t('guideTrailerBtn') || 'Трейлер и программа'}</span>
                  </button>

                  {/* Чекбоксы юридических согласий со сквозной синхронизацией */}
                  <div className="pt-2 border-t border-white/5">
                    <LegalConsentCheckboxes compact />
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{t('accessLabel') || 'Доступ:'}</span>
                      <span className="text-lg font-extrabold text-emerald-400">{formatItemPrice(c)}</span>
                    </div>

                    <button
                      onClick={() => handleBuy(c, 'course')}
                      disabled={!allAgreed}
                      className={`px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-900/20 ${!allAgreed ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{t('buyGuideBtn') || 'Получить доступ'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
