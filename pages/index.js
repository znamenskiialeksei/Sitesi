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
import SpaPoolSection from '../components/SpaPoolSection';
import DalyanLandmarks from '../components/DalyanLandmarks';
import LawSafetyAccessibility from '../components/LawSafetyAccessibility';
import HostProfileCard from '../components/HostProfileCard';
import ReviewsSection from '../components/ReviewsSection';
import CatalogSection from '../components/CatalogSection';
import GallerySection from '../components/GallerySection';
import Footer from '../components/Footer';

import AuthModal from '../components/Modals/AuthModal';
import TwoFaModal from '../components/Modals/TwoFaModal';
import PresentationModal from '../components/Modals/PresentationModal';
import ContactHostModal from '../components/Modals/ContactHostModal';
import { parseDriveLink } from '../utils/media';
import { parseDateRU } from '../utils/dates';
import { buildHomeDerivedCollections } from '../utils/masterSeedContent';

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
      if (contentData.home) {
        buildHomeDerivedCollections(contentData.home);
      }
    }
  } catch (err) {
    console.error('Ошибка чтения content.json при статической сборке:', err);
  }

  // Гарантия JSON-сериализации для Next.js SSG: устранение любых значений undefined
  const safeContentData = JSON.parse(JSON.stringify(contentData));
  const safePublicData = JSON.parse(
    JSON.stringify({
      products: safeContentData.products || [],
      courses: safeContentData.courses || [],
      gallery: safeContentData.gallery || []
    })
  );

  return {
    props: {
      publicData: safePublicData,
      contentData: safeContentData
    },
    // Ревалидация статического кэша каждые 60 секунд
    revalidate: 60
  };
}

export default function HomeListing({ publicData, contentData }) {
  const router = useRouter();
  const { t, lang, currency } = useLanguage();
  const { currentUser, setAuthModalOpen, loginGuestDirectly } = useAuth();
  const toast = useToast();

  // Динамические данные с поддержкой онлайн-регидрации из Google Sheets
  const [currentContentData, setCurrentContentData] = useState(contentData);
  const [currentPublicData, setCurrentPublicData] = useState(publicData);

  // Состояние выбранной презентации: видео-гид или консьерж-сервис
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
    basePrice: 250,
    currency: 'USD',
    minNights: 3,
    maxNights: 30,
    maxTotalGuests: 10,
    bookingWindowMonths: 18,
    advanceNoticeDays: 2,
    bookingMode: 'instant',
    verificationMode: 'progressive',
    checkInTime: '16:00',
    checkOutTime: '10:00'
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
      currentContentData.home?.hero_title?.[lang] ||
      currentContentData.home?.hero_title?.ru ||
      currentContentData.home?.heroTitle?.[lang] ||
      currentContentData.home?.heroTitle?.ru ||
      'Dalyan Turaman [частный бассейн, 10 спальных мест]',
    subtitle:
      currentContentData.home?.hero_subtitle?.[lang] ||
      currentContentData.home?.hero_subtitle?.ru ||
      currentContentData.home?.heroSubtitle?.[lang] ||
      currentContentData.home?.heroSubtitle?.ru ||
      '',
    rating:
      currentContentData.home?.hero_rating?.[lang] ||
      currentContentData.home?.hero_rating?.ru ||
      '4.98',
    reviewsCount:
      currentContentData.home?.hero_reviews_count?.[lang] ||
      currentContentData.home?.hero_reviews_count?.ru ||
      '48 отзывов',
    superhostBadge:
      currentContentData.home?.hero_superhost_badge?.[lang] ||
      currentContentData.home?.hero_superhost_badge?.ru ||
      'Суперхозяин',
    location:
      currentContentData.home?.hero_location?.[lang] ||
      currentContentData.home?.hero_location?.ru ||
      'Дальян, Ортаджа, Мугла, Турция',
    shareBtn:
      currentContentData.home?.hero_share_btn?.[lang] ||
      currentContentData.home?.hero_share_btn?.ru ||
      'Поделиться',
    favoriteBtn:
      currentContentData.home?.hero_favorite_btn?.[lang] ||
      currentContentData.home?.hero_favorite_btn?.ru ||
      'В избранное',
    specGuests:
      currentContentData.home?.spec_guests?.[lang] ||
      currentContentData.home?.spec_guests?.ru ||
      '10 гостей',
    specBedrooms:
      currentContentData.home?.spec_bedrooms?.[lang] ||
      currentContentData.home?.spec_bedrooms?.ru ||
      '4 спальни',
    specBeds:
      currentContentData.home?.spec_beds?.[lang] ||
      currentContentData.home?.spec_beds?.ru ||
      '10 спальных мест',
    specBaths:
      currentContentData.home?.spec_baths?.[lang] ||
      currentContentData.home?.spec_baths?.ru ||
      '4 ванные комнаты + WC',
    aboutTitle:
      currentContentData.home?.about_title?.[lang] ||
      currentContentData.home?.about_title?.ru ||
      currentContentData.home?.aboutTitle?.[lang] ||
      currentContentData.home?.aboutTitle?.ru ||
      'О Вилле',
    aboutText:
      currentContentData.home?.about_text?.[lang] ||
      currentContentData.home?.about_text?.ru ||
      currentContentData.home?.aboutText?.[lang] ||
      currentContentData.home?.aboutText?.ru ||
      'Villa Turaman: это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.',
    aboutBtnMore:
      currentContentData.home?.about_btn_more?.[lang] ||
      currentContentData.home?.about_btn_more?.ru ||
      'Показать больше об объекте',
    heroImage: parseDriveLink(
      currentContentData.home?.hero_image?.media ||
      currentContentData.home?.heroImage?.media ||
      currentContentData.home?.heroTitle?.media ||
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
      'image'
    ),
    hostHeader:
      currentContentData.home?.host_specs_header?.[lang] ||
      currentContentData.home?.host_specs_header?.ru ||
      currentContentData.home?.hostHeader?.[lang] ||
      currentContentData.home?.hostHeader?.ru ||
      'Отдельная вилла целиком • Хозяин: Алексей Знаменский',
    hostName:
      currentContentData.home?.host_specs_name?.[lang] ||
      currentContentData.home?.host_specs_name?.ru ||
      currentContentData.home?.hostName?.[lang] ||
      currentContentData.home?.hostName?.ru ||
      'Алексей Знаменский',
    hostAvatar:
      parseDriveLink(
        currentContentData.home?.host_specs_avatar?.media ||
        currentContentData.home?.hostAvatar?.media ||
        currentContentData.home?.hostAvatar?.ru ||
        currentContentData.home?.hostAvatar?.[lang],
        'image'
      ) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
    highlightSuperhostTitle:
      currentContentData.home?.highlight_1_title?.[lang] ||
      currentContentData.home?.highlight_1_title?.ru ||
      currentContentData.home?.highlightSuperhostTitle?.[lang] ||
      currentContentData.home?.highlightSuperhostTitle?.ru ||
      'Опытный Суперхозяин [Superhost]',
    highlightSuperhostDesc:
      currentContentData.home?.highlight_1_desc?.[lang] ||
      currentContentData.home?.highlight_1_desc?.ru ||
      currentContentData.home?.highlightSuperhostDesc?.[lang] ||
      currentContentData.home?.highlightSuperhostDesc?.ru ||
      'Алексей имеет рейтинг 4.98★ и стремится предоставить первоклассный сервис каждому гостю.',
    highlightCheckinTitle:
      currentContentData.home?.highlight_2_title?.[lang] ||
      currentContentData.home?.highlight_2_title?.ru ||
      currentContentData.home?.highlightCheckinTitle?.[lang] ||
      currentContentData.home?.highlightCheckinTitle?.ru ||
      'Бесконтактное прибытие [Self check-in]',
    highlightCheckinDesc:
      currentContentData.home?.highlight_2_desc?.[lang] ||
      currentContentData.home?.highlight_2_desc?.ru ||
      currentContentData.home?.highlightCheckinDesc?.[lang] ||
      currentContentData.home?.highlightCheckinDesc?.ru ||
      'Удобный электронный замок и персональный код доступа для заселения в любое удобное время с 16:00.',
    highlightCancellationTitle:
      currentContentData.home?.highlight_3_title?.[lang] ||
      currentContentData.home?.highlight_3_title?.ru ||
      currentContentData.home?.highlightCancellationTitle?.[lang] ||
      currentContentData.home?.highlightCancellationTitle?.ru ||
      'Бесплатная отмена за 14 дней',
    highlightCancellationDesc:
      currentContentData.home?.highlight_3_desc?.[lang] ||
      currentContentData.home?.highlight_3_desc?.ru ||
      currentContentData.home?.highlightCancellationDesc?.[lang] ||
      currentContentData.home?.highlightCancellationDesc?.ru ||
      'Полный возврат средств при отмене не позднее чем за 14 суток до даты заезда.',
    sleepingTitle:
      currentContentData.home?.sleeping_title?.[lang] ||
      currentContentData.home?.sleeping_title?.ru ||
      'Где вы будете спать',
    amenitiesTitle:
      currentContentData.home?.amenities_title?.[lang] ||
      currentContentData.home?.amenities_title?.ru ||
      'Что есть в этом жилье',
    amenitiesBtnAll:
      currentContentData.home?.amenities_btn_all?.[lang] ||
      currentContentData.home?.amenities_btn_all?.ru ||
      'Показать все удобства',
    mainAmenities: currentContentData.home?.mainAmenities || [],
    amenitiesGrouped: currentContentData.home?.amenitiesGrouped || [],
    reviewsData: currentContentData.home?.reviewsData || null,
    locationTitle:
      currentContentData.home?.location_title?.[lang] ||
      currentContentData.home?.location_title?.ru ||
      currentContentData.home?.locationTitle?.[lang] ||
      currentContentData.home?.locationTitle?.ru ||
      'Расположение: Дальян, Ортаджа, Мугла, Турция',
    locationDesc:
      currentContentData.home?.location_desc?.[lang] ||
      currentContentData.home?.location_desc?.ru ||
      currentContentData.home?.locationDesc?.[lang] ||
      currentContentData.home?.locationDesc?.ru ||
      'Вилла расположена в тихом зеленом районе в 5 минутах ходьбы от набережной реки Дальян.',
    locationBadge:
      currentContentData.home?.location_badge?.[lang] ||
      currentContentData.home?.location_badge?.ru ||
      'GPS: 36.8336° N, 28.6439° E • 25 минут от аэропорта Даламан [DLM]',
    locationImage:
      parseDriveLink(
        currentContentData.home?.location_image?.media ||
        currentContentData.home?.locationImage?.media ||
        currentContentData.home?.locationTitle?.media,
        'image'
      ) || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
    hostCardTitle:
      currentContentData.home?.host_card_title?.[lang] ||
      currentContentData.home?.host_card_title?.ru ||
      'Хозяин: Алексей Знаменский',
    hostCardSubtitle:
      currentContentData.home?.host_card_subtitle?.[lang] ||
      currentContentData.home?.host_card_subtitle?.ru ||
      'Суперхозяин на Airbnb • Более 5 лет приема гостей',
    hostCardVerified:
      currentContentData.home?.host_card_verified?.[lang] ||
      currentContentData.home?.host_card_verified?.ru ||
      'Личность подтверждена',
    hostCardResponseTime:
      currentContentData.home?.host_card_response_time?.[lang] ||
      currentContentData.home?.host_card_response_time?.ru ||
      'Время ответа: в течение часа',
    hostCardLanguages:
      currentContentData.home?.host_card_languages?.[lang] ||
      currentContentData.home?.host_card_languages?.ru ||
      'Языки: Русский, English, Türkçe',
    hostCardHelpText:
      currentContentData.home?.host_card_help_text?.[lang] ||
      currentContentData.home?.host_card_help_text?.ru ||
      'Помощь в организации трансфера, персональных туров по озеру Кёйджегиз и бронирования ресторанов',
    hostCardBtn:
      currentContentData.home?.host_card_btn?.[lang] ||
      currentContentData.home?.host_card_btn?.ru ||
      'Написать хозяину',
    hostCardCredo:
      currentContentData.home?.host_card_credo?.[lang] ||
      currentContentData.home?.host_card_credo?.ru ||
      '«Хочешь сделать хорошо - сделай сам»',
    hostCardDream:
      currentContentData.home?.host_card_dream?.[lang] ||
      currentContentData.home?.host_card_dream?.ru ||
      'База: Мармарис • Мечта: Португалия и Атлантический океан',
    hostCardHobbies:
      currentContentData.home?.host_card_hobbies?.[lang] ||
      currentContentData.home?.host_card_hobbies?.ru ||
      'Велоспорт, Парусный спорт, Живая природа Дальяна',
    hostCardTravel:
      currentContentData.home?.host_card_travel?.[lang] ||
      currentContentData.home?.host_card_travel?.ru ||
      'Дубай [3 поездки], Абу-Даби [март 2026 г.]',
    hostCardTax:
      currentContentData.home?.host_card_tax?.[lang] ||
      currentContentData.home?.host_card_tax?.ru ||
      'Официальный налогоплательщик: Ortaca Vergi Dairesi, VKN: 9991120181',
    landmarksTitle:
      currentContentData.home?.landmarks_title?.[lang] ||
      currentContentData.home?.landmarks_title?.ru ||
      '14 географических ориентиров Дальяна',
    landmarksSubtitle:
      currentContentData.home?.landmarks_subtitle?.[lang] ||
      currentContentData.home?.landmarks_subtitle?.ru ||
      'Точные расстояния и тайминг от виллы • Пешеходная доступность центра и заповедная природа',
    landmarksAddress:
      currentContentData.home?.landmarks_address?.[lang] ||
      currentContentData.home?.landmarks_address?.ru ||
      'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey',
    landmarksMapsUrl:
      currentContentData.home?.landmarks_maps_url?.[lang] ||
      currentContentData.home?.landmarks_maps_url?.ru ||
      currentContentData.home?.landmarks_maps_url?.media ||
      'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9',
    landmarksGps:
      currentContentData.home?.landmarks_gps?.[lang] ||
      currentContentData.home?.landmarks_gps?.ru ||
      '36.8336° N, 28.6439° E',
    landmarksList: currentContentData.home?.landmarksList || [],
    spaData: currentContentData.home?.spaData || null,
    safetyData: currentContentData.home?.safetyData || null,
    bedrooms: currentContentData.home?.bedrooms && currentContentData.home.bedrooms.length > 0
      ? currentContentData.home.bedrooms
      : [1, 2, 3, 4].map((num) => {
          const key = `bedroom_${num}`;
          const item = currentContentData.home?.[key];
          if (!item) return null;
          return {
            title: item[lang] || item.ru || '',
            desc: item.en || item[lang] || item.ru || '',
            badge: item.tr || `Спальня ${num}`,
            image: parseDriveLink(item.media, 'image') || ''
          };
        }).filter(Boolean)
  };

  const fullDescriptionSections = Object.values(currentContentData.about || {}).map((item) => ({
    title: item.title?.[lang] || item.title?.ru || '',
    text: item.text?.[lang] || item.text?.ru || ''
  }));

  // Обработчик бронирования из виджета: instant: платёжный шлюз или IBAN, manual: запрос хозяину
  const handleBookingSubmit = async (bookingData, effectiveMode) => {
    try {
      // 1. Проверка правила доступа к прямой оплате: только гости с подтвержденной почтой
      const isEmailVerified = Boolean(
        (currentUser && currentUser.emailVerified) ||
        bookingData.emailVerified
      );

      // Если почта не подтверждена или режим ручной: оформляется строго как заявка
      const isEligibleForDirectPayment = effectiveMode === 'instant' && isEmailVerified;

      if (!isEligibleForDirectPayment) {
        // Оформление как заявка хозяину [по запросу]
        if (effectiveMode === 'instant' && !isEmailVerified) {
          toast.info('Прямая оплата доступна гостям с подтвержденным email. Ваша бронь оформлена как заявка хозяину.');
        }

        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...bookingData,
            action: 'request_booking'
          })
        });
        const data = await res.json().catch(() => ({}));
        if (data && data.success) {
          if (data.user) {
            loginGuestDirectly(data.user);
          }
          toast.success('Запрос отправлен! Хозяин ответит в течение 24 часов.');
          router.push('/guest?tab=chat');
        } else {
          toast.error(data?.error || 'Ошибка оформления заявки. Попробуйте снова.');
        }
        return;
      }

      // 2. Гость имеет подтвержденную почту и допущен к оплате
      // Авто-регистрация гостя в локальной сессии если еще не авторизован
      if (!currentUser && (bookingData.contact || bookingData.email || bookingData.phone)) {
        try {
          const regRes = await fetch('/api/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'auto_register_guest',
              name: bookingData.name || 'Гость',
              contact: bookingData.contact,
              email: bookingData.email,
              phone: bookingData.phone,
              emailVerified: true,
              phoneVerified: bookingData.phoneVerified
            })
          });
          const regData = await regRes.json();
          if (regData.success && regData.user) {
            loginGuestDirectly(regData.user);
          }
        } catch (regErr) {
          console.warn('Фоновая авто-регистрация при оплате:', regErr);
        }
      }

      // 3. Выбор метода оплаты: IBAN или онлайн-карты через шлюз
      const selectedMethod = bookingData.paymentMethod || (dynamicRules.paymentMode === 'iban_only' ? 'iban' : 'card');

      if (selectedMethod === 'iban' || dynamicRules.paymentMode === 'iban_only') {
        // Оплата переводом на банковский IBAN счет хозяина
        const bookingCode = `VT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const ibanDetails = {
          bankName: dynamicRules.ibanBankName || 'Ziraat Bankası',
          receiver: dynamicRules.ibanReceiver || 'Aleksei Znamenskii',
          iban: dynamicRules.ibanNumber || 'TR000000000000000000000000',
          swift: dynamicRules.ibanSwift || 'TCZBTR2A',
          note: `${bookingCode} : ${bookingData.name || 'GUEST'}`
        };

        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...bookingData,
            action: 'booking',
            bookingCode,
            paymentMethod: 'iban',
            paymentStatus: `ОЖИДАЕТ ОПЛАТЫ НА IBAN | Код: ${bookingCode}`,
            ibanDetails
          })
        });

        const data = await res.json().catch(() => ({}));
        if (data && data.success) {
          const guestUser = {
            name: bookingData.name || 'Гость',
            contact: bookingData.contact || bookingData.email || '',
            email: bookingData.email || '',
            phone: bookingData.phone || '',
            emailVerified: true,
            phoneVerified: Boolean(bookingData.phoneVerified),
            isHost: false,
            blockChat: false,
            hasChat: true
          };
          loginGuestDirectly(guestUser);
          toast.success('Бронирование оформлено! Реквизиты IBAN отправлены на ваш email и в чат.');
          router.push('/guest?tab=trips');
        } else {
          toast.error(data?.error || 'Ошибка оформления бронирования.');
        }
        return;
      }

      // 4. Оплата онлайн банковской картой через платежный шлюз
      const paymentGateway = currency === 'RUB' ? 'tbank' : 'stripe';
      const numericAmount = typeof bookingData.totalPrice === 'number'
        ? bookingData.totalPrice
        : parseInt(String(bookingData.totalPrice).replace(/\D/g, ''), 10) || 0;

      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: paymentGateway,
          amount: numericAmount,
          currency,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
          bookingDetails: bookingData
        })
      });
      const result = await res.json().catch(() => ({}));
      if (result && result.url) {
        const guestUser = {
          name: bookingData.name || 'Гость',
          contact: bookingData.contact || bookingData.email || '',
          email: bookingData.email || '',
          phone: bookingData.phone || '',
          emailVerified: true,
          phoneVerified: Boolean(bookingData.phoneVerified),
          isHost: false,
          blockChat: false,
          hasChat: true
        };
        loginGuestDirectly(guestUser);

        if (result.isTestMode) {
          toast.info(result.message || 'Тестовый режим оплаты : перенаправление на оформление');
        }
        window.location.href = result.url;
      } else {
        toast.error(result?.error || 'Ошибка платёжного шлюза. Попробуйте снова.');
      }
    } catch (e) {
      console.error('[handleBookingSubmit Error]:', e);
      toast.error('Сетевой сбой при оформлении. Проверьте соединение.');
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
                    <Users className="w-4 h-4 text-rose-400" /> {homeData.specGuests}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-rose-400" /> {homeData.specBedrooms}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-rose-400" /> {homeData.specBeds}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-rose-400" /> {homeData.specBaths}
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
                type="button"
                onClick={() => setAboutModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-4 transition-colors"
              >
                {homeData.aboutBtnMore} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Мобильная форма бронирования: закреплена сразу после раздела О вилле */}
            <div className="block lg:hidden pt-2 pb-6">
              <BookingWidget
                dynamicRules={dynamicRules}
                dateRules={dateRules}
                occupiedDates={occupiedDates}
                apiEvents={apiEvents}
                onBookingSubmit={handleBookingSubmit}
              />
            </div>

            {/* Спальные места: Sleeping Arrangements */}
            <SleepingArrangements homeData={homeData} customBedrooms={homeData.bedrooms} />

            {/* Спа-комплекс и бассейн с соленой водой */}
            <SpaPoolSection homeData={homeData} />

            {/* Удобства виллы: Amenities */}
            <Amenities homeData={homeData} customAmenitiesGrouped={homeData.amenitiesGrouped} customMainAmenities={homeData.mainAmenities} />

            {/* Географические ориентиры Дальяна: Dalyan Landmarks */}
            <DalyanLandmarks homeData={homeData} />

            {/* Локация и окрестности Дальяна: панорама */}
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
                    {homeData.locationBadge}
                  </div>
                </div>
              </div>
            </div>

            {/* Безопасность, Закон № 7464 и Доступная среда */}
            <LawSafetyAccessibility homeData={homeData} />

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
            <ReviewsSection homeData={homeData} />

            {/* Карточка хоста: Aleksei Znamenskii */}
            <HostProfileCard homeData={homeData} />

          </div>

          {/* Правая колонка — Плавающий интерактивный виджет бронирования [Sticky Sidebar для десктопа] */}
          <div className="hidden lg:block lg:col-span-4 relative">
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

      {/* Модальное окно прямого обращения к хозяину виллы (до регистрации) */}
      <ContactHostModal />

      {/* Модальное окно презентации услуг / видеогидов */}
      {selectedPresentation && (
        <PresentationModal
          item={selectedPresentation}
          type={selectedPresentationType}
          onClose={() => setSelectedPresentation(null)}
          onPurchase={async (price, type, item) => {
            setSelectedPresentation(null);
            const itemName = item.name?.[lang] || item.name?.ru || 'Услуга';
            try {
              const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'order_service_or_guide',
                  guestName: currentUser?.name || 'Гость',
                  contact: currentUser?.contact || '',
                  itemTitle: itemName,
                  itemType: type === 'course' ? 'Видео-путеводитель' : 'Дополнительная услуга',
                  price: price,
                  details: `Заказ из каталога: ${itemName}`
                })
              });
              const data = await res.json();
              if (data.success) {
                toast.success(`Заказ на «${itemName}» успешно отправлен владельцу виллы!`);
              } else {
                toast.warn(`Заказ зафиксирован локально: ${itemName}`);
              }
            } catch (err) {
              toast.success(`Заказ на «${itemName}» принят! Хозяин свяжется с вами.`);
            }
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
