import Head from 'next/head'; 
import { useState, useEffect, useRef } from 'react'; 
import DatePicker, { registerLocale } from 'react-datepicker'; 
import { addMonths, addDays, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, format, parse } from 'date-fns'; 
import { ru, enUS, tr } from 'date-fns/locale'; 
import { MessageCircle, Users, Check, X, ChevronRight, ChevronLeft, Clock, Calendar as CalendarIcon, User, Lock, Send, Paperclip, Settings, FileText, Layers, ShoppingBag, PlayCircle, Info, ChevronDown } from 'lucide-react'; 
import { useLanguage } from '../utils/language';
import SEO from '../components/SEO';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

registerLocale('ru', ru); registerLocale('en', enUS); registerLocale('tr', tr);

// Обработка прямых ссылок Google Drive для Карусели и Hero блока (Задача 1.2)
const parseDriveLink = (url, type = 'image') => {
  if (!url) return "";
  const strItem = String(url).trim();
  const driveMatch = strItem.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
      return type === 'image' 
        ? `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1920` 
        : `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  return strItem;
}

const MediaCarousel = ({ media, type = 'image' }) => {
  const [idx, setIdx] = useState(0);
  if (!media || media.length === 0) return <div className="h-full bg-slate-800 flex items-center justify-center text-slate-500">Нет медиа</div>;
  const renderMediaItem = (item) => {
    if (!item) return null;
    const strItem = String(item).trim();
    if (strItem.toLowerCase().startsWith('<iframe')) return <div className="absolute inset-0 w-full h-full bg-black/40 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:object-contain" dangerouslySetInnerHTML={{ __html: strItem }} />;
    const finalUrl = parseDriveLink(strItem, type);
    if (finalUrl.includes('/preview')) return <iframe src={finalUrl} className="absolute inset-0 w-full h-full object-contain bg-black/40 border-0" allow="autoplay; encrypted-media" allowFullScreen></iframe>;
    if (type === 'image') return <img src={finalUrl} className="absolute inset-0 w-full h-full object-cover bg-black/40 transition-opacity duration-300" alt="media" />;
    return <video src={finalUrl} controls controlsList="nodownload" className="absolute inset-0 w-full h-full object-contain bg-black/40" />;
  };

  return (
    <div className="relative w-full h-full group">
      {renderMediaItem(media[idx])}
      {media.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setIdx((prev) => (prev - 1 + media.length) % media.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={16}/></button>
          <button onClick={(e) => { e.stopPropagation(); setIdx((prev) => (prev + 1) % media.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={16}/></button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">{media.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`}/>)}</div>
        </>
      )}
    </div>
  );
};

const SITE_CONFIG = {
  vesselName: "Villa Turaman", telegramContact: "AlekseiZnamenskii", whatsappContact: "79000000000",
  checkInTime: "15:00", checkOutTime: "11:00",
  basePrice: 15000, currency: 'RUB', minNights: 3, maxNights: 30, maxTotalGuests: 10, bookingWindowMonths: 18, advanceNoticeDays: 2, bookingMode: "instant"
};
const CURRENCY_SYMBOLS = { 'RUB': '₽', 'TRY': '₺', 'USD': '$', 'EUR': '€', 'GBP': '£' };

const parseDateRU = (str) => {
  if (!str || typeof str !== 'string') return new Date(NaN);
  const parts = str.split('.');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10); const m = parseInt(parts[1], 10) - 1; const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m, d);
  }
  return new Date(NaN);
};

export async function getStaticProps() {
  const contentPath = path.join(process.cwd(), 'utils', 'content.json');
  let contentData = { home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] };
  try { contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8')); } catch (err) {}
  return { 
      props: { 
          publicData: { products: contentData.products || [], courses: contentData.courses || [], gallery: contentData.gallery || [] }, 
          contentData 
      }, 
      revalidate: 60 
  };
}

export default function Home({ publicData, contentData }) {
  const { t, changeLanguage, lang } = useLanguage();
  const [presentationModal, setPresentationModal] = useState(null); 
  
  const homeData = {
    title: contentData.home?.heroTitle?.[lang] || contentData.home?.heroTitle?.ru || SITE_CONFIG.vesselName,
    subtitle: contentData.home?.heroSubtitle?.[lang] || contentData.home?.heroSubtitle?.ru || t('heroSubtitle'),
    aboutTitle: contentData.home?.aboutTitle?.[lang] || contentData.home?.aboutTitle?.ru || t('aboutTitle'),
    aboutText: contentData.home?.aboutText?.[lang] || contentData.home?.aboutText?.ru || t('aboutText'),
    heroImage: parseDriveLink(contentData.home?.heroImage?.media || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600", 'image')
  };

  const fullDescription = { sections: Object.values(contentData.about || {}).map(item => ({ title: item.title[lang] || item.title.ru, text: item.text[lang] || item.text.ru })) };
  const roomGalleries = [
    { id: 'pool', label: t('tabPool'), images: ['https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200'] },
    { id: 'rooms', label: t('tabRooms'), images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'] },
    { id: 'kitchen', label: t('tabKitchen'), images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200'] }
  ];
  
  const [status, setStatus] = useState('idle'); const [descModal, setDescModal] = useState(false); const [galleryModal, setGalleryModal] = useState(false); 
  const [activeCategory, setActiveCategory] = useState('education'); const [lightboxIndex, setLightboxIndex] = useState(null); 
  const [adults, setAdults] = useState(2); const [children, setChildren] = useState(0); 
  
  const [apiOccupiedDates, setApiOccupiedDates] = useState([]); const [apiEvents, setApiEvents] = useState([]);
  const [manualBlockedDates, setManualBlockedDates] = useState([]);
  const occupiedDates = [...apiOccupiedDates, ...manualBlockedDates];
  
  const [dateRange, setDateRange] = useState([null, null]); const [startDate, endDate] = dateRange;
  const [isGuestCalendarOpen, setIsGuestCalendarOpen] = useState(false);
  const [guestCurrentMonth, setGuestCurrentMonth] = useState(new Date());

  const [dynamicRules, setDynamicRules] = useState({
    basePrice: SITE_CONFIG.basePrice, currency: SITE_CONFIG.currency, minNights: SITE_CONFIG.minNights, maxNights: SITE_CONFIG.maxNights, bookingWindowMonths: SITE_CONFIG.bookingWindowMonths, advanceNoticeDays: SITE_CONFIG.advanceNoticeDays, bookingMode: SITE_CONFIG.bookingMode, checkInTime: SITE_CONFIG.checkInTime, checkOutTime: SITE_CONFIG.checkOutTime
  });
  
  const [dateRules, setDateRules] = useState([]); const [variablesDict, setVariablesDict] = useState({});
  const [authMode, setAuthMode] = useState('none'); const [currentUser, setCurrentUser] = useState(null); 
  const [siteBlocked, setSiteBlocked] = useState(false); const [pendingHostUser, setPendingHostUser] = useState(null);
  const [twoFaInput, setTwoFaInput] = useState(''); const [twoFaError, setTwoFaError] = useState(''); const [qrCodeUrl, setQrCodeUrl] = useState('');
  const twoFaSecret = process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET;
  
  const [chatMessages, setChatMessages] = useState([]); const [guestActiveRequests, setGuestActiveRequests] = useState([]);
  const [timeLefter, setTimeLefter] = useState({}); const [chatInput, setChatInput] = useState(''); const [chatFile, setChatFile] = useState(null); const [chatLoading, setChatLoading] = useState(false); 
  
  const [hostTab, setHostTab] = useState('chats'); const [masterAllChats, setMasterAllChats] = useState([]); 
  const [selectedClientSheets, setSelectedClientSheets] = useState([]); const [lmsModules, setLmsModules] = useState([]); 
  const [masterChatInput, setMasterChatInput] = useState(''); const [offerModal, setOfferModal] = useState(false);
  const [offerData, setOfferData] = useState({ checkIn: '', checkOut: '', price: '', rowIndex: null, contact: '' });
  const [expandedTemplate, setExpandedTemplate] = useState(null); // Управление раскрытием карточек шаблонов
  
  const [calSetRange, setCalSetRange] = useState([null, null]); const [editStatus, setEditStatus] = useState('Открыто'); const [editPrice, setEditPrice] = useState(''); const [editMinNights, setEditMinNights] = useState(''); const [editNote, setEditNote] = useState(''); const [editBookingMode, setEditBookingMode] = useState('');
  const [masterChatFile, setMasterChatFile] = useState(null); const [hostCurrentMonth, setHostCurrentMonth] = useState(new Date());
  
  const [agreedKVKK, setAgreedKVKK] = useState(false); const [agreedContract, setAgreedContract] = useState(false); const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const getCurrencyByLang = () => { if (lang === 'ru') return 'RUB'; if (lang === 'tr') return 'TRY'; return 'EUR'; };
  const activeCurrency = getCurrencyByLang();

  const lodgingSchema = {
    "@context": "https://schema.org", "@type": "VacationRental", "name": homeData.title, "description": homeData.aboutText, "image": homeData.heroImage,
    "address": { "@type": "PostalAddress", "addressLocality": "Dalyan", "addressRegion": "Muğla", "addressCountry": "TR" },
    "priceRange": `${dynamicRules.basePrice} ${dynamicRules.currency}`, "offers": { "@type": "Offer", "price": dynamicRules.basePrice, "priceCurrency": dynamicRules.currency, "availability": "https://schema.org/InStock" }
  };
  const productsSchema = publicData.products.map(p => ({ "@type": "Product", "name": p.name[lang] || p.name.ru, "description": p.desc[lang] || p.desc.ru, "image": p.images[0] || "", "offers": { "@type": "Offer", "price": p.price[activeCurrency.toLowerCase()] || p.price.eur, "priceCurrency": activeCurrency } }));
  const mainSchema = { "@context": "https://schema.org", "@graph": [lodgingSchema, ...productsSchema] };

  const LegalCheckboxes = () => (
    <div className="flex flex-col gap-3 mt-3 mb-3 bg-slate-700/50 p-4 rounded-xl border border-white/10 shadow-inner w-full">
      <label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={agreedKVKK} onChange={(e) => setAgreedKVKK(e.target.checked)} className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0" /><span className="text-[10px] md:text-xs text-slate-200 group-hover:text-white transition-colors leading-tight">{t('legalKVKK')} <Link href={`/legal/kvkk`} target="_blank" className="text-blue-400 underline hover:text-blue-300 ml-1">{t('linkKVKK')}</Link></span></label>
      <label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={agreedContract} onChange={(e) => setAgreedContract(e.target.checked)} className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0" /><span className="text-[10px] md:text-xs text-slate-200 group-hover:text-white transition-colors leading-tight">{t('legalContract')} <Link href={`/legal/contract`} target="_blank" className="text-blue-400 underline hover:text-blue-300 mx-1">{t('linkContract')}</Link></span></label>
      <label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={agreedPrivacy} onChange={(e) => setAgreedPrivacy(e.target.checked)} className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0" /><span className="text-[10px] md:text-xs text-slate-200 group-hover:text-white transition-colors leading-tight">{t('legalPrivacy')} <Link href={`/legal/privacy`} target="_blank" className="text-blue-400 underline hover:text-blue-300 ml-1">{t('linkPrivacy')}</Link></span></label>
    </div>
  );

  const currentImages = roomGalleries.find(c => c.id === activeCategory)?.images || [];
  const chatBottomRef = useRef(null);
  const activeChat = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName));
  const activeRequestsList = activeChat?.activeRequests || [];

  const getNoticeText = (days) => { if (days === 0) return t('todayLabel'); if (days === 1) return `1 ${t('dayLabel')}`; return `${days} ${t('daysLabel')}`; };
  const translateStatus = (st) => {
    if (!st) return ''; if (st.includes('ЗАПРОС')) return t('statusPending') || 'ЗАПРОС'; if (st.includes('ОЖИДАЕТ ОПЛАТЫ')) return t('statusAwaitingPay') || 'ОЖИДАЕТ ОПЛАТЫ';
    if (st.includes('СПЕЦПРЕДЛОЖЕНИЕ')) return t('statusOffer') || 'СПЕЦПРЕДЛОЖЕНИЕ'; if (st.includes('ОПЛАЧЕНО')) return t('statusPaid') || 'ОПЛАЧЕНО';
    if (st.includes('ОТОЗВАНО')) return t('statusRevoked') || 'ОТОЗВАНО'; if (st.includes('ОТКЛОНЕНО')) return t('statusRejected') || 'ОТКЛОНЕНО'; return st;
  };

  const getPriceForDate = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) { if (rule.type === 'Цена') return rule.value; if (rule.type === 'Сброс цены') return dynamicRules.basePrice; }
    }
    return dynamicRules.basePrice;
  };

  const isManualBlocked = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) { if (rule.type === 'Блокировка') return true; if (rule.type === 'Сброс блокировки') return false; }
    }
    return false;
  };

  const getMinNightsForDate = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) { if (rule.type === 'Мин. дней') return parseInt(rule.value) || dynamicRules.minNights; if (rule.type === 'Сброс мин. дней') return dynamicRules.minNights; }
    }
    return dynamicRules.minNights;
  };

  const getTranslated = (obj, key) => { if (!obj || typeof obj !== 'object') return ''; return obj[key]?.[lang] || obj[key]?.['ru'] || ''; };
  const getProductType = (obj) => { if (!obj || typeof obj !== 'object') return ''; return obj.type?.[lang] || obj.type?.['ru'] || ''; };
  const getNoteForDate = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) { if (rule.type === 'Заметка') return rule.note; if (rule.type === 'Сброс заметки') return ''; }
    }
    return '';
  };

  const getBookingModeForDateRange = (sDate, eDate) => {
    if (!sDate) return dynamicRules.bookingMode || 'instant';
    let isManual = false; let cur = new Date(sDate); cur.setHours(0,0,0,0); const end = eDate ? new Date(eDate) : new Date(sDate); end.setHours(0,0,0,0);
    while (cur <= end) {
      let dailyMode = dynamicRules.bookingMode || 'instant';
      for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        if (cur >= rS && cur <= rE) { if (rule.type === 'Тип бронирования' || rule.type === 'Тип записи') dailyMode = rule.value; if (rule.type === 'Сброс типа бронирования') dailyMode = dynamicRules.bookingMode || 'instant'; }
      }
      if (dailyMode === 'manual') isManual = true;
      cur.setDate(cur.getDate() + 1);
    }
    return isManual ? 'manual' : 'instant';
  };

  const getBookingModeForSingleDate = (date) => getBookingModeForDateRange(date, date);
  const currentBookingMode = getBookingModeForDateRange(startDate, endDate);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_settings' }) });
      const data = await res.json();
      if (data.success) {
        if (data.globalRules) { setDynamicRules({ basePrice: !isNaN(parseInt(data.globalRules.basePrice)) ? parseInt(data.globalRules.basePrice) : SITE_CONFIG.basePrice, currency: data.globalRules.currency || SITE_CONFIG.currency, minNights: !isNaN(parseInt(data.globalRules.minNights)) ? parseInt(data.globalRules.minNights) : SITE_CONFIG.minNights, maxNights: !isNaN(parseInt(data.globalRules.maxNights)) ? parseInt(data.globalRules.maxNights) : SITE_CONFIG.maxNights, bookingWindowMonths: !isNaN(parseInt(data.globalRules.bookingWindowMonths)) ? parseInt(data.globalRules.bookingWindowMonths) : SITE_CONFIG.bookingWindowMonths, advanceNoticeDays: !isNaN(parseInt(data.globalRules.advanceNoticeDays)) ? parseInt(data.globalRules.advanceNoticeDays) : SITE_CONFIG.advanceNoticeDays, bookingMode: data.globalRules.bookingMode || SITE_CONFIG.bookingMode, checkInTime: data.globalRules.checkInTime || SITE_CONFIG.checkInTime, checkOutTime: data.globalRules.checkOutTime || SITE_CONFIG.checkOutTime }); }
        if (data.dateRules) {
          setDateRules(data.dateRules); let manualBlocks = new Set();
          [...data.dateRules].reverse().forEach(rule => {
              const rs = parseDateRU(rule.start); const re = parseDateRU(rule.end);
              if (isNaN(rs) || isNaN(re)) return; 
              let cur = new Date(rs.getFullYear(), rs.getMonth(), rs.getDate()); const end = new Date(re.getFullYear(), re.getMonth(), re.getDate());
              while (cur <= end) {
                  const dateStr = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
                  if (rule.type === 'Блокировка') manualBlocks.add(dateStr); if (rule.type === 'Сброс блокировки') manualBlocks.delete(dateStr);
                  cur.setDate(cur.getDate() + 1);
              }
          });
          setManualBlockedDates(Array.from(manualBlocks).map(ds => { const [y, m, d] = ds.split('-'); return new Date(y, parseInt(m), parseInt(d)); }));
        }
        if (data.variablesDict) setVariablesDict(data.variablesDict);
      }
    } catch (err) {}
  };

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch('/api/calendar');
        if (res.ok) {
           const data = await res.json();
           if (data && data.dates) { setApiOccupiedDates(data.dates.map(d => { const [y, m, day] = d.split('-'); return new Date(y, m - 1, day); })); setApiEvents(data.events || []); }
           else if (Array.isArray(data)) setApiOccupiedDates(data.map(d => { const [y, m, day] = d.split('-'); return new Date(y, m - 1, day); }));
        }
      } catch (err) {}
    }
    fetchCalendar(); fetchSettings(); 

    const savedUser = localStorage.getItem('villa_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.hasChat && !parsed.blockChat && !parsed.isHost) setActiveCategory('chat');
      if (parsed.isHost) {
        const session = localStorage.getItem('owner_session');
        if (!session) setPendingHostUser(parsed); else handleAuthSubmit(null, parsed.contact, parsed.password, 'login', true);
      } else { handleAuthSubmit(null, parsed.contact, parsed.password, 'login'); }
    }
  }, []);

  useEffect(() => {
    if (pendingHostUser && twoFaSecret) {
      import('qrcode').then((QRCode) => { QRCode.toDataURL(`otpauth://totp/AlekseiZnamenskii:Owner?secret=${twoFaSecret}&issuer=AlekseiZnamenskii`, (err, url) => { if (!err) setQrCodeUrl(url); }); });
    }
  }, [pendingHostUser, twoFaSecret]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = {}; let changed = false;
      guestActiveRequests.forEach(req => {
         if (req.expiresAt && (req.status === 'ОЖИДАЕТ ОПЛАТЫ' || req.status === 'СПЕЦПРЕДЛОЖЕНИЕ')) {
            const diff = new Date(req.expiresAt).getTime() - Date.now();
            if (diff <= 0) newTimes[req.rowIndex] = 'EXPIRED';
            else {
               const h = Math.floor(diff / (1000 * 60 * 60)); const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); const s = Math.floor((diff % (1000 * 60)) / 1000);
               newTimes[req.rowIndex] = `${h}ч ${m}м ${s}с`;
            }
            changed = true;
         }
      });
      if (changed) setTimeLefter(newTimes);
    }, 1000);
    return () => clearInterval(interval);
  }, [guestActiveRequests]);

  useEffect(() => {
    if (calSetRange[0] && calSetRange[0] === calSetRange[1]) {
        const checkDate = calSetRange[0];
        setEditPrice(getPriceForDate(checkDate) != dynamicRules.basePrice ? getPriceForDate(checkDate) : ''); setEditMinNights(getMinNightsForDate(checkDate) != dynamicRules.minNights ? getMinNightsForDate(checkDate) : ''); setEditStatus(isManualBlocked(checkDate) ? 'Заблокировано' : 'Открыто'); setEditNote(getNoteForDate(checkDate) || ''); setEditBookingMode('');
    } else if (calSetRange[0] && !calSetRange[1]) {
        const checkDate = calSetRange[0];
        setEditPrice(getPriceForDate(checkDate) != dynamicRules.basePrice ? getPriceForDate(checkDate) : ''); setEditMinNights(getMinNightsForDate(checkDate) != dynamicRules.minNights ? getMinNightsForDate(checkDate) : ''); setEditStatus(isManualBlocked(checkDate) ? 'Заблокировано' : 'Открыто'); setEditNote(getNoteForDate(checkDate) || ''); setEditBookingMode('');
    } else { setEditPrice(''); setEditMinNights(''); setEditStatus('Открыто'); setEditNote(''); setEditBookingMode(''); }
  }, [calSetRange, dynamicRules, dateRules]);

  useEffect(() => {
    let interval;
    if (currentUser?.hasChat && !currentUser?.blockChat && !currentUser?.isHost) { fetchChatMessages(); interval = setInterval(fetchChatMessages, 60000); }
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    let interval;
    if (currentUser?.isHost && currentUser?.permissions?.chats) { fetchMasterChats(); interval = setInterval(fetchMasterChats, 60000); }
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => { if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, masterAllChats, selectedClientSheets]);

  const nextPhoto = (e) => { e?.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % currentImages.length); };
  const prevPhoto = (e) => { e?.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length); };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') nextPhoto(); if (e.key === 'ArrowLeft') prevPhoto(); if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const handleAuthSubmit = async (e, contactFallback, passwordFallback, mode, skip2FA = false) => {
    if (e) e.preventDefault(); const formData = e ? new FormData(e.target) : null;
    const payload = { action: mode, name: formData ? formData.get('name') : null, contact: formData ? formData.get('contact') : contactFallback, password: formData ? formData.get('password') : passwordFallback };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await res.json();
    if (result.success) {
      const userObj = { ...result.user, password: payload.password || "123456" }; 
      if (userObj.isHost && !skip2FA && process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET) {
        if (localStorage.getItem('owner_session')) { localStorage.setItem('villa_user', JSON.stringify(userObj)); setCurrentUser(userObj); setAuthMode('none'); } 
        else { setPendingHostUser(userObj); setAuthMode('none'); }
      } else { localStorage.setItem('villa_user', JSON.stringify(userObj)); setCurrentUser(userObj); setAuthMode('none'); }
    } else {
      if (result.blockType === 'site') { setSiteBlocked(true); localStorage.removeItem('villa_user'); alert(t(result.error)); } 
      else { if (e) alert(t(result.error)); if (!e) localStorage.removeItem('villa_user'); }
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault(); setTwoFaError('');
    try {
      const res = await fetch('/api/admin/verify-2fa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: twoFaInput }) });
      const result = await res.json();
      if (result.success) {
        localStorage.setItem('owner_session', result.sessionToken); localStorage.setItem('villa_user', JSON.stringify(pendingHostUser));
        setCurrentUser(pendingHostUser); setPendingHostUser(null); setTwoFaInput('');
      } else { setTwoFaError(t(result.error || 'error_2fa_verification')); }
    } catch (err) { setTwoFaError(t('error_network')); }
  };

  const handleLogout = () => { localStorage.removeItem('villa_user'); localStorage.removeItem('owner_session'); setCurrentUser(null); setPendingHostUser(null); };

  const fetchChatMessages = async () => {
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'chat', contact: currentUser.contact, sender: currentUser.name }) });
    const data = await res.json(); 
    if (data.success && data.messages) { setChatMessages(data.messages); setGuestActiveRequests(data.activeRequests || []); }
  };

  const fetchMasterChats = async () => {
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_get_chats' }) });
    const data = await res.json(); if (data.success && data.chats) setMasterAllChats(data.chats);
    const lmsRes = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_get_lms' }) });
    const lmsData = await lmsRes.json(); if (lmsData.success && lmsData.lms) setLmsModules(lmsData.lms);
  };

  const handleSendLesson = (e) => {
      const link = e.target.value; if (!link) return;
      const lesson = lmsModules.find(m => m.privateLink === link);
      if (lesson) {
          const lessonName = lesson.name && typeof lesson.name === 'object' ? (lesson.name.ru || lesson.name.en) : lesson.name;
          setMasterChatInput(`🎓 Доступ к путеводителю открыт!\nГид: ${lessonName}\nКатегория: ${lesson.module}\n\nВаша ссылка на закрытое видео:\n${lesson.privateLink}\n\nПриятного просмотра!`);
      }
      e.target.value = ""; 
  };

  const handleFileAttach = (e) => {
    const file = e.target.files[0]; if (!file) return; if (file.size > 4 * 1024 * 1024) return alert(t('fileTooLarge'));
    const reader = new FileReader(); reader.onload = () => { setChatFile({ name: file.name, type: file.type, base64: reader.result.split(',')[1] }); }; reader.readAsDataURL(file);
  };

  const handleMasterFileAttach = (e) => {
    const file = e.target.files[0]; if (!file) return; if (file.size > 4 * 1024 * 1024) return alert(t('fileTooLarge'));
    const reader = new FileReader(); reader.onload = () => { setMasterChatFile({ name: file.name, type: file.type, base64: reader.result.split(',')[1] }); }; reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault(); if (!chatInput.trim() && !chatFile) return; setChatLoading(true);
    const payload = { action: 'chat', contact: currentUser.contact, sender: currentUser.name, message: chatInput, fileName: chatFile?.name, mimeType: chatFile?.type, fileBase64: chatFile?.base64 };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if ((await res.json()).success) { setChatInput(''); setChatFile(null); await fetchChatMessages(); } else alert(t('error_network'));
    setChatLoading(false);
  };

  const handleMasterSend = async (e) => {
    e.preventDefault(); if ((!masterChatInput.trim() && !masterChatFile) || selectedClientSheets.length === 0) return;
    const payload = { action: 'master_send_chats', targetSheets: selectedClientSheets, sender: currentUser.name, message: masterChatInput, fileName: masterChatFile?.name, mimeType: masterChatFile?.type, fileBase64: masterChatFile?.base64 };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if ((await res.json()).success) { setMasterChatInput(''); setMasterChatFile(null); await fetchMasterChats(); }
  };

  const handleApproveRequest = async (req) => {
    if (!req) return;
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve_request', rowIndex: req.rowIndex, chatSheetName: chatSheet, checkIn: req.checkIn, checkOut: req.checkOut, contact: req.contact }) });
    if ((await res.json()).success) { alert(t('requestApproved')); fetchMasterChats(); fetchSettings(); }
  };

  const handleRejectRequest = async (req) => {
    if (!req) return;
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject_request', rowIndex: req.rowIndex, chatSheetName: chatSheet, checkIn: req.checkIn, checkOut: req.checkOut, contact: req.contact }) });
    if ((await res.json()).success) { alert(t('rejectSuccess')); fetchMasterChats(); fetchSettings(); }
  };

  const handleSpecialOffer = async (e) => {
    e.preventDefault();
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const reqBase = activeRequestsList.find(r => r.rowIndex === offerData.rowIndex); if (!reqBase) return;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'special_offer', rowIndex: reqBase.rowIndex, chatSheetName: chatSheet, clientContact: reqBase.contact, checkIn: offerData.checkIn, checkOut: offerData.checkOut, price: offerData.price, nights: differenceInDays(parse(offerData.checkOut, 'dd.MM.yyyy', new Date()), parse(offerData.checkIn, 'dd.MM.yyyy', new Date())), adults: reqBase.adults, children: reqBase.children, guests: reqBase.guests }) });
    if ((await res.json()).success) { alert(t('offerSentSuccess')); setOfferModal(false); fetchMasterChats(); fetchSettings(); }
  };

  const handleRevokeRequest = async (req) => {
    if (!req) return;
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'revoke_request', rowIndex: req.rowIndex, chatSheetName: chatSheet, checkIn: req.checkIn, checkOut: req.checkOut, clientContact: req.contact }) });
    if ((await res.json()).success) { alert(t('revokeSuccess')); fetchMasterChats(); fetchSettings(); }
  };

  // Задача 4.4 - Вставка шаблона из мини-карточки
  const insertTemplate = (text) => setMasterChatInput(prev => prev + (prev.length > 0 ? '\n' : '') + text);
  
  const toggleClientSelection = (sheetName) => setSelectedClientSheets(prev => prev.includes(sheetName) ? prev.filter(s => s !== sheetName) : [...prev, sheetName]);

  const handleMasterCalendarSave = async (e) => {
    e.preventDefault();
    const [cStart, cEnd] = calSetRange; if (!cStart) return alert(t('selectDatesLabel'));
    const startStr = format(cStart, 'dd.MM.yyyy'); const endStr = format(cEnd || cStart, 'dd.MM.yyyy');
    const rules = [];
    if (editStatus === 'Заблокировано') rules.push({ start: startStr, end: endStr, type: 'Блокировка', value: '1' }); else if (editStatus === 'Открыто') rules.push({ start: startStr, end: endStr, type: 'Сброс блокировки', value: 'СБРОС' });
    if (editPrice !== '') rules.push({ start: startStr, end: endStr, type: 'Цена', value: editPrice });
    if (editMinNights !== '') rules.push({ start: startStr, end: endStr, type: 'Мин. дней', value: editMinNights });
    if (editNote !== '') rules.push({ start: startStr, end: endStr, type: 'Заметка', note: editNote });
    if (editBookingMode !== '') rules.push({ start: startStr, end: endStr, type: 'Тип записи', value: editBookingMode });
    if (rules.length === 0) return;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_save_calendar', sender: currentUser.name, rules }) });
    if ((await res.json()).success) { alert(t('successRulesSave')); setCalSetRange([null, null]); setEditPrice(''); setEditMinNights(''); setEditNote(''); setEditStatus('Открыто'); setEditBookingMode(''); fetchSettings(); }
  };

  const handleMasterCalendarReset = async () => {
    const [cStart, cEnd] = calSetRange; if (!cStart) return;
    const startStr = format(cStart, 'dd.MM.yyyy'); const endStr = format(cEnd || cStart, 'dd.MM.yyyy');
    const rules = [ { start: startStr, end: endStr, type: 'Сброс блокировки', value: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс цены', value: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс мин. дней', value: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс заметки', note: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс типа бронирования', value: 'СБРОС' } ];
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_save_calendar', sender: currentUser.name, rules }) });
    if ((await res.json()).success) { alert(t('successRulesReset')); setCalSetRange([null, null]); setEditPrice(''); setEditMinNights(''); setEditNote(''); setEditStatus('Открыто'); setEditBookingMode(''); fetchSettings(); }
  };

  const handleMasterGlobalRulesSave = async (e) => {
    e.preventDefault(); const rules = Object.fromEntries(new FormData(e.target));
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_save_global_rules', sender: currentUser.name, rules }) });
    if ((await res.json()).success) { alert(t('successGlobalSave')); setDynamicRules(prev => ({...prev, ...rules})); } 
  };

  const isSameDayHelper = (d1, d2) => {
    if (!d1 || !d2 || isNaN(d1) || isNaN(d2)) return false; 
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const isOccupiedDate = (targetDate) => occupiedDates.some(occ => occ && isSameDayHelper(occ, targetDate)) || isManualBlocked(targetDate);
  const safeMinDate = addDays(new Date(), parseInt(dynamicRules.advanceNoticeDays) || 0);

  const handleGuestDayClick = (clickedDate) => {
      const checkDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
      
      const minStart = new Date(safeMinDate); minStart.setHours(0,0,0,0);
      if (checkDate < minStart) return;

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
          
          if (hasOverlap) { alert(t('overlapsOccupied')); return; }
          if (differenceInDays(checkDate, sDate) > dynamicRules.maxNights) return;
          
          setDateRange([sDate, checkDate]);
          setIsGuestCalendarOpen(false); 
      }
  };

  const renderGuestMonth = (monthDate) => {
    const monthStart = startOfMonth(monthDate); const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 }); const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const rows = []; let days = []; let day = startDateGrid; const weekDays = t('weekdays').split(',');
    const header = ( <div className="grid grid-cols-7 gap-1 mb-2 w-full"> {weekDays.map((wd, i) => ( <div key={i} className="text-center text-[10px] md:text-xs text-slate-500 font-bold py-1 uppercase">{wd}</div> ))} </div> );
    
    while (day <= endDateGrid) {
        for (let i = 0; i < 7; i++) {
            const cloneDay = new Date(day); const checkDate = new Date(cloneDay.getFullYear(), cloneDay.getMonth(), cloneDay.getDate());
            const isCurrentMonth = isSameMonth(cloneDay, monthStart);
            const isOccupied = isOccupiedDate(checkDate);
            const minStart = new Date(safeMinDate); minStart.setHours(0,0,0,0);
            const isPast = checkDate < minStart;
            
            let isSelected = false; let isInRange = false; let isCheckoutOnly = false;
            if (startDate && isSameDayHelper(checkDate, startDate)) isSelected = true;
            if (endDate && isSameDayHelper(checkDate, endDate)) isSelected = true;
            if (startDate && endDate && checkDate > startDate && checkDate < endDate) isInRange = true;
            
            if (isOccupied && !isPast) {
                const prevDay = addDays(checkDate, -1);
                if (!isOccupiedDate(prevDay)) isCheckoutOnly = true;
            }

            const currentMinNights = getMinNightsForDate(startDate || checkDate);
            let stateClass = "bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-white/5";
            
            if (!isCurrentMonth) stateClass = "opacity-0 pointer-events-none"; 
            else if (isPast) stateClass = "opacity-30 bg-slate-900 text-slate-500 cursor-not-allowed border border-transparent";
            else if (isOccupied) {
                if (isCheckoutOnly) {
                   if (startDate && checkDate > startDate) stateClass = "bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-white/5 border-l-red-500 border-l-2";
                   else stateClass = "opacity-50 bg-slate-900 text-red-300 cursor-not-allowed border border-transparent";
                } else stateClass = "opacity-40 bg-slate-900 text-slate-500 cursor-not-allowed border border-transparent line-through";
            }
            
            if (isSelected) stateClass = "!bg-blue-600 !border-blue-400 !text-white shadow-[0_0_10px_rgba(37,99,235,0.5)] font-bold z-20 scale-105 rounded-xl";
            if (isInRange) stateClass = "!bg-blue-900/60 !border-blue-500/30 !text-blue-100 rounded-none";
            
            if (startDate && !endDate && isCurrentMonth && !isPast && !isOccupied && checkDate > startDate) {
                const diff = differenceInDays(checkDate, startDate);
                if (diff < currentMinNights) stateClass += " !bg-yellow-500/10 border-dashed !border-yellow-500/50";
            }

            const dayEvents = apiEvents.filter(e => {
                const eS = new Date(e.start); eS.setHours(0,0,0,0); const eE = new Date(e.end); eE.setHours(0,0,0,0);
                return checkDate >= eS && checkDate <= eE; 
            });

            days.push(
                <div key={day.toISOString()} onClick={() => handleGuestDayClick(cloneDay)} className={`relative flex flex-col items-center justify-center w-full h-10 md:h-14 text-sm md:text-base rounded-lg transition-all box-border overflow-hidden ${stateClass}`}>
                    <span className="z-10">{format(cloneDay, 'd')}</span>
                    <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-[1px] z-0 pointer-events-none opacity-50">
                        {dayEvents.map((ev, idx) => {
                            const eS = new Date(ev.start); eS.setHours(0,0,0,0); const eE = new Date(ev.end); eE.setHours(0,0,0,0);
                            const isStart = isSameDayHelper(checkDate, eS); const isEnd = isSameDayHelper(checkDate, eE);
                            if (isStart && isEnd) return null; 
                            const bgColor = ev.sourceId === 'airbnb_sync' ? 'bg-[#ff5a5f]' : 'bg-slate-600';
                            let widthClass = 'w-full';
                            if (isStart) widthClass = 'w-1/2 ml-auto rounded-l-full'; else if (isEnd) widthClass = 'w-1/2 mr-auto rounded-r-full';
                            return <div key={idx} className={`h-1.5 md:h-2 ${bgColor} ${widthClass}`}></div>
                        })}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(<div className="grid grid-cols-7 gap-1 mb-1 w-full" key={day.toISOString()}>{days}</div>); days = [];
    }
    
    return (
      <div className="flex flex-col w-full px-2">
         <div className="text-center font-bold text-white mb-4 capitalize tracking-wide text-lg">{format(monthStart, 'LLLL yyyy', { locale: lang === 'en' ? enUS : (lang === 'tr' ? tr : ru) })}</div>
         {header}{rows}
      </div>
    );
  };

  const handleHostDayClick = (clickedDate) => {
    if (!calSetRange[0] || (calSetRange[0] && calSetRange[1])) setCalSetRange([clickedDate, null]);
    else { if (clickedDate < calSetRange[0]) setCalSetRange([clickedDate, calSetRange[0]]); else setCalSetRange([calSetRange[0], clickedDate]); }
  };

  const renderCustomHostCalendar = () => {
    if (!hostCurrentMonth) return null;
    const monthStart = startOfMonth(hostCurrentMonth); const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 }); const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const rows = []; let days = []; let day = startDateGrid; const weekDays = t('weekdays').split(',');
    const header = ( <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 w-full"> {weekDays.map((wd, i) => ( <div key={i} className="text-center text-xs md:text-sm text-slate-500 font-bold py-2">{wd}</div> ))} </div> );
    
    while (day <= endDateGrid) {
        for (let i = 0; i < 7; i++) {
            const cloneDay = new Date(day); const checkDate = new Date(cloneDay.getFullYear(), cloneDay.getMonth(), cloneDay.getDate());
            const price = getPriceForDate(checkDate); const isManuallyBlocked = isManualBlocked(checkDate);
            const minN = getMinNightsForDate(checkDate); const hasNote = getNoteForDate(checkDate);
            const dailyMode = getBookingModeForSingleDate(checkDate);
            const isCurrentMonth = isSameMonth(cloneDay, monthStart);
            
            let isSelected = false; let isInRange = false;
            if (calSetRange[0] && isSameDayHelper(checkDate, calSetRange[0])) isSelected = true;
            if (calSetRange[1] && isSameDayHelper(checkDate, calSetRange[1])) isSelected = true;
            if (calSetRange[0] && calSetRange[1] && checkDate > calSetRange[0] && checkDate < calSetRange[1]) isInRange = true;
            
            let holdDetailsText = ""; let holdRule = null;
            for (const rule of dateRules) {
                const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
                const check = new Date(cloneDay); check.setHours(0,0,0,0);
                if (check >= rS && check <= rE) {
                    if (rule.type === 'Сброс блокировки') { holdRule = null; break; }
                    if (rule.type === 'Блокировка' && String(rule.value).startsWith('HOLD|')) { holdRule = rule; break; }
                    if (rule.type === 'Блокировка') break;
                }
            }
            const hasHold = !!holdRule;
            if (holdRule) {
                const parts = String(holdRule.value).split('|'); const guestContact = parts[1] || 'Неизвестно'; const expiresIso = parts[2]; const expiresFormatted = expiresIso ? new Date(expiresIso).toLocaleString('ru-RU') : 'Бессрочно';
                const chatForHold = masterAllChats.find(c => c.clientContact === guestContact);
                let reqHold = null;
                if (chatForHold && chatForHold.activeRequests) reqHold = chatForHold.activeRequests.find(r => r.status.includes('СПЕЦПРЕДЛОЖЕНИЕ') || r.status.includes('ОЖИДАЕТ ОПЛАТЫ'));
                if (reqHold) holdDetailsText = `\n\n-- ДАННЫЕ (HOLD) --\nГость: ${chatForHold.clientName} (${guestContact})\nСтатус: ${translateStatus(reqHold.status)}\nПериод: ${reqHold.checkIn}-${reqHold.checkOut}\nСумма: ${reqHold.price}\nОплатить до: ${expiresFormatted}`;
                else holdDetailsText = `\n\n-- УДЕРЖАНИЕ --\nГость: ${guestContact}\nОплатить до: ${expiresFormatted}`;
            }

            const dayEvents = apiEvents.filter(e => { const eS = new Date(e.start); eS.setHours(0,0,0,0); const eE = new Date(e.end); eE.setHours(0,0,0,0); return checkDate >= eS && checkDate <= eE; });
            const tooltipText = `${t('dates')}: ${format(cloneDay, 'dd.MM.yyyy')}\n${t('specialPriceLabel')}: ${price}\n${t('minNightsLabel')}: ${minN}\n${t('bookingModeLabel')}: ${dailyMode === 'manual' ? t('modeManual') : t('modeInstant')}\n${t('availabilityStatus')}: ${isManuallyBlocked ? t('hardBlock') : t('openForBooking')}\n${t('internalNoteLabel')}: ${hasNote || '-'}${holdDetailsText}`;

            days.push(
                <div key={day.toISOString()} title={tooltipText} onClick={() => handleHostDayClick(cloneDay)} className={`relative flex flex-col items-center justify-center w-full min-h-[85px] md:min-h-[120px] p-1 md:p-2 border border-white/10 rounded-lg md:rounded-2xl cursor-pointer transition-all box-border overflow-hidden ${!isCurrentMonth ? 'opacity-40 bg-slate-900/30' : 'bg-slate-800/60 hover:bg-slate-700'} ${isSelected ? '!bg-blue-600 !border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : isInRange ? '!bg-blue-900/60' : ''} ${isManuallyBlocked && !isSelected && !isInRange ? '!bg-red-900/40 text-red-300 line-through' : ''}`}>
                    <span className="font-bold text-lg md:text-2xl flex items-center gap-1 z-20">{format(cloneDay, 'd')} {dailyMode === 'manual' && <span className="text-[8px] text-yellow-400">✋</span>}</span>
                    <span className="text-[10px] md:text-sm text-green-400 text-center break-words leading-tight mt-1 w-full max-w-full overflow-hidden z-20">{price}</span>
                    {minN != dynamicRules.minNights && <span className="absolute top-1 left-1 text-[10px] md:text-xs font-bold text-blue-300 z-20">{minN}н</span>}
                    {hasNote && <span className="absolute top-2 right-2 w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)] z-20"></span>}
                    {hasHold && <span className="absolute bottom-6 right-1 text-[10px] md:text-xs z-20" title="Удержание 24ч">⏳</span>}
                    <div className="absolute top-[40%] left-0 right-0 flex flex-col gap-[2px] z-10 pointer-events-none">
                        {dayEvents.map((ev, idx) => {
                            const eS = new Date(ev.start); eS.setHours(0,0,0,0); const eE = new Date(ev.end); eE.setHours(0,0,0,0);
                            const isStart = isSameDayHelper(checkDate, eS); const isEnd = isSameDayHelper(checkDate, eE);
                            if (isStart && isEnd) return null; 
                            const bgColor = ev.sourceId === 'airbnb_sync' ? 'bg-[#ff5a5f]' : 'bg-slate-600';
                            let widthClass = 'w-full';
                            if (isStart) widthClass = 'w-1/2 ml-auto rounded-l-full'; else if (isEnd) widthClass = 'w-1/2 mr-auto rounded-r-full';
                            return <div key={idx} className={`h-full ${bgColor} ${widthClass} opacity-95 shadow-md`}></div>
                        })}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(<div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2 w-full" key={day.toISOString()}>{days}</div>); days = [];
    }
    return <div className="w-full flex flex-col">{header}{rows}</div>;
  };

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    let total = 0; let cur = new Date(startDate); cur.setHours(0,0,0,0); const end = new Date(endDate); end.setHours(0,0,0,0);
    while (cur < end) { total += parseInt(getPriceForDate(cur)) || parseInt(dynamicRules.basePrice); cur.setDate(cur.getDate() + 1); }
    return total;
  };

  const currentMinNights = getMinNightsForDate(startDate || safeMinDate);
  const nightsCount = (startDate && endDate) ? differenceInDays(endDate, startDate) : 0;
  const isShortStay = (nightsCount > 0 && nightsCount < currentMinNights);
  const effectiveBookingMode = isShortStay ? 'manual' : currentBookingMode;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!agreedKVKK || !agreedContract || !agreedPrivacy) return alert(t('legalKVKK'));
    const totalGuests = adults + children;
    if (totalGuests > SITE_CONFIG.maxTotalGuests) return alert(`${t('maxGuests')}: ${SITE_CONFIG.maxTotalGuests}`);
    if (!startDate || !endDate) return alert(t('dates'));
    
    setStatus('loading');
    const formData = new FormData(e.target); const data = Object.fromEntries(formData);
    data.action = effectiveBookingMode === 'manual' ? 'request_booking' : 'booking'; 
    data.isRegistered = !!currentUser;
    if (currentUser) { data.name = currentUser.name; data.contact = currentUser.contact; }
    data.total_adults = adults; data.total_children = children; data.total_guests = totalGuests;
    data.checkIn = format(startDate, 'dd.MM.yyyy'); data.checkOut = format(endDate, 'dd.MM.yyyy');
    data.checkInTime = dynamicRules.checkInTime || SITE_CONFIG.checkInTime; 
    data.checkOutTime = dynamicRules.checkOutTime || SITE_CONFIG.checkOutTime;
    data.nights = nightsCount; data.totalPrice = `${calculateTotalPrice()} ${CURRENCY_SYMBOLS[activeCurrency]}`;
    
    try {
      if (effectiveBookingMode === 'manual') {
        const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const result = await res.json();
        if (result.success) {
           const userObj = { ...result.user }; localStorage.setItem('villa_user', JSON.stringify(userObj)); setCurrentUser(userObj); setStatus('idle'); setDateRange([null, null]); alert(t('requestSentSuccess'));
           setTimeout(() => { if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: 'smooth' }); }, 500);
        } else { setStatus('error'); alert(t(result.error)); }
      } else {
        const paymentGateway = activeCurrency === 'RUB' ? 'tbank' : 'stripe';
        const res = await fetch('/api/payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gateway: paymentGateway, amount: calculateTotalPrice(), currency: activeCurrency, bookingDetails: data }) });
        const result = await res.json();
        if (result.url) window.location.href = result.url; else { setStatus('error'); alert(result.error || 'Payment error'); }
      }
    } catch (err) { setStatus('error'); }
  };

  const handleProductPurchase = async (price, type) => {
    if (!currentUser) return setAuthMode('login'); setStatus('loading');
    const paymentGateway = activeCurrency === 'RUB' ? 'tbank' : 'stripe';
    const data = { action: 'booking', isRegistered: true, name: currentUser.name, contact: currentUser.contact, checkIn: null, checkOut: null, nights: 1, total_adults: 1, total_children: 0, total_guests: 1, totalPrice: `${price} ${CURRENCY_SYMBOLS[activeCurrency]}` };
    try {
        const res = await fetch('/api/payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gateway: paymentGateway, amount: price, currency: activeCurrency, bookingDetails: data }) });
        const result = await res.json();
        if (result.url) window.location.href = result.url; else { setStatus('error'); alert(result.error || 'Payment error'); }
    } catch (err) { setStatus('error'); }
  }

  if (siteBlocked) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center">
        <SEO title="Access Denied" description="Access restricted." />
        <Lock size={64} className="text-red-500 mb-6" /><h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      </div>
    );
  }

  // --- АДМИН ПАНЕЛЬ ---
  if (currentUser?.isHost) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-6 md:p-10 flex flex-col gap-8 w-full max-w-[100vw] lg:max-w-7xl mx-auto overflow-x-hidden">
        <SEO title={`${t('adminPanel')} | ${SITE_CONFIG.vesselName}`} description="Admin panel for Villa Turaman" />
        
        <div className="flex flex-wrap justify-between items-center bg-slate-900/80 backdrop-blur p-6 rounded-[2rem] border border-blue-500/30 shadow-2xl gap-4 w-full max-w-full z-50">
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight flex items-center gap-3">
              <Settings className="text-blue-500 shrink-0"/> <span className="truncate">{t('adminPanel')} ({currentUser.role})</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 flex items-center gap-2"><User size={14}/> <span className="truncate">{currentUser.name} ({currentUser.contact})</span></p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-end items-center">
             <button onClick={() => changeLanguage(lang === 'ru' ? 'tr' : (lang === 'tr' ? 'en' : 'ru'))} className="px-4 py-3 rounded-xl font-bold transition-all text-xs md:text-sm bg-slate-800 text-slate-400 hover:bg-slate-700">{lang.toUpperCase()}</button>
             {currentUser.permissions?.chats && (<button onClick={() => setHostTab('chats')} className={`px-4 py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${hostTab === 'chats' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{t('adminChats')}</button>)}
             {(currentUser.permissions?.blocks || currentUser.permissions?.finance || currentUser.permissions?.periods || currentUser.permissions?.bookingWindow) && (<button onClick={() => setHostTab('calendar')} className={`px-4 py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${hostTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{t('adminCalendar')}</button>)}
             <Link href="/admin/graph" className="px-4 py-3 rounded-xl font-bold transition-all text-xs md:text-sm bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2"><Layers size={14}/> C&C ГРАФ (2FA)</Link>
             <button onClick={handleLogout} className="px-5 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-900/50 uppercase tracking-widest text-xs md:text-sm shrink-0 whitespace-nowrap">{t('logout')}</button>
          </div>
        </div>

        {hostTab === 'chats' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-[70vh]">
            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Users size={20}/> {t('activeChats')}</h2>
              {masterAllChats.map((chat, idx) => (
                <label key={idx} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all ${selectedClientSheets.includes(chat.sheetName) ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-800 border-white/5 hover:bg-slate-700'}`}>
                  <input type="checkbox" checked={selectedClientSheets.includes(chat.sheetName)} onChange={() => toggleClientSelection(chat.sheetName)} className="w-5 h-5 accent-blue-600 rounded" />
                  <div className="flex flex-col"><span className="font-bold text-white">{chat.clientName}</span><span className="text-xs text-slate-400">{chat.clientContact}</span></div>
                </label>
              ))}
            </div>
            
            <div className="md:col-span-2 bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 flex flex-col gap-6 relative">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{t('broadcastTitle')}</h2>
                <span className="text-sm text-blue-400">{t('selectedRecipients')}: {selectedClientSheets.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-slate-950/50 rounded-2xl p-6 border border-white/5 space-y-8">
                {masterAllChats.filter(c => selectedClientSheets.includes(c.sheetName)).map((chat, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded-2xl">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 border-b border-white/10 pb-2">{t('chatHistory')}: {chat.clientName}</h3>
                    <div className="space-y-4">
                      {chat.messages.map((m, mIdx) => (
                        <div key={mIdx} className={`flex flex-col ${m.sender === currentUser.name || m.sender === 'Система' || m.sender === 'Владелец' ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-slate-500 mb-1">
                            {m.sender !== 'Система' && m.sender !== 'Владелец' && m.sender !== currentUser.name ? `${m.sender} (${chat.clientContact})` : m.sender} • {m.date}
                          </span>
                          <div className={`p-3 max-w-[85%] rounded-xl text-sm whitespace-pre-wrap break-all overflow-hidden ${m.sender === currentUser.name || m.sender === 'Владелец' ? 'bg-blue-600 text-white' : m.sender === 'Система' ? 'bg-slate-700 text-slate-300 italic' : 'bg-slate-800 text-slate-200'}`}>{m[lang] || m.original}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
                <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl mb-2 mt-4">
                   <p className="text-xs text-blue-400 mb-2">💡 <b>Инструкция по гидам:</b> Выберите видео-гид из списка. Текст с доступом вставится в окно автоматически.</p>
                   <select onChange={handleSendLesson} className="w-full bg-slate-900 hover:bg-slate-800 text-sm text-white p-3 rounded-lg border border-slate-700 outline-none cursor-pointer font-bold">
                      <option value="">{t('assignLesson')}</option>
                      {lmsModules.map((m, i) => (
                         <option key={i} value={m.privateLink}>{getTranslated(m, 'name')} ({m.module})</option>
                      ))}
                   </select>
                </div>
                
                {/* Задача 4.4 Разворачивающиеся мини-карточки шаблонов */}
                <div className="flex flex-col gap-2 overflow-x-auto pt-2 pb-2 border-t border-white/10 mt-2">
                  <span className="text-xs text-slate-500 flex items-center font-bold uppercase tracking-widest"><FileText size={14} className="mr-1"/> {t('chatTemplatesLabel')}:</span>
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                    {Object.entries(contentData.templates || {}).flatMap(([id, tplArray]) => 
                      tplArray.map((tpl, index) => {
                        const tplText = tpl.text[lang] || tpl.text.ru;
                        const isExpanded = expandedTemplate === `${id}-${index}`;
                        return (
                          <div key={`${id}-${index}`} className="flex flex-col bg-slate-800/80 rounded-xl border border-slate-700 shadow-md min-w-[200px] max-w-[280px] shrink-0 snap-start overflow-hidden transition-all">
                             <div className="p-3 cursor-pointer hover:bg-slate-700 flex justify-between items-center" onClick={() => setExpandedTemplate(isExpanded ? null : `${id}-${index}`)}>
                               <span className="text-xs font-bold text-slate-200 truncate">{tpl.name[lang] || tpl.name.ru}</span>
                               <ChevronDown size={14} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
                             </div>
                             <div className={`px-3 text-[10px] text-slate-400 overflow-hidden transition-all ${isExpanded ? 'max-h-[200px] pb-3' : 'max-h-12 pb-2'}`}>
                                <p className={`whitespace-pre-wrap ${!isExpanded && 'line-clamp-2'}`}>{tplText}</p>
                             </div>
                             {isExpanded && (
                               <button type="button" onClick={() => { insertTemplate(tplText); setExpandedTemplate(null); }} className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs py-2 font-bold border-t border-blue-500/20 transition-colors">
                                 {t('insertTemplateBtn')}
                               </button>
                             )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                <form onSubmit={handleMasterSend} className="flex flex-col gap-2 mt-2">
                  {masterChatFile && (<div className="flex justify-between bg-slate-900 p-2 rounded-xl border border-white/10 text-xs"><span className="truncate pr-2 text-slate-300">{masterChatFile.name}</span><button type="button" onClick={() => setMasterChatFile(null)} className="text-red-400"><X size={14}/></button></div>)}
                  <div className="flex gap-4 items-end">
                    <label className="cursor-pointer bg-slate-900 hover:bg-slate-700 p-4 rounded-2xl flex justify-center items-center text-slate-300 shrink-0 h-[100px]"><Paperclip size={24} /><input type="file" className="hidden" onChange={handleMasterFileAttach} /></label>
                    <textarea value={masterChatInput} onChange={(e) => setMasterChatInput(e.target.value)} placeholder={t('messagePlaceholder')} className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500 min-h-[100px] resize-none" />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl text-white font-bold transition-colors h-[100px] flex items-center justify-center min-w-[80px]"><Send size={24} /></button>
                  </div>
                </form>
              </div>
              
            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white mb-2">{t('bookingRequestPanel')}</h2>
              {activeRequestsList.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
                  {activeRequestsList.map((req, idx) => (
                    <div key={idx} className="text-sm text-slate-300 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                      <p className="font-bold text-lg text-white mb-2">{activeChat.clientName}</p>
                      <div className="space-y-2 border-t border-white/5 pt-2">
                         <p className="text-slate-400">📅 {req.checkIn} – {req.checkOut} ({req.nights} {t('daysAbbr')})</p>
                         <p className="text-slate-400">👥 Гостей: {req.guests} (Взр: {req.adults}, Дет: {req.children})</p>
                         <p className="text-slate-400">💰 {t('amountLabel')} <span className="font-bold text-white text-lg">{req.price}</span></p>
                         <p className="text-xs text-yellow-500 mt-2 px-2 py-1 bg-yellow-500/10 rounded-md w-fit">{t('statusLabel')} {translateStatus(req.status)}</p>
                      </div>
                      
                      {(req.status === 'ЗАПРОС' || req.status === 'СПЕЦПРЕДЛОЖЕНИЕ') && (
                        <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleApproveRequest(req)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-xl font-bold text-white text-xs transition-all">{t('approveBtn')}</button>
                            <button onClick={() => handleRejectRequest(req)} className="flex-1 bg-slate-700 hover:bg-red-500 py-2 rounded-xl font-bold text-white text-xs transition-all">{t('rejectBtn')}</button>
                          </div>
                          <button onClick={() => { setOfferData({ checkIn: req.checkIn, checkOut: req.checkOut, price: parseInt(req.price), rowIndex: req.rowIndex, contact: req.contact }); setOfferModal(true); }} className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-xl font-bold text-slate-300 text-xs transition-all border border-white/10">{t('specialOfferBtn')}</button>
                        </div>
                      )}
                      {(req.status === 'ОЖИДАЕТ ОПЛАТЫ' || req.status === 'СПЕЦПРЕДЛОЖЕНИЕ') && (
                        <div className="mt-2 flex flex-col gap-2">
                          <button onClick={() => handleRevokeRequest(req)} className="w-full bg-orange-600 hover:bg-orange-500 py-2 rounded-xl font-bold text-white text-xs transition-all">{t('revokeBtn')}</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">{t('noActiveRequests')}</div>
              )}
            </div>
          </div>
        )}

        {hostTab === 'calendar' && (
          <div className="flex flex-col gap-8 w-full mx-auto z-10 relative">
            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-4 md:p-10 w-full overflow-hidden shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3"><CalendarIcon className="text-blue-500"/> {t('calendarTitle')}</h2>
              
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="relative w-full overflow-hidden flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-slate-500 block mb-3 pl-2">{t('selectDatesLabel')}</label>
                  
                  <div className="flex justify-between items-center mb-4 md:mb-6 bg-slate-800/50 p-2 md:p-4 rounded-2xl border border-white/5 shadow-inner">
                      <button onClick={() => setHostCurrentMonth(addMonths(hostCurrentMonth || new Date(), -1))} className="p-2 md:p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white transition-all shadow-md"><ChevronLeft size={24}/></button>
                      <span className="text-white font-bold text-lg md:text-2xl capitalize tracking-wide">
                        <DatePicker locale={lang === 'en' ? enUS : (lang === 'tr' ? tr : ru)} selected={hostCurrentMonth || new Date()} onChange={(date) => setHostCurrentMonth(date)} dateFormat="LLLL yyyy" showMonthYearPicker customInput={<span className="cursor-pointer">{format(hostCurrentMonth || new Date(), 'LLLL yyyy', { locale: lang === 'en' ? enUS : (lang === 'tr' ? tr : ru) })}</span>} />
                      </span>
                      <button onClick={() => setHostCurrentMonth(addMonths(hostCurrentMonth || new Date(), 1))} className="p-2 md:p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white transition-all shadow-md"><ChevronRight size={24}/></button>
                  </div>
                  
                  <div className="w-full bg-slate-900/50 border border-white/5 rounded-[2rem] p-2 md:p-6 shadow-inner">
                    {renderCustomHostCalendar()}
                  </div>
                </div>

                <div className={`transition-all duration-500 origin-top ${calSetRange[0] ? 'opacity-100 scale-100 h-auto mt-4' : 'opacity-0 scale-95 h-0 overflow-hidden pointer-events-none'}`}>
                  <div className="bg-slate-800/50 p-6 md:p-8 rounded-3xl border border-white/10 shadow-inner">
                    <label className="text-sm font-bold uppercase tracking-widest text-white block mb-6 border-b border-white/10 pb-4">
                      {t('settingsDatesLabel')} <span className="text-blue-400 ml-2">{calSetRange[0] ? `${format(calSetRange[0], 'dd.MM.yyyy')} - ${format(calSetRange[1] || calSetRange[0], 'dd.MM.yyyy')}` : ''}</span>
                    </label>
                    
                    <form onSubmit={handleMasterCalendarSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('availabilityStatus')}</label>
                          <select value={editStatus} onChange={e => setEditStatus(e.target.value)} disabled={!currentUser.permissions?.blocks} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner">
                            <option value="Открыто">{t('openForBooking')}</option>
                            <option value="Заблокировано">{t('hardBlock')}</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('bookingModeLabel')}</label>
                          <select value={editBookingMode} onChange={e => setEditBookingMode(e.target.value)} disabled={!currentUser.permissions?.blocks} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner">
                            <option value="">{t('modeInherit')}</option>
                            <option value="instant">{t('modeInstant')}</option>
                            <option value="manual">{t('modeManual')}</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('specialPriceLabel')} ({CURRENCY_SYMBOLS[dynamicRules.currency]})</label>
                          <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder={`${dynamicRules.basePrice}`} disabled={!currentUser.permissions?.finance} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner" />
                      </div>
                      <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('minNightsLabel')}</label>
                          <input type="number" value={editMinNights} onChange={e => setEditMinNights(e.target.value)} placeholder={`${dynamicRules.minNights}`} disabled={!currentUser.permissions?.periods} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner" />
                      </div>
                      <div className="md:col-span-2">
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('internalNoteLabel')}</label>
                          <input value={editNote} onChange={e => setEditNote(e.target.value)} placeholder="..." className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner" />
                      </div>
                      
                      <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-4 pt-6 border-t border-white/10">
                          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-900/20">{t('saveRulesBtn')}</button>
                          <button type="button" onClick={handleMasterCalendarReset} className="flex-1 bg-slate-900 hover:bg-slate-800 border border-red-500/30 py-4 rounded-xl font-bold text-red-400 transition-all shadow-inner">{t('resetGlobalBtn')}</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 md:p-10 w-full mb-10">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3"><Settings className="text-blue-500"/> {t('globalRulesTitle')}</h3>
              <form onSubmit={handleMasterGlobalRulesSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('bookingModeLabel')}</label>
                  <select name="bookingMode" defaultValue={dynamicRules.bookingMode} disabled={!currentUser.permissions?.finance} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50">
                     <option value="instant">{t('modeInstant')}</option>
                     <option value="manual">{t('modeManual')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('currencyGlobal')}</label>
                  <select name="currency" defaultValue={dynamicRules.currency} disabled={!currentUser.permissions?.finance} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50">
                     <option value="RUB">RUB (₽)</option>
                     <option value="TRY">TRY (₺)</option>
                     <option value="USD">USD ($)</option>
                     <option value="EUR">EUR (€)</option>
                     <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('basePriceGlobal')}</label>
                  <input name="basePrice" type="number" defaultValue={dynamicRules.basePrice} disabled={!currentUser.permissions?.finance} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('minNightsGlobal')}</label>
                  <input name="minNights" type="number" defaultValue={dynamicRules.minNights} disabled={!currentUser.permissions?.periods} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('maxNightsGlobal')}</label>
                  <input name="maxNights" type="number" defaultValue={dynamicRules.maxNights} disabled={!currentUser.permissions?.periods} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('bookingWindowGlobal')} ({t('monthsAbbr')})</label>
                  <input name="bookingWindowMonths" type="number" defaultValue={dynamicRules.bookingWindowMonths} disabled={!currentUser.permissions?.bookingWindow} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('advanceNoticeGlobal')}</label>
                  <input name="advanceNoticeDays" type="number" defaultValue={dynamicRules.advanceNoticeDays} disabled={!currentUser.permissions?.bookingWindow} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                
                {/* Задача 2.1 Настройки времени заезда/выезда */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('checkInTimeGlobal')} (Заезд)</label>
                  <input name="checkInTime" type="time" defaultValue={dynamicRules.checkInTime} disabled={!currentUser.permissions?.bookingWindow} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('checkOutTimeGlobal')} (Выезд)</label>
                  <input name="checkOutTime" type="time" defaultValue={dynamicRules.checkOutTime} disabled={!currentUser.permissions?.bookingWindow} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>

                <div className="md:col-span-2 mt-4">
                  <button type="submit" disabled={!currentUser.permissions?.periods && !currentUser.permissions?.bookingWindow && !currentUser.permissions?.finance} className="w-full bg-slate-700 hover:bg-slate-600 py-5 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {t('saveGlobalBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- КЛИЕНТСКАЯ ЧАСТЬ (Гость) ---
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500 relative w-full overflow-x-hidden">
      
      <SEO title={`${homeData.title} - ${homeData.subtitle}`} description={homeData.aboutText} image={homeData.heroImage} schemaData={mainSchema} />
      
      <div className="absolute top-4 left-4 right-4 z-[100] flex flex-col items-center md:flex-row md:justify-between gap-4 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={() => changeLanguage('ru')} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === 'ru' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>RU</button>
          <button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>EN</button>
          <button onClick={() => changeLanguage('tr')} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === 'tr' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>TR</button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 pointer-events-auto">
        {currentUser ? (
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur border border-white/10 px-4 py-2 rounded-full shadow-2xl">
            <span className="flex items-center gap-2 text-sm text-slate-300 font-medium"><User size={16} className="text-blue-400"/><span>{currentUser.name}</span></span>
            <button onClick={handleLogout} className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full transition-all uppercase tracking-widest font-bold shadow-lg shadow-red-900/50">{t('logout')}</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setAuthMode('login')} className="bg-slate-900/80 backdrop-blur border border-white/10 px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all">{t('login')}</button>
            <button onClick={() => setAuthMode('register')} className="bg-blue-600 px-6 py-2 rounded-full text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">{t('register')}</button>
          </div>
        )}
        </div>
      </div>

      <header className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${homeData.heroImage})` }}>
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"></div>
        <div className="relative z-10 px-6 w-full mt-10">
          <h1 className="text-5xl md:text-8xl font-extralight text-white mb-6 tracking-tighter break-words drop-shadow-2xl">{homeData.title}</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-10 font-light drop-shadow-md">{homeData.subtitle}</p>
          <div className="flex flex-col items-center mt-6 gap-4">
            <div className="flex flex-wrap justify-center gap-4">
             <a href="#book" className="px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(5,150,105,0.4)] text-sm md:text-base bg-emerald-600 text-white hover:bg-emerald-500 hover:-translate-y-1">{t('bookBtn')}</a>
             <a href="#catalog" onClick={() => setActiveCategory('shop')} className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg text-sm md:text-base hover:-translate-y-1 ${activeCategory === 'shop' ? 'bg-blue-600 text-white' : 'bg-slate-800/80 backdrop-blur border border-white/10 text-slate-300 hover:bg-slate-700'}`}>{t('shopTitle')}</a>
             <a href="#catalog" onClick={() => setActiveCategory('education')} className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg text-sm md:text-base hover:-translate-y-1 ${activeCategory === 'education' ? 'bg-purple-600 text-white' : 'bg-slate-800/80 backdrop-blur border border-white/10 text-slate-300 hover:bg-slate-700'}`}>{t('educationTitle')}</a>
            </div>
            {currentUser && !currentUser.isHost && currentUser.hasChat && !currentUser.blockChat && (
               <a href="#catalog" onClick={() => setActiveCategory('chat')} className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg text-sm md:text-base mt-2 hover:-translate-y-1 ${activeCategory === 'chat' ? 'bg-indigo-600 text-white' : 'bg-slate-800/80 backdrop-blur border border-white/10 text-slate-300 hover:bg-slate-700'}`}><MessageCircle size={20} className="inline mr-2 -mt-1"/>{t('studentChat')}</a>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1">
        <section className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-light text-white mb-6 tracking-tight">{homeData.aboutTitle}</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">{homeData.aboutText}</p>
            <button onClick={() => setDescModal(true)} className="flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors group">
              {t('viewDetails')} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
          <div className="bg-slate-900/50 rounded-[3rem] p-8 border border-white/5 hidden md:block shadow-inner">
              <div className="space-y-4">
                  {fullDescription.sections.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex gap-4 items-start"><div className="bg-blue-500/10 p-2 rounded-full shrink-0 mt-1"><Check className="text-blue-500" size={16}/></div><span className="text-slate-300 text-sm leading-relaxed"><b>{s.title}:</b> {s.text.substring(0, 80)}...</span></div>
                  ))}
              </div>
          </div>
        </section>

        {/* E-COMMERCE КАТАЛОГ УСЛУГ & ПУТЕВОДИТЕЛЕЙ & ЧАТ */}
        <section id="catalog" className="py-24 bg-slate-900/30 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            
            {activeCategory === 'shop' && (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicData.products.map(product => (
                  <div key={product.id} className="bg-slate-800/60 backdrop-blur rounded-[2rem] border border-white/10 overflow-hidden shadow-xl hover:-translate-y-2 transition-transform relative">
                      <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">{getProductType(product)}</div>
                      <div className="h-52 overflow-hidden relative"><MediaCarousel media={product.images} type="image" /></div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{getTranslated(product, 'name')}</h3>
                        <p className="text-slate-400 text-sm mb-4 h-10">{getTranslated(product, 'desc')}</p>
                        <div className="mt-6 flex flex-col h-full">
                          <button onClick={() => setPresentationModal({...product, pType: 'product'})} className="w-full mb-3 bg-slate-700/50 hover:bg-slate-600 py-3 rounded-xl text-white font-bold text-sm transition-colors border border-white/10">{t('presentationBtn')}</button>
                          <LegalCheckboxes />
                          <div className="flex justify-between items-center mt-4">
                              <span className="text-2xl font-bold text-green-400 drop-shadow-md">{product.price[activeCurrency.toLowerCase()] || product.price.eur || 0} {CURRENCY_SYMBOLS[activeCurrency]}</span>
                              <button disabled={!agreedKVKK || !agreedContract || !agreedPrivacy} onClick={() => handleProductPurchase(product.price[activeCurrency.toLowerCase()] || product.price.eur || 0, 'product')} className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 px-5 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg"><ShoppingBag size={18}/> {t('productBuy')}</button>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {activeCategory === 'education' && (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicData.courses.map(course => (
                  <div key={course.id} className="bg-slate-800/60 backdrop-blur rounded-[2rem] border border-white/10 overflow-hidden shadow-xl hover:-translate-y-2 transition-transform relative">
                      <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">{t('courseType')}</div>
                      <div className="h-52 overflow-hidden relative"><MediaCarousel media={course.images} type="image" /></div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{getTranslated(course, 'name')}</h3>
                        <p className="text-slate-400 text-sm mb-4 h-10">{getTranslated(course, 'desc')}</p>
                        <div className="mt-6 flex flex-col h-full">
                          <button onClick={() => setPresentationModal({...course, pType: 'course'})} className="w-full mb-3 bg-slate-700/50 hover:bg-slate-600 py-3 rounded-xl text-white font-bold text-sm transition-colors border border-white/10">{t('presentationBtn')}</button>
                          <LegalCheckboxes />
                          <div className="flex justify-between items-center mt-4">
                              <span className="text-2xl font-bold text-green-400 drop-shadow-md">{course.price[activeCurrency.toLowerCase()] || course.price.eur || 0} {CURRENCY_SYMBOLS[activeCurrency]}</span>
                              <button disabled={!agreedKVKK || !agreedContract || !agreedPrivacy} onClick={() => handleProductPurchase(course.price[activeCurrency.toLowerCase()] || course.price.eur || 0, 'course')} className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 px-5 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg"><PlayCircle size={18}/> {t('courseStart')}</button>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {activeCategory === 'chat' && currentUser && !currentUser.isHost && currentUser.hasChat && !currentUser.blockChat && (
              <div className="animate-in fade-in duration-500 max-w-4xl mx-auto px-4 md:px-0">
                <div className="bg-slate-900 border border-white/10 shadow-2xl w-full rounded-[2rem] flex flex-col relative transition-all overflow-hidden h-[600px]">
                   <div className="bg-slate-800 p-5 border-b border-white/10 flex justify-between items-center z-10">
                       <span className="text-white font-bold flex items-center gap-3"><MessageCircle size={20} className="text-blue-400"/> {t('chatHeader')}</span>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/50 flex flex-col shadow-inner">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-widest">{msg.sender} {msg.sender === currentUser.name ? `(${currentUser.contact})` : ''} • {msg.date}</span>
                          <div className={`p-4 max-w-[85%] text-sm whitespace-pre-wrap break-all overflow-hidden shadow-md ${msg.sender === currentUser.name ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm border border-white/5'}`}>
                            {msg[lang] || msg.original}
                            {msg.file && msg.file !== '' && (<div className="mt-3 text-xs font-bold text-blue-200 bg-black/20 p-2.5 rounded-xl w-fit break-words flex items-center gap-2"><Paperclip size={14}/> {msg.file}</div>)}
                          </div>
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                   </div>
                   
                   <form onSubmit={handleSendMessage} className="p-4 bg-slate-800 border-t border-white/10 flex flex-col gap-2 z-10">
                       {chatFile && (<div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-white/10 text-xs"><span className="truncate pr-2 text-slate-300 flex items-center gap-2"><Paperclip size={14}/>{chatFile.name}</span><button type="button" onClick={() => setChatFile(null)} className="text-red-400 hover:text-red-300 bg-red-400/10 p-1.5 rounded-md transition-colors"><X size={14}/></button></div>)}
                       <div className="flex gap-3">
                         <label className="cursor-pointer bg-slate-900 hover:bg-slate-700 p-4 rounded-2xl flex justify-center items-center text-slate-300 shrink-0 transition-colors shadow-inner"><Paperclip size={20} /><input type="file" className="hidden" onChange={handleFileAttach} /></label>
                         <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={t('messagePlaceholder')} className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-5 text-sm text-white outline-none focus:border-blue-500 transition-colors shadow-inner min-w-0" />
                         <button disabled={chatLoading} type="submit" className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl text-white flex justify-center items-center min-w-[60px] shrink-0 transition-all shadow-lg disabled:opacity-50"><Send size={20} className={chatLoading ? 'animate-pulse' : ''}/></button>
                       </div>
                   </form>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* БЛОК БРОНИРОВАНИЯ ВИЛЛЫ С КАСТОМНЫМ КАЛЕНДАРЕМ */}
        <section id="book" className="py-24 max-w-4xl mx-auto px-6 flex flex-col gap-12 overflow-hidden relative">
          <div className="bg-slate-900/60 p-6 md:p-16 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl w-full box-border backdrop-blur">
            <div className="text-center mb-12 border-b border-white/10 pb-10">
              <h2 className="text-4xl font-light text-white mb-6 tracking-tight">{t('bookingTitle')}</h2>
              <div className="flex justify-center gap-8 text-sm text-slate-400 bg-slate-800/50 w-fit mx-auto px-6 py-3 rounded-full border border-white/5">
                <span className="flex items-center gap-2 font-medium"><Clock size={16} className="text-blue-400"/> {t('checkIn')}: {dynamicRules.checkInTime || SITE_CONFIG.checkInTime}</span>
                <span className="flex items-center gap-2 font-medium"><Clock size={16} className="text-blue-400"/> {t('checkOut')}: {dynamicRules.checkOutTime || SITE_CONFIG.checkOutTime}</span>
              </div>
            </div>
            
            <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full relative z-20">
              {!currentUser && (
                <>
                  <div className="space-y-2"><label className="text-xs uppercase tracking-widest text-slate-500 ml-2 font-bold">{t('name')}</label><input name="name" required placeholder="Ivan Ivanov" className="w-full bg-slate-800/80 border border-slate-700 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all text-base box-border text-white shadow-inner" /></div>
                  <div className="space-y-2"><label className="text-xs uppercase tracking-widest text-slate-500 ml-2 font-bold">{t('contact')}</label><input name="contact" required placeholder="@tg / +90..." className="w-full bg-slate-800/80 border border-slate-700 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all text-base box-border text-white shadow-inner" /></div>
                </>
              )}
              
              {/* Задача 1.1 Календарь на всю ширину (md:col-span-2) */}
              <div className={`space-y-2 w-full md:col-span-2 relative`}>
                <div className="flex justify-between items-center ml-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t('dates')}</label>
                    {startDate && <button type="button" onClick={() => setDateRange([null, null])} className="text-[10px] bg-red-900/30 text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded-md font-bold uppercase transition-colors">{t('clearDatesBtn') || 'Сбросить'}</button>}
                </div>
                
                {/* Триггер Кастомного Календаря */}
                <div onClick={() => setIsGuestCalendarOpen(!isGuestCalendarOpen)} className={`w-full bg-slate-800/80 border ${isGuestCalendarOpen ? 'border-blue-500' : 'border-slate-700 hover:border-blue-500/50'} p-5 rounded-2xl text-white outline-none font-bold text-lg md:text-xl uppercase cursor-pointer box-border flex items-center justify-between transition-all shadow-inner`}>
                   <span>{startDate && endDate ? `${format(startDate, 'dd.MM.yy')} — ${format(endDate, 'dd.MM.yy')}` : startDate ? `${format(startDate, 'dd.MM.yy')} — ...` : t('selectDatesPrompt') || 'Выберите даты'}</span>
                   <CalendarIcon className={`${isGuestCalendarOpen ? 'text-blue-400' : 'text-slate-500'}`} size={24}/>
                </div>
                
                {/* Кастомный Встроенный Календарь */}
                <div className={`absolute top-[85px] left-0 right-0 z-[100] bg-slate-900 border border-blue-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden transition-all duration-300 origin-top ${isGuestCalendarOpen ? 'opacity-100 scale-100 h-auto p-4 md:p-6' : 'opacity-0 scale-95 h-0 p-0 pointer-events-none'}`}>
                   <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-2 rounded-2xl border border-white/5">
                      <button type="button" onClick={() => setGuestCurrentMonth(addMonths(guestCurrentMonth, -1))} className="p-3 bg-slate-700 rounded-xl hover:bg-blue-600 text-white transition-colors shadow-md"><ChevronLeft size={20}/></button>
                      <button type="button" onClick={() => setIsGuestCalendarOpen(false)} className="text-slate-400 hover:text-white p-2 font-bold text-xs uppercase tracking-widest bg-slate-800 rounded-xl transition-colors px-4 border border-white/5">{t('cancelBtn')}</button>
                      <button type="button" onClick={() => setGuestCurrentMonth(addMonths(guestCurrentMonth, 1))} className="p-3 bg-slate-700 rounded-xl hover:bg-blue-600 text-white transition-colors shadow-md"><ChevronRight size={20}/></button>
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
                       <div className="w-full md:w-1/2 bg-slate-950/50 p-4 rounded-2xl border border-white/5 shadow-inner">{renderGuestMonth(guestCurrentMonth)}</div>
                       <div className="w-full md:w-1/2 hidden md:block bg-slate-950/50 p-4 rounded-2xl border border-white/5 shadow-inner">{renderGuestMonth(addMonths(guestCurrentMonth, 1))}</div>
                   </div>
                   
                   <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-[10px] text-slate-400 justify-center uppercase tracking-widest font-bold">
                       <span className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-900 line-through opacity-50 border border-transparent rounded"></span> Занято</span>
                       <span className="flex items-center gap-2"><span className="w-4 h-4 border-l-red-500 border-l-2 bg-slate-800 rounded"></span> {t('tooltipCheckoutOnly')}</span>
                       <span className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500/10 border border-yellow-500/50 border-dashed rounded"></span> Мин. ночей</span>
                   </div>
                </div>
              </div>

              {/* Задача 1.1 Поля количества гостей строго под календарем в два ряда (ширина 100%) */}
              <div className="space-y-2 w-full md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 font-bold">{t('adults')}</label>
                <select value={adults} onChange={(e) => setAdults(parseInt(e.target.value))} className="w-full bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-white outline-none text-base box-border shadow-inner font-bold appearance-none cursor-pointer">
                  {[...Array(SITE_CONFIG.maxTotalGuests + 1).keys()].slice(1).map(n => (<option key={n} value={n} disabled={n + children > SITE_CONFIG.maxTotalGuests}>{n}</option>))}
                </select>
              </div>
              
              <div className="space-y-2 w-full md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 font-bold">{t('children')}</label>
                <select value={children} onChange={(e) => setChildren(parseInt(e.target.value))} className="w-full bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-white outline-none text-base box-border shadow-inner font-bold appearance-none cursor-pointer">
                  {[...Array(SITE_CONFIG.maxTotalGuests).keys()].map(n => (<option key={n} value={n} disabled={n + adults > SITE_CONFIG.maxTotalGuests}>{n}</option>))}
                </select>
              </div>

              {startDate && endDate && (
                <div className="md:col-span-2 mt-6 bg-slate-800 border border-slate-600 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center shadow-[0_0_20px_rgba(0,0,0,0.3)] transform transition-all hover:scale-[1.01]">
                   <span className="text-lg text-slate-400 font-bold mb-2 md:mb-0 uppercase tracking-widest">{t('totalPrice')}</span>
                   <span className="text-5xl font-extrabold text-green-400 drop-shadow-lg tracking-tighter">{calculateTotalPrice()} <span className="text-3xl text-green-500/70">{CURRENCY_SYMBOLS[activeCurrency]}</span></span>
                </div>
              )}
              
              {isShortStay && (
                  <div className="md:col-span-2 mt-4 bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-2xl shadow-inner flex items-start gap-4">
                     <div className="bg-yellow-500/20 p-2 rounded-full shrink-0 mt-1"><Info className="text-yellow-400" size={20}/></div>
                     <div>
                         <p className="text-yellow-400 text-sm font-bold leading-relaxed">{t('shortStayWarning').replace('{n}', nightsCount).replace('{min}', currentMinNights)}</p>
                     </div>
                  </div>
              )}
              
              <div className="md:col-span-2 mt-4 bg-slate-950/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                <LegalCheckboxes />
              </div>
              
              <div className="md:col-span-2 mt-4 w-full">
                <button type="submit" disabled={status === 'loading' || !agreedKVKK || !agreedContract || !agreedPrivacy} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:border py-6 rounded-2xl font-bold text-2xl text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] box-border flex justify-center items-center gap-3 tracking-wide">
                  {status === 'loading' ? <span className="animate-pulse">{t('loading')}</span> : (effectiveBookingMode === 'manual' ? t('sendRequestBtn') : <>{t('payBtn')} <ChevronRight size={24}/></>)}
                </button>
              </div>
            </form>

            <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] md:text-xs uppercase tracking-widest text-slate-500">
              <div className="flex flex-col gap-2 items-center text-center"><span className="text-slate-400 font-bold">{t('minNights')}</span><span className="text-white font-mono text-base bg-slate-800 px-3 py-1 rounded-lg border border-white/5">{dynamicRules.minNights}</span></div>
              <div className="flex flex-col gap-2 items-center text-center"><span className="text-slate-400 font-bold">{t('bookingWindow')}</span><span className="text-white font-mono text-base bg-slate-800 px-3 py-1 rounded-lg border border-white/5">{dynamicRules.bookingWindowMonths} {t('monthsAbbr')}</span></div>
              <div className="flex flex-col gap-2 items-center text-center"><span className="text-slate-400 font-bold">{t('advanceNotice')}</span><span className="text-white font-mono text-base bg-slate-800 px-3 py-1 rounded-lg border border-white/5">{getNoticeText(dynamicRules.advanceNoticeDays)}</span></div>
              <div className="flex flex-col gap-2 items-center text-center"><span className="text-slate-400 font-bold">{t('maxGuests')}</span><span className="text-white font-mono text-base bg-slate-800 px-3 py-1 rounded-lg border border-white/5">{SITE_CONFIG.maxTotalGuests}</span></div>
            </div>
          </div>
        </section>

        {/* ГАЛЕРЕЯ */}
        <section className="py-24 bg-slate-900/30 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-light text-white mb-16 tracking-tight">{t('galleryTitle')}</h2>
            <div className="flex flex-col gap-20 text-left">
              {publicData.gallery && publicData.gallery.length > 0 ? (
                 Object.values(publicData.gallery.reduce((acc, item) => {
                    const grp = getTranslated(item, 'group') || 'Основная галерея';
                    if (!acc[grp]) acc[grp] = { group: item.group, desc: item.groupDesc, items: [] };
                    acc[grp].items.push(item); return acc;
                 }, {})).map((gObj, gIdx) => (
                    <div key={gIdx} className="w-full">
                       <div className="mb-10 text-center">
                           {getTranslated(gObj, 'group') && <h3 className="text-3xl font-bold text-white mb-4 inline-block pb-2 border-b-2 border-blue-500">{getTranslated(gObj, 'group')}</h3>}
                           {getTranslated(gObj, 'desc') && <p className="text-slate-400 max-w-2xl mx-auto text-sm">{getTranslated(gObj, 'desc')}</p>}
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {gObj.items.map(item => (
                             <div key={item.id} className="bg-slate-800/50 backdrop-blur rounded-[2rem] border border-white/5 overflow-hidden shadow-xl flex flex-col hover:-translate-y-2 transition-transform">
                                <div className="h-[300px] w-full relative overflow-hidden"><MediaCarousel media={item.media} type={item.type} /></div>
                                {getTranslated(item, 'caption') && <div className="p-6 bg-slate-900/50 flex-1 flex items-center justify-center text-center border-t border-white/5"><p className="text-slate-300 text-sm leading-relaxed">{getTranslated(item, 'caption')}</p></div>}
                             </div>
                          ))}
                       </div>
                    </div>
                 ))
              ) : (<div className="text-center text-slate-500 font-medium w-full bg-slate-800/30 py-10 rounded-3xl border border-white/5">Галерея в процессе наполнения...</div>)}
            </div>
          </div>
        </section>
      </div>

      <footer className="w-full mt-20 pt-16 pb-12 px-6 border-t border-white/10 bg-slate-950 text-slate-400 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h4 className="text-white font-bold text-lg mb-2">{contentData.legal.legal_info_title?.[lang] || t('legalInfo')}</h4>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4">
              <Link href="/legal/contract" className="hover:text-blue-400 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-white/5 shadow-inner">{contentData.legal.contract?.title?.[lang] || t('linkContract')}</Link>
              <Link href="/legal/kvkk" className="hover:text-blue-400 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-white/5 shadow-inner">{contentData.legal.kvkk?.title?.[lang] || t('linkKVKK')}</Link>
              <Link href="/legal/privacy" className="hover:text-blue-400 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-white/5 shadow-inner">{contentData.legal.privacy?.title?.[lang] || t('linkPrivacy')}</Link>
              <Link href="/legal/cancellation" className="hover:text-blue-400 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-white/5 shadow-inner">{contentData.legal.cancellation?.title?.[lang] || t('linkCancellation')}</Link>
            </div>
            <div className="space-y-2 text-xs md:text-sm bg-slate-900/50 p-6 rounded-2xl border border-white/5 inline-block">
              <p><strong className="text-slate-300">Ticari Ünvan:</strong> {contentData.legal.company_name?.text?.[lang] || contentData.legal.company_name?.text?.ru}</p>
              <p><strong className="text-slate-300">Vergi Dairesi ve No:</strong> {contentData.legal.tax_info?.text?.[lang] || contentData.legal.tax_info?.text?.ru}</p>
              <p><strong className="text-slate-300">İletişim:</strong> {contentData.legal.contact_email?.text?.[lang] || contentData.legal.contact_email?.text?.ru}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="border border-dashed border-slate-700 p-6 rounded-3xl flex flex-col items-center justify-center text-xs w-48 h-48 bg-slate-900/50 relative overflow-hidden shadow-inner">
               <span className="text-slate-500 text-center mb-2 whitespace-pre-wrap">{contentData.legal.etbis_placeholder?.text?.[lang] || contentData.legal.etbis_placeholder?.text?.ru || t('etbisPlaceholder')}</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-lg border border-white/5">{contentData.legal.etbis_text?.text?.[lang] || contentData.legal.etbis_text?.ru || t('etbisText')}</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 text-center flex flex-col gap-2">
          <p className="text-xs text-slate-600 font-medium">© {new Date().getFullYear()} ALEKSEI ZNAMENSKII - Villa Turaman.</p>
        </div>
      </footer>

      {/* МОДАЛКИ */}
      {authMode !== 'none' && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setAuthMode('none')}></div>
          <div className="relative bg-slate-900 border border-blue-500/20 w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(37,99,235,0.15)] overflow-y-auto max-h-[90vh] box-border">
            <button onClick={() => setAuthMode('none')} className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X size={20}/></button>
            <h2 className="text-2xl font-bold text-white mb-8 tracking-wide">{authMode === 'register' ? t('register') : t('login')}</h2>
            <form onSubmit={(e) => handleAuthSubmit(e, null, null, authMode)} className="space-y-6 w-full">
              {authMode === 'register' && (<div className="w-full"><label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2 font-bold ml-1">{t('name')}</label><input name="name" required className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-base text-white outline-none focus:border-blue-500 shadow-inner transition-colors" /></div>)}
              <div className="w-full"><label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2 font-bold ml-1">{t('contact')}</label><input name="contact" required className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-base text-white outline-none focus:border-blue-500 shadow-inner transition-colors" /></div>
              <div className="w-full"><label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2 font-bold ml-1">{t('passwordLabel')}</label><input name="password" type="password" required className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-base text-white outline-none focus:border-blue-500 shadow-inner transition-colors" /></div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-transform active:scale-[0.98]">{authMode === 'register' ? t('register') : t('login')}</button>
            </form>
          </div>
        </div>
      )}

      {pendingHostUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setPendingHostUser(null)}></div>
          <div className="relative bg-slate-900 border border-red-500/30 w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center box-border">
            <button onClick={() => setPendingHostUser(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X size={20}/></button>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-wide flex items-center justify-center gap-2"><Lock className="text-red-500" size={24}/> {t('adminCrmGuardTitle')}</h2>
            <p className="text-xs text-slate-400 mb-8">{t('adminCrmGuardSubtitle')}</p>
            
            {!twoFaSecret ? (
               <div className="bg-red-900/30 text-red-400 p-4 rounded-xl text-xs mb-6 border border-red-500/30">{t('error_2fa_secret_not_found')}</div>
            ) : (
              qrCodeUrl && (
                <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-inner">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                  <p className="text-[10px] text-slate-800 font-mono mt-2 select-all font-bold bg-slate-100 py-1 rounded">Secret: {twoFaSecret}</p>
                </div>
              )
            )}
            
            <form onSubmit={handleVerify2FA} className="space-y-6 w-full">
              <div>
                <label className="block text-left text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold ml-1">{t('twoFaCodeLabel')}</label>
                <input type="text" maxLength={6} value={twoFaInput} onChange={(e) => setTwoFaInput(e.target.value)} placeholder="000000" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-2xl tracking-[0.5em] text-center text-white outline-none focus:border-red-500 font-mono shadow-inner transition-colors" required disabled={!twoFaSecret} />
              </div>
              {twoFaError && <p className="text-red-500 text-xs font-bold bg-red-900/30 py-2 rounded-lg">{twoFaError}</p>}
              <button type="submit" disabled={!twoFaSecret} className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold text-white text-sm tracking-wider shadow-lg disabled:opacity-50 transition-transform active:scale-[0.98]">{t('verifyBtn')}</button>
            </form>
          </div>
        </div>
      )}

      {galleryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setGalleryModal(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[3rem] flex flex-col shadow-2xl">
            <button onClick={() => setGalleryModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white z-10 bg-slate-800 p-3 rounded-full"><X size={24}/></button>
            <div className="p-8 border-b border-white/5 flex gap-4 overflow-x-auto">
              {roomGalleries.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setLightboxIndex(null); }} className={`px-6 py-3 rounded-full transition-all whitespace-nowrap font-bold text-sm ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentImages.map((img, i) => (
                <div key={i} onClick={() => setLightboxIndex(i)} className="rounded-[2rem] overflow-hidden h-[300px] border border-white/5 cursor-zoom-in group relative shadow-lg">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/98 backdrop-blur-sm">
          <button onClick={() => setLightboxIndex(null)} className="absolute top-8 right-8 text-white/50 hover:text-white z-50 bg-white/10 p-3 rounded-full transition-colors"><X size={24}/></button>
          <button onClick={prevPhoto} className="absolute left-4 md:left-10 p-4 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft size={32}/></button>
          <img src={currentImages[lightboxIndex]} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" alt="Gallery"/>
          <button onClick={nextPhoto} className="absolute right-4 md:right-10 p-4 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronRight size={32}/></button>
        </div>
      )}

      {descModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setDescModal(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-[3rem] p-10 md:p-16 shadow-2xl">
            <button onClick={() => setDescModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white bg-slate-800 p-3 rounded-full transition-colors"><X size={24}/></button>
            <h2 className="text-4xl font-light text-white mb-12 tracking-tight border-b border-white/10 pb-6">{homeData.aboutTitle}</h2>
            <div className="space-y-12">
              {fullDescription.sections.map((s, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-8 py-2 bg-gradient-to-r from-slate-800/50 to-transparent rounded-r-3xl">
                  <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {presentationModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setPresentationModal(null)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl flex flex-col md:flex-row">
            <button onClick={() => setPresentationModal(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white z-50 bg-slate-900 p-3 rounded-full border border-white/10 shadow-lg transition-colors"><X size={24}/></button>
            <div className="w-full md:w-1/2 flex flex-col bg-slate-950 rounded-t-[3rem] md:rounded-l-[3rem] md:rounded-tr-none border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
              <div className="h-[350px] md:h-full w-full"><MediaCarousel media={presentationModal.images} type="image" /></div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
               <div>
                 <div className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full mb-6 uppercase tracking-widest shadow-inner ${presentationModal.pType === 'course' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/20' : 'bg-blue-900/30 text-blue-400 border border-blue-500/20'}`}>
                   {presentationModal.pType === 'product' ? getProductType(presentationModal) : t('courseType')}
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">{getTranslated(presentationModal, 'name')}</h2>
                 <p className="text-slate-400 text-base md:text-lg mb-8 pb-8 border-b border-white/10 leading-relaxed">{getTranslated(presentationModal, 'desc')}</p>
                 
                 {presentationModal.detailedDesc && (presentationModal.detailedDesc[lang] || presentationModal.detailedDesc['ru']) && (
                   <div className="mb-10 bg-slate-800/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Info size={18} className="text-blue-400"/> {t('detailsTitle')}</h3>
                     <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{presentationModal.detailedDesc[lang] || presentationModal.detailedDesc['ru']}</p>
                   </div>
                 )}
               </div>
               
               <div className="mt-auto bg-slate-800/80 p-8 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur">
                  <LegalCheckboxes />
                  <div className="flex justify-between items-center mb-8 mt-6">
                    <span className="text-sm text-slate-400 uppercase tracking-widest font-bold">{t('totalPrice')}</span>
                    <span className="text-4xl font-extrabold text-green-400 drop-shadow-md">{presentationModal.price[activeCurrency.toLowerCase()] || presentationModal.price.eur || 0} <span className="text-2xl text-green-500/70">{CURRENCY_SYMBOLS[activeCurrency]}</span></span>
                  </div>
                  <button disabled={!agreedKVKK || !agreedContract || !agreedPrivacy} onClick={() => { handleProductPurchase(presentationModal.price[activeCurrency.toLowerCase()] || presentationModal.price.eur || 0, presentationModal.pType); setPresentationModal(null); }} className={`w-full py-5 rounded-2xl text-white font-bold text-xl shadow-xl transition-transform active:scale-[0.98] flex justify-center items-center gap-3 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed ${presentationModal.pType === 'course' ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30'}`}>
                    {presentationModal.pType === 'course' ? <PlayCircle size={24}/> : <ShoppingBag size={24}/>}
                    {presentationModal.pType === 'course' ? t('courseStart') : t('productBuy')}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
