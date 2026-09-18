// ==============================================================================
// ГЛАВНАЯ СТРАНИЦА ВИЛЛЫ VILLA TURAMAN В СТИЛЕ AIRBNB
// Файл: pages/index.js
// Назначение: Декомпозированная, высокоскоростная публичная витрина листинга
// с 100% динамическим управлением контентом, авто-переводами, фото/видео галереей
// и каталогом сервисов напрямую из Google Sheets с онлайн-синхронизацией в реальном времени.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import {
  Users,
  Bed,
  Bath,
  Home,
  Sparkles,
  MapPin,
  Calendar as CalendarIcon,
  ShieldCheck,
  Key,
  Clock,
  Compass,
  ChevronRight,
  X,
  Camera
} from 'lucide-react';

import { useLanguage } from '../utils/language';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PhotoGrid from '../components/PhotoGrid';
import BookingWidget from '../components/BookingWidget';
import Amenities from '../components/Amenities';
import SleepingArrangements from '../components/SleepingArrangements';
import HostProfileCard from '../components/HostProfileCard';
import ReviewsSection from '../components/ReviewsSection';
import CatalogSection from '../components/CatalogSection';
import GallerySection from '../components/GallerySection';
import Footer from '../components/Footer';

import AuthModal from '../components/Modals/AuthModal';
import TwoFaModal from '../components/Modals/TwoFaModal';
import PresentationModal from '../components/Modals/PresentationModal';
import { parseDriveLink } from '../utils/media';
import { parseDateRU } from '../utils/dates';

// ------------------------------------------------------------------------------
// СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ С ОНЛАЙН РЕВАЛИДАЦИЕЙ (Next.js ISR)
// ------------------------------------------------------------------------------
export async function getStaticProps() {
  const contentPath = path.join(process.cwd(), 'utils', 'content.json');
  let contentData = {
    home: {},
    about: {},
    legal: {},
    templates: {},
    products: [],
    courses: [],
    gallery: []
  };

  try {
    if (fs.existsSync(contentPath)) {
      contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    }
  } catch (err) {
    console.error('Ошибка чтения content.json при статической сборке:', err);
  }

  return {
    props: {
      publicData: {
        products: contentData.products || [],
        courses: contentData.courses || [],
        gallery: contentData.gallery || []
      },
      contentData
    },
    // Ревалидация статического кэша каждые 60 секунд
    revalidate: 60
  };
}

export default function HomeListing({ publicData, contentData }) {
  const router = useRouter();
  const { t, lang, currency } = useLanguage();
  const { currentUser, setAuthModalOpen } = useAuth();
  const toast = useToast();

  // Динамические данные с поддержкой онлайн-регидрации из Google Sheets
  const [currentContentData, setCurrentContentData] = useState(contentData);
  const [currentPublicData, setCurrentPublicData] = useState(publicData);

  // Состояние выбранной презентации (видео-гид или консьерж-сервис)
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [selectedPresentationType, setSelectedPresentationType] = useState('service');
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  // Занятые даты из iCal каналов бронирования
  const [apiOccupiedDates, setApiOccupiedDates] = useState([]);
  // Ручные блокировки дат из листа CalendarSettings Google Таблицы
  const [manualBlockedDates, setManualBlockedDates] = useState([]);
  // Полный массив занятых дат для виджета бронирования
  const occupiedDates = [...apiOccupiedDates, ...manualBlockedDates];

  // События iCal для отображения цветных полосок в виджете-календаре
  const [apiEvents, setApiEvents] = useState([]);
  const [dynamicRules, setDynamicRules] = useState({
    basePrice: 15000,
    currency: 'RUB',
    minNights: 3,
    maxNights: 30,
    maxTotalGuests: 10,
    bookingWindowMonths: 18,
    advanceNoticeDays: 2,
    bookingMode: 'instant',
    checkInTime: '15:00',
    checkOutTime: '11:00'
  });
  const [dateRules, setDateRules] = useState([]);

  // Обработка оповещений при возврате с платежного шлюза
  useEffect(() => {
    if (router.query.status === 'success') {
      toast.success('Оплата успешно подтверждена! Бронирование внесено в календарь.');
      router.replace('/', undefined, { shallow: true });
    } else if (router.query.payment === 'cancel') {
      toast.warn('Оплата была отменена. Вы можете завершить бронирование в любое время.');
      router.replace('/', undefined, { shallow: true });
    }
  }, [router.query]);

  // Загрузка занятых дат из объединенных каналов (Airbnb, Booking, Vrbo, Avito, Agoda)
  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        const res = await fetch('/api/calendar');
        if (res.ok) {
          const data = await res.json();
          if (data.dates) {
            // Преобразуем строковые даты 'YYYY-MM-DD' в нативные локальные объекты Date
            setApiOccupiedDates(data.dates.map((d) => {
              const [y, m, day] = d.split('-').map(Number);
              return new Date(y, m - 1, day);
            }));
          }
          // Сохраняем события iCal для отображения цветных полосок в виджете
          if (data.events) {
            setApiEvents(data.events);
          }
        }
      } catch (e) {
        console.warn('Не удалось загрузить внешние календари:', e);
      }
    };

    const loadSettings = async () => {
      try {
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_settings' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            if (data.globalRules) setDynamicRules((prev) => ({ ...prev, ...data.globalRules }));
            if (data.dateRules) {
              setDateRules(data.dateRules);
              // Извлечение ручных блокировок дат из листа CalendarSettings
              let manualBlocks = new Set();
              [...data.dateRules].reverse().forEach((rule) => {
                const rs = parseDateRU(rule.start);
                const re = parseDateRU(rule.end);
                if (isNaN(rs.getTime()) || isNaN(re.getTime())) return;
                let cur = new Date(rs.getFullYear(), rs.getMonth(), rs.getDate());
                const end = new Date(re.getFullYear(), re.getMonth(), re.getDate());
                while (cur <= end) {
                  const dateStr = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
                  if (rule.type === 'Блокировка') manualBlocks.add(dateStr);
                  if (rule.type === 'Сброс блокировки') manualBlocks.delete(dateStr);
                  cur.setDate(cur.getDate() + 1);
                }
              });
              setManualBlockedDates(
                Array.from(manualBlocks).map((ds) => {
                  const [y, m, d] = ds.split('-').map(Number);
                  return new Date(y, m, d);
                })
              );
            }
          }
        }
      } catch (e) {
        console.warn('Не удалось загрузить настройки CRM:', e);
      }
    };

    loadCalendarData();
    loadSettings();
  }, []);

  // ----------------------------------------------------------------------------
  // ОНЛАЙН СИНХРОНИЗАЦИЯ: Подтягивание свежего контента из Google Sheets в реальном времени
  // ----------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchLiveContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const liveData = await res.json();
          if (liveData.success && isMounted) {
            setCurrentContentData({
              home: liveData.home || contentData.home,
              about: liveData.about || contentData.about,
              legal: liveData.legal || contentData.legal,
              templates: liveData.templates || contentData.templates,
              products: liveData.products || contentData.products,
              courses: liveData.courses || contentData.courses,
              gallery: liveData.gallery || contentData.gallery
            });
            setCurrentPublicData({
              products: liveData.products || publicData.products,
              courses: liveData.courses || publicData.courses,
              gallery: liveData.gallery || publicData.gallery
            });
          }
        }
      } catch (err) {
        console.warn('Используется предварительно скомпилированный контент:', err.message);
      }
    };

    fetchLiveContent();
    return () => {
      isMounted = false;
    };
  }, []);

  // Подготовка локализованных данных виллы из динамического состояния
  const homeData = {
    title:
      currentContentData.home?.heroTitle?.[lang] ||
      currentContentData.home?.heroTitle?.ru ||
      'Villa Turaman Luxury Waterfront',
    subtitle:
      currentContentData.home?.heroSubtitle?.[lang] ||
      currentContentData.home?.heroSubtitle?.ru ||
      t('heroSubtitle') ||
      'Ваш идеальный отдых в Дальяне',
    aboutTitle:
      currentContentData.home?.aboutTitle?.[lang] ||
      currentContentData.home?.aboutTitle?.ru ||
      t('aboutVillaTitle') ||
      'О Вилле',
    aboutText:
      currentContentData.home?.aboutText?.[lang] ||
      currentContentData.home?.aboutText?.ru ||
      t('aboutVillaText') ||
      'Роскошная приватная вилла в живописном Дальяне с собственным бассейном, просторным садом и панорамным видом на Ликийские скальные гробницы.',
    heroImage: parseDriveLink(
      currentContentData.home?.heroImage?.media ||
      currentContentData.home?.heroTitle?.media ||
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
      'image'
    ),
    hostHeader:
      currentContentData.home?.hostHeader?.[lang] ||
      currentContentData.home?.hostHeader?.ru ||
      t('hostHeader'),
    hostName:
      currentContentData.home?.hostName?.[lang] ||
      currentContentData.home?.hostName?.ru ||
      t('hostName'),
    hostAvatar:
      parseDriveLink(
        currentContentData.home?.hostAvatar?.media ||
        currentContentData.home?.hostAvatar?.ru ||
        currentContentData.home?.hostAvatar?.[lang],
        'image'
      ) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
    highlightSuperhostTitle:
      currentContentData.home?.highlightSuperhostTitle?.[lang] ||
      currentContentData.home?.highlightSuperhostTitle?.ru ||
      t('highlightSuperhostTitle'),
    highlightSuperhostDesc:
      currentContentData.home?.highlightSuperhostDesc?.[lang] ||
      currentContentData.home?.highlightSuperhostDesc?.ru ||
      t('highlightSuperhostDesc'),
    highlightCheckinTitle:
      currentContentData.home?.highlightCheckinTitle?.[lang] ||
      currentContentData.home?.highlightCheckinTitle?.ru ||
      t('highlightCheckinTitle'),
    highlightCheckinDesc:
      currentContentData.home?.highlightCheckinDesc?.[lang] ||
      currentContentData.home?.highlightCheckinDesc?.ru ||
      t('highlightCheckinDesc'),
    highlightCancellationTitle:
      currentContentData.home?.highlightCancellationTitle?.[lang] ||
      currentContentData.home?.highlightCancellationTitle?.ru ||
      t('highlightCancellationTitle'),
    highlightCancellationDesc:
      currentContentData.home?.highlightCancellationDesc?.[lang] ||
      currentContentData.home?.highlightCancellationDesc?.ru ||
      t('highlightCancellationDesc'),
    locationTitle:
      currentContentData.home?.locationTitle?.[lang] ||
      currentContentData.home?.locationTitle?.ru ||
      t('locationSectionTitle'),
    locationDesc:
      currentContentData.home?.locationDesc?.[lang] ||
      currentContentData.home?.locationDesc?.ru ||
      t('locationDefaultDesc'),
    locationImage:
      parseDriveLink(
        currentContentData.home?.locationImage?.media ||
        currentContentData.home?.locationTitle?.media,
        'image'
      ) || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200'
  };

  const fullDescriptionSections = Object.values(currentContentData.about || {}).map((item) => ({
    title: item.title?.[lang] || item.title?.ru || '',
    text: item.text?.[lang] || item.text?.ru || ''
  }));

  // Обработчик бронирования из виджета — instant: платёжный шлюз, manual: запрос хозяину
  const handleBookingSubmit = async (bookingData, effectiveMode) => {
    try {
      if (effectiveMode === 'instant') {
        // Мгновенное бронирование: редирект на платёжный шлюз (T-Банк для RUB, Stripe для EUR/USD)
        const paymentGateway = currency === 'RUB' ? 'tbank' : 'stripe';
        const numericAmount = typeof bookingData.totalPrice === 'number'
          ? bookingData.totalPrice
          : parseInt(String(bookingData.totalPrice).replace(/[^\d]/g, ''), 10) || 0;

        const res = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gateway: paymentGateway,
            amount: numericAmount,
            currency,
            bookingDetails: bookingData
          })
        });
        const result = await res.json();
        if (result.url) {
          window.location.href = result.url;
        } else {
          toast.error(result.error || 'Ошибка платёжного шлюза. Попробуйте снова.');
        }
      } else {
        // Бронирование по запросу: отправляем заявку хозяину
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
        const data = await res.json();
        if (data.success) {
          // Сохраняем пользователя в localStorage для последующей авторизации
          if (data.user) {
            localStorage.setItem('villa_user', JSON.stringify(data.user));
          }
          toast.success('Запрос отправлен! Хозяин ответит в течение 24 часов.');
          router.push('/guest?tab=chat');
        } else {
          toast.error(data.error || 'Ошибка оформления заявки. Попробуйте снова.');
        }
      }
    } catch (e) {
      toast.error('Сетевая ошибка при отправке запроса.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white flex flex-col font-sans">
      {/* SEO Метаданные и Schema.org разметка VacationRental */}
      <SEO
        title={`${homeData.title} • Отдых премиум-класса в Дальяне`}
        description={homeData.aboutText}
        ogImage={homeData.heroImage}
      />

      {/* Верхняя панель навигации в стиле AirBnB с переключением ролей */}
      <Navbar />

      {/* Основной контейнер листинга */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">

        {/* Заголовок объекта, подзаголовок, бейджи Суперхозяина, рейтинг и локация */}
        <Hero homeData={homeData} />

        {/* 5-компонентная фотосетка с поддержкой фото из Google Sheets и полноэкранным просмотром */}
        <PhotoGrid
          gallery={currentPublicData.gallery}
          heroImage={homeData.heroImage}
        />

        {/* Двухколоночный макет: Описание и детали слева, виджет бронирования справа */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10 pb-20">

          {/* Левая колонка — Детальная информация об объекте */}
          <div className="lg:col-span-8 space-y-12">

            {/* Блок характеристик виллы */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {homeData.hostHeader}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-rose-400" /> {t('hostSpecsGuests', { count: dynamicRules.maxTotalGuests || 10 })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-rose-400" /> {t('hostSpecsBedrooms', { count: 4 })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-rose-400" /> {t('hostSpecsBeds', { count: 5 })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-rose-400" /> {t('hostSpecsBaths', { count: 4 })}
                  </span>
                </div>
              </div>

              {/* Аватар хозяина */}
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-rose-500/50 shadow-lg shrink-0">
                <img
                  src={homeData.hostAvatar}
                  alt={homeData.hostName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Карточка преимуществ в стиле AirBnB (Highlights) */}
            <div className="space-y-6 pb-8 border-b border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-white/5 text-rose-400 shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">{homeData.highlightSuperhostTitle}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {homeData.highlightSuperhostDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-white/5 text-emerald-400 shrink-0 mt-0.5">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">{homeData.highlightCheckinTitle}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {homeData.highlightCheckinDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-white/5 text-blue-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">{homeData.highlightCancellationTitle}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {homeData.highlightCancellationDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Описание виллы из Google Sheets с кнопкой раскрытия */}
            <div className="space-y-4 pb-8 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{homeData.aboutTitle}</h2>
              <p className="text-slate-300 leading-relaxed line-clamp-4 text-base">
                {homeData.aboutText}
              </p>
              <button
                onClick={() => setAboutModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-4 transition-colors"
              >
                {t('showMoreAboutProperty')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Спальные места (Sleeping Arrangements) */}
            <SleepingArrangements />

            {/* Удобства виллы (Amenities) */}
            <Amenities />

            {/* Дополнительные услуги и видео-путеводители из Google Sheets */}
            <CatalogSection
              products={currentPublicData.products}
              courses={currentPublicData.courses}
              onSelectPresentation={(item, type) => {
                setSelectedPresentation(item);
                setSelectedPresentationType(type);
              }}
            />

            {/* Полноценная категоризированная галерея виллы из Google Sheets */}
            <GallerySection
              gallery={currentPublicData.gallery}
            />

            {/* Отзывы и оценки гостей по категориям */}
            <ReviewsSection />

            {/* Локация и окрестности Дальяна */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-400" /> {homeData.locationTitle}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {homeData.locationDesc}
              </p>
              <div className="w-full h-64 rounded-3xl overflow-hidden border border-white/10 relative shadow-xl">
                <img
                  src={homeData.locationImage}
                  alt={homeData.locationTitle}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-medium text-slate-200">
                    GPS: 36.8336° N, 28.6439° E • 25 минут от аэропорта Даламан (DLM)
                  </div>
                </div>
              </div>
            </div>

            {/* Карточка хоста (Aleksei Znamenskii) */}
            <HostProfileCard />

          </div>

          {/* Правая колонка — Плавающий интерактивный виджет бронирования (Sticky Sidebar) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28">
              <BookingWidget
                dynamicRules={dynamicRules}
                dateRules={dateRules}
                occupiedDates={occupiedDates}
                apiEvents={apiEvents}
                onBookingSubmit={handleBookingSubmit}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Футер сайта с юридическими реквизитами VKN и быстрыми ссылками из Google Sheets */}
      <Footer legalData={currentContentData.legal} />

      {/* Модальное окно авторизации и регистрации (гость / владелец) */}
      <AuthModal />

      {/* Модальное окно двухфакторной аутентификации Google Authenticator */}
      <TwoFaModal />

      {/* Модальное окно презентации услуг / видеогидов */}
      {selectedPresentation && (
        <PresentationModal
          item={selectedPresentation}
          type={selectedPresentationType}
          onClose={() => setSelectedPresentation(null)}
          onPurchase={(price, type, item) => {
            setSelectedPresentation(null);
            toast.success(`Заказ на «${item.name?.[lang] || item.name?.ru || 'услугу'}» принят!`);
          }}
        />
      )}

      {/* Модальное окно полного описания виллы из Google Sheets (таблица About) */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">{t('modalAboutVilla') || 'Об этой вилле'}</h3>
              <button
                onClick={() => setAboutModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">
              {fullDescriptionSections.length > 0 ? (
                fullDescriptionSections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="font-semibold text-white text-base">{sec.title}</h4>
                    <p className="whitespace-pre-line">{sec.text}</p>
                  </div>
                ))
              ) : (
                <p>{homeData.aboutText}</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
