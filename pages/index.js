import Head from 'next/head'; 
import { useState, useEffect, useRef } from 'react'; 
import DatePicker, { registerLocale } from 'react-datepicker'; 
import { ru, enUS, tr } from 'date-fns/locale'; 
import { addMonths, addDays, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, format, parse } from 'date-fns'; 
import { MessageCircle, Users, Check, Camera, X, ChevronRight, ChevronLeft, Clock, Calendar as CalendarIcon, User, Lock, Send, Paperclip, Settings, FileText, Layers } from 'lucide-react'; 
import { useLanguage } from '../utils/language';
import Link from 'next/link';

const SITE_CONFIG = {
  authorName: "Vasilisa Znamenskii",
  telegramContact: "marmarisyachtingru",
  heroImage: "https://images.unsplash.com/photo-1596496181848-3091d4334026?q=80&w=2070&auto=format&fit=crop", // Placeholder
  defaultCurrency: 'RUB',
  // Default rules for workshop booking
  basePrice: 3000, currency: 'RUB', minNights: 1, maxNights: 10, maxTotalGuests: 10, bookingWindowMonths: 12, advanceNoticeDays: 1,
  bookingMode: "instant"
};

const CURRENCY_SYMBOLS = { 'RUB': '₽', 'TRY': '₺', 'USD': '$', 'EUR': '€', 'GBP': '£' };

registerLocale('ru', ru);
registerLocale('en', enUS);
registerLocale('tr', tr);

const parseDateRU = (str) => {
  if (!str || typeof str !== 'string') return new Date(NaN);
  const parts = str.split('.');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10); const m = parseInt(parts[1], 10) - 1; const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m, d);
  }
  return new Date(NaN);
};

export default function Home() {
  const { t, changeLanguage, lang } = useLanguage();

  const fullDescription = {
    sections: [
      { title: t('courseProgram'), text: "Подробное описание техник и материалов, используемых в курсах." },
      { title: t('whatYouGet'), text: "Вы получаете пожизненный доступ к видеоурокам, подробные схемы и персональную поддержку от куратора." },
      { title: t('aboutAuthor'), text: t('aboutText') }
    ]
  };


  const [status, setStatus] = useState('idle'); 
  const [descModal, setDescModal] = useState(false);
  
  // Состояния для календаря и бронирования МК
  const [adults, setAdults] = useState(1); 
  const [children, setChildren] = useState(0); 
  const [apiOccupiedDates, setApiOccupiedDates] = useState([]); 
  const [apiEvents, setApiEvents] = useState([]);
  const [manualBlockedDates, setManualBlockedDates] = useState([]);
  const occupiedDates = [...apiOccupiedDates, ...manualBlockedDates];
  const [dateRange, setDateRange] = useState([null, null]); 
  const [startDate, endDate] = dateRange;
  const [dynamicRules, setDynamicRules] = useState({
    basePrice: SITE_CONFIG.basePrice, currency: SITE_CONFIG.currency, minNights: SITE_CONFIG.minNights,
    maxNights: SITE_CONFIG.maxNights, bookingWindowMonths: SITE_CONFIG.bookingWindowMonths, advanceNoticeDays: SITE_CONFIG.advanceNoticeDays,
    bookingMode: SITE_CONFIG.bookingMode
  });
  const [dateRules, setDateRules] = useState([]); 

  // Состояния для E-commerce & LMS
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [authMode, setAuthMode] = useState('none'); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [siteBlocked, setSiteBlocked] = useState(false); 

  // Состояния для 2FA верификации владельца
  const [pendingHostUser, setPendingHostUser] = useState(null);
  const [twoFaInput, setTwoFaInput] = useState('');
  const [twoFaError, setTwoFaError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const twoFaSecret = process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET;

  const [chatMessages, setChatMessages] = useState([]); 
  const [guestActiveRequests, setGuestActiveRequests] = useState([]);
  const [timeLefter, setTimeLefter] = useState({});

  const [chatInput, setChatInput] = useState(''); 
  const [chatFile, setChatFile] = useState(null); 
  const [chatLoading, setChatLoading] = useState(false); 

  const [hostTab, setHostTab] = useState('chats'); 
  const [masterAllChats, setMasterAllChats] = useState([]);
  const [selectedClientSheets, setSelectedClientSheets] = useState([]); 
  const [masterChatInput, setMasterChatInput] = useState(''); 
  const [offerModal, setOfferModal] = useState(false);
  const [offerData, setOfferData] = useState({ checkIn: '', checkOut: '', price: '', rowIndex: null, contact: '' });  
  const [calSetRange, setCalSetRange] = useState([null, null]); 
  const [editStatus, setEditStatus] = useState('Открыто'); 
  const [editPrice, setEditPrice] = useState(''); 
  const [editMinNights, setEditMinNights] = useState(''); 
  const [editNote, setEditNote] = useState(''); 
  const [editBookingMode, setEditBookingMode] = useState('');
  const [hostCurrentMonth, setHostCurrentMonth] = useState(null);

  const [agreedKVKK, setAgreedKVKK] = useState(false);
  const [agreedContract, setAgreedContract] = useState(false);

  const chatBottomRef = useRef(null);

  const activeChat = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName));
  const activeRequestsList = activeChat?.activeRequests || [];

  const translateStatus = (st) => {
    if (!st) return '';
    if (st.includes('ЗАПРОС')) return t('statusPending');
    if (st.includes('ОЖИДАЕТ ОПЛАТЫ')) return t('statusAwaitingPay');
    if (st.includes('СПЕЦПРЕДЛОЖЕНИЕ')) return t('statusOffer');
    if (st.includes('ОПЛАЧЕНО')) return t('statusPaid');
    if (st.includes('ОТОЗВАНО')) return t('statusRevoked');
    if (st.includes('ОТКЛОНЕНО')) return t('statusRejected');
    return st;
  };

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/booking?action=get_content');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setCourses(data.courses || []);
        setSchedule(data.schedule || []);
      }
    } catch (err) {}
  };

  const getNoticeText = (days) => {
    if (days === 0) return t('todayLabel');
    if (days === 1) return `1 ${t('dayLabel')}`;
    return `${days} ${t('daysLabel')}`;
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_settings' }) });
      const data = await res.json();
      if (data.success) {
        if (data.globalRules) {
          setDynamicRules({
            basePrice: !isNaN(parseInt(data.globalRules.basePrice)) ? parseInt(data.globalRules.basePrice) : SITE_CONFIG.basePrice,
            currency: data.globalRules.currency || SITE_CONFIG.currency,
            minNights: !isNaN(parseInt(data.globalRules.minNights)) ? parseInt(data.globalRules.minNights) : SITE_CONFIG.minNights,
            maxNights: !isNaN(parseInt(data.globalRules.maxNights)) ? parseInt(data.globalRules.maxNights) : SITE_CONFIG.maxNights,
            bookingWindowMonths: !isNaN(parseInt(data.globalRules.bookingWindowMonths)) ? parseInt(data.globalRules.bookingWindowMonths) : SITE_CONFIG.bookingWindowMonths,
            advanceNoticeDays: !isNaN(parseInt(data.globalRules.advanceNoticeDays)) ? parseInt(data.globalRules.advanceNoticeDays) : SITE_CONFIG.advanceNoticeDays,
            bookingMode: data.globalRules.bookingMode || SITE_CONFIG.bookingMode
          });
        }
        if (data.dateRules) {
          setDateRules(data.dateRules);
          let manualBlocks = new Set();
          const sortedRulesForBlocks = [...data.dateRules].reverse();
          sortedRulesForBlocks.forEach(rule => {
              const rs = parseDateRU(rule.start); const re = parseDateRU(rule.end);
              if (isNaN(rs) || isNaN(re)) return; 
              let cur = new Date(rs.getFullYear(), rs.getMonth(), rs.getDate());
              const end = new Date(re.getFullYear(), re.getMonth(), re.getDate());
              while (cur <= end) {
                  const dateStr = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
                  if (rule.type === 'Блокировка') manualBlocks.add(dateStr);
                  if (rule.type === 'Сброс блокировки') manualBlocks.delete(dateStr);
                  cur.setDate(cur.getDate() + 1);
              }
          });
          setManualBlockedDates(Array.from(manualBlocks).map(ds => {
             const [y, m, d] = ds.split('-');
             return new Date(y, parseInt(m), parseInt(d));
          }));
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    setHostCurrentMonth(new Date());
    fetchContent();
    fetchSettings();

    const savedUser = localStorage.getItem('villa_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.isHost) {
        const session = sessionStorage.getItem('owner_session');
        if (!session) {
          setPendingHostUser(parsed);
        } else {
          handleAuthSubmit(null, parsed.contact, parsed.password, 'login', true);
        }
      } else {
        handleAuthSubmit(null, parsed.contact, parsed.password, 'login'); 
      }
    }
  }, []);

  // Генерация QR-кода при ожидании 2FA
  useEffect(() => {
    if (pendingHostUser && twoFaSecret) {
      import('qrcode').then((QRCode) => {
        const otpauthUrl = `otpauth://totp/VasilisaAcademy:Admin?secret=${twoFaSecret}&issuer=VasilisaAcademy`;
        QRCode.toDataURL(otpauthUrl, (err, url) => {
          if (!err) setQrCodeUrl(url);
        });
      });
    }
  }, [pendingHostUser, twoFaSecret]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = {};
      let changed = false;
      guestActiveRequests.forEach(req => {
         if (req.expiresAt && (req.status === 'ОЖИДАЕТ ОПЛАТЫ' || req.status === 'СПЕЦПРЕДЛОЖЕНИЕ')) {
            const diff = new Date(req.expiresAt).getTime() - Date.now();
            if (diff <= 0) {
               newTimes[req.rowIndex] = 'EXPIRED';
            } else {
               const h = Math.floor(diff / (1000 * 60 * 60));
               const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
               const s = Math.floor((diff % (1000 * 60)) / 1000);
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
        setEditPrice(getPriceForDate(checkDate) != dynamicRules.basePrice ? getPriceForDate(checkDate) : '');
        setEditMinNights(getMinNightsForDate(checkDate) != dynamicRules.minNights ? getMinNightsForDate(checkDate) : '');
        setEditStatus(isManualBlocked(checkDate) ? 'Заблокировано' : 'Открыто');
        setEditNote(getNoteForDate(checkDate) || '');
        setEditBookingMode('');
    } else if (calSetRange[0] && !calSetRange[1]) {
        const checkDate = calSetRange[0];
        setEditPrice(getPriceForDate(checkDate) != dynamicRules.basePrice ? getPriceForDate(checkDate) : '');
        setEditMinNights(getMinNightsForDate(checkDate) != dynamicRules.minNights ? getMinNightsForDate(checkDate) : '');
        setEditStatus(isManualBlocked(checkDate) ? 'Заблокировано' : 'Открыто');
        setEditNote(getNoteForDate(checkDate) || '');
        setEditBookingMode('');
    } else {
        setEditPrice(''); setEditMinNights(''); setEditStatus('Открыто'); setEditNote(''); setEditBookingMode('');
    }
  }, [calSetRange, dynamicRules, dateRules]);

  useEffect(() => {
    let interval;
    if (currentUser?.isHost && currentUser?.permissions?.chats) {
      fetchMasterChats(); interval = setInterval(fetchMasterChats, 15000);
    } else if (currentUser?.hasChat && !currentUser?.blockChat && !currentUser?.isHost) {
      fetchChatMessages(); interval = setInterval(fetchChatMessages, 10000);
    }
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, masterAllChats, selectedClientSheets]);

  const handleAuthSubmit = async (e, contactFallback, passwordFallback, mode, skip2FA = false) => {
    if (e) e.preventDefault();
    const formData = e ? new FormData(e.target) : null;
    const payload = { action: mode, name: formData ? formData.get('name') : null, contact: formData ? formData.get('contact') : contactFallback, password: formData ? formData.get('password') : passwordFallback };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await res.json();
    if (result.success) {
      const userObj = { ...result.user, password: payload.password || "123456" }; 
      if (userObj.isHost && !skip2FA) {
        const session = sessionStorage.getItem('owner_session');
        if (session) {
           localStorage.setItem('villa_user', JSON.stringify(userObj)); setCurrentUser(userObj); setAuthMode('none');
        } else {
           setPendingHostUser(userObj); setAuthMode('none');
        }
      } else {
        localStorage.setItem('villa_user', JSON.stringify(userObj)); setCurrentUser(userObj); setAuthMode('none');
      }
    } else {
      if (result.blockType === 'site') { setSiteBlocked(true); localStorage.removeItem('villa_user'); } 
      else { if (e) alert(result.error); if (!e) localStorage.removeItem('villa_user'); }
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setTwoFaError('');
    try {
      const res = await fetch('/api/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: twoFaInput })
      });
      const result = await res.json();
      if (result.success) {
        sessionStorage.setItem('owner_session', result.sessionToken);
        localStorage.setItem('villa_user', JSON.stringify(pendingHostUser));
        setCurrentUser(pendingHostUser);
        setPendingHostUser(null);
        setTwoFaInput('');
      } else {
        setTwoFaError(result.error || 'Ошибка проверки кода');
      }
    } catch (err) {
      setTwoFaError('Сбой соединения при проверке кода');
    }
  };

  const handleLogout = () => { 
    localStorage.removeItem('villa_user'); 
    sessionStorage.removeItem('owner_session'); 
    setCurrentUser(null); 
    setPendingHostUser(null); 
  };

  const fetchChatMessages = async () => {
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'chat', contact: currentUser.contact, sender: currentUser.name }) });
    const data = await res.json();
    if (data.success && data.messages) {
      setChatMessages(data.messages);
      setGuestActiveRequests(data.activeRequests || []);
    }
  };

  const fetchMasterChats = async () => {
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_get_chats' }) });
    const data = await res.json(); if (data.success && data.chats) setMasterAllChats(data.chats);
  };

  const handleFileAttach = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 4 * 1024 * 1024) return alert("Файл слишком большой (Max 4MB).");
    const reader = new FileReader();
    reader.onload = () => { setChatFile({ name: file.name, type: file.type, base64: reader.result.split(',')[1] }); };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault(); if (!chatInput.trim() && !chatFile) return; setChatLoading(true);
    const payload = { action: 'chat', contact: currentUser.contact, sender: currentUser.name, message: chatInput, fileName: chatFile?.name, mimeType: chatFile?.type, fileBase64: chatFile?.base64 };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await res.json();
    if (result.success) { setChatInput(''); setChatFile(null); await fetchChatMessages(); } 
    else alert(result.error);
    setChatLoading(false);
  };

  const handleMasterSend = async (e) => {
    e.preventDefault(); if (!masterChatInput.trim() || selectedClientSheets.length === 0) return;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_send_chats', targetSheets: selectedClientSheets, sender: currentUser.name, message: masterChatInput }) });
    if ((await res.json()).success) { setMasterChatInput(''); await fetchMasterChats(); }
  };

  const handleApproveRequest = async (req) => {
    if (!req) return;
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve_request', rowIndex: req.rowIndex, chatSheetName: chatSheet, checkIn: req.checkIn, checkOut: req.checkOut, contact: req.contact }) });
    if ((await res.json()).success) { alert(t('requestApproved')); fetchMasterChats(); fetchContent(); }
  };

  const handleRejectRequest = async (req) => {
    if (!req) return;
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject_request', rowIndex: req.rowIndex, chatSheetName: chatSheet, checkIn: req.checkIn, checkOut: req.checkOut, contact: req.contact }) });
    if ((await res.json()).success) { alert(t('rejectSuccess')); fetchMasterChats(); fetchContent(); }
  };

  const handleSpecialOffer = async (e) => {
    e.preventDefault();
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const reqBase = activeRequestsList.find(r => r.rowIndex === offerData.rowIndex);
    if (!reqBase) return;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'special_offer', rowIndex: reqBase.rowIndex, chatSheetName: chatSheet, clientContact: reqBase.contact, checkIn: offerData.checkIn, checkOut: offerData.checkOut, price: offerData.price, nights: differenceInDays(parse(offerData.checkOut, 'dd.MM.yyyy', new Date()), parse(offerData.checkIn, 'dd.MM.yyyy', new Date())), adults: reqBase.adults, children: reqBase.children, guests: reqBase.guests }) });
    if ((await res.json()).success) { alert("Предложение отправлено!"); setOfferModal(false); fetchMasterChats(); fetchContent(); }
  };

  const handleRevokeRequest = async (req) => {
    if (!req) return;
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'revoke_request', rowIndex: req.rowIndex, chatSheetName: chatSheet, checkIn: req.checkIn, checkOut: req.checkOut, contact: req.contact }) });
    if ((await res.json()).success) { alert(t('revokeSuccess')); fetchMasterChats(); fetchContent(); }
  };

  const handleBuy = async (e, item, type) => {
    if (e) e.preventDefault();
    if (!agreedKVKK || !agreedContract) return alert(t('legalKVKK'));
    
    setStatus('loading');
    
    const data = {
      action: 'place_order',
      itemType: type,
      itemId: item.id,
      itemName: item.name,
      totalPrice: `${item.price} ${CURRENCY_SYMBOLS[item.currency || SITE_CONFIG.defaultCurrency]}`
    };

    data.isRegistered = !!currentUser;
    if (currentUser) { data.name = currentUser.name; data.contact = currentUser.contact; }
    
    try {
      const res = await fetch('/api/payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gateway: 'stripe', amount: item.price, currency: item.currency || SITE_CONFIG.defaultCurrency, bookingDetails: data }) });
      const result = await res.json();
      if (result.url) { window.location.href = result.url; } else { setStatus('error'); }
    } catch (err) { setStatus('error'); }
  };

  const handleGuestPayRequest = async (req) => {
    if (!req) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gateway: 'stripe', amount: parseInt(req.price), currency: dynamicRules.currency, bookingDetails: { ...req, action: 'booking' } }) });
      const result = await res.json();
      if (result.url) { window.location.href = result.url; } else { setStatus('error'); }
    } catch (err) { setStatus('error'); }
  };

  const insertTemplate = (text) => setMasterChatInput(prev => prev + (prev.length > 0 ? '\n' : '') + text);
  const toggleClientSelection = (sheetName) => setSelectedClientSheets(prev => prev.includes(sheetName) ? prev.filter(s => s !== sheetName) : [...prev, sheetName]);

  const handleMasterCalendarSave = async (e) => {
    e.preventDefault();
    const [cStart, cEnd] = calSetRange; if (!cStart) return alert(t('selectDatesLabel'));
    const startStr = format(cStart, 'dd.MM.yyyy'); const endStr = format(cEnd || cStart, 'dd.MM.yyyy');
    const rules = [];
    
    if (editStatus === 'Заблокировано') rules.push({ start: startStr, end: endStr, type: 'Блокировка', value: '1' });
    else if (editStatus === 'Открыто') rules.push({ start: startStr, end: endStr, type: 'Сброс блокировки', value: 'СБРОС' });
    
    if (editPrice !== '') rules.push({ start: startStr, end: endStr, type: 'Цена', value: editPrice });
    if (editMinNights !== '') rules.push({ start: startStr, end: endStr, type: 'Мин. участников', value: editMinNights });
    if (editNote !== '') rules.push({ start: startStr, end: endStr, type: 'Заметка', note: editNote });
    if (editBookingMode !== '') rules.push({ start: startStr, end: endStr, type: 'Тип бронирования', value: editBookingMode });

    if (rules.length === 0) return;

    const payload = { action: 'master_save_calendar', sender: currentUser.name, rules };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if ((await res.json()).success) { alert(t('successRulesSave')); setCalSetRange([null, null]); setEditPrice(''); setEditMinNights(''); setEditNote(''); setEditStatus('Открыто'); setEditBookingMode(''); fetchSettings(); }
  };

  const handleMasterCalendarReset = async () => {
    const [cStart, cEnd] = calSetRange; if (!cStart) return;
    const startStr = format(cStart, 'dd.MM.yyyy'); const endStr = format(cEnd || cStart, 'dd.MM.yyyy');
    const rules = [ { start: startStr, end: endStr, type: 'Сброс блокировки', value: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс цены', value: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс мин. участников', value: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс заметки', note: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс типа бронирования', value: 'СБРОС' } ];
    const payload = { action: 'master_save_calendar', sender: currentUser.name, rules };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if ((await res.json()).success) { alert(t('successRulesReset')); setCalSetRange([null, null]); setEditPrice(''); setEditMinNights(''); setEditNote(''); setEditStatus('Открыто'); setEditBookingMode(''); fetchSettings(); }
  };

  const handleMasterGlobalRulesSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); const rules = Object.fromEntries(formData);
    const payload = { action: 'master_save_global_rules', sender: currentUser.name, rules: rules };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if ((await res.json()).success) { alert(t('successGlobalSave')); setDynamicRules(prev => ({...prev, ...rules})); } 
  };

  const isSameDayHelper = (d1, d2) => {
    if (!d1 || !d2 || isNaN(d1) || isNaN(d2)) return false; 
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const handleHostDayClick = (clickedDate) => {
    if (!calSetRange[0] || (calSetRange[0] && calSetRange[1])) setCalSetRange([clickedDate, null]);
    else { if (clickedDate < calSetRange[0]) setCalSetRange([clickedDate, calSetRange[0]]); else setCalSetRange([calSetRange[0], clickedDate]); }
  };

  const getPriceForDate = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0);
        const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) {
            if (rule.type === 'Цена') return rule.value;
            if (rule.type === 'Сброс цены') return dynamicRules.basePrice;
        }
    }
    return dynamicRules.basePrice;
  };

  const isManualBlocked = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0);
        const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) {
            if (rule.type === 'Блокировка') return true;
            if (rule.type === 'Сброс блокировки') return false;
        }
    }
    return false;
  };

  const getMinNightsForDate = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0);
        const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) {
            if (rule.type === 'Мин. участников') return parseInt(rule.value) || dynamicRules.minNights;
            if (rule.type === 'Сброс мин. участников') return dynamicRules.minNights;
        }
    }
    return dynamicRules.minNights;
  };

  const getNoteForDate = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0);
        const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) {
            if (rule.type === 'Заметка') return rule.note;
            if (rule.type === 'Сброс заметки') return '';
        }
    }
    return '';
  };

  const getBookingModeForDateRange = (sDate, eDate) => {
    if (!sDate) return dynamicRules.bookingMode || 'instant';
    let isManual = false;
    let cur = new Date(sDate); cur.setHours(0,0,0,0);
    const end = eDate ? new Date(eDate) : new Date(sDate); end.setHours(0,0,0,0);

    while (cur <= end) {
      let dailyMode = dynamicRules.bookingMode || 'instant';
      for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0);
        const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        if (cur >= rS && cur <= rE) {
            if (rule.type === 'Тип бронирования') dailyMode = rule.value;
            if (rule.type === 'Сброс типа бронирования') dailyMode = dynamicRules.bookingMode || 'instant';
        }
      }
      if (dailyMode === 'manual') isManual = true;
      cur.setDate(cur.getDate() + 1);
    }
    return isManual ? 'manual' : 'instant';
  };

  const getBookingModeForSingleDate = (date) => getBookingModeForDateRange(date, date);
  const currentBookingMode = getBookingModeForDateRange(startDate, endDate);

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    let total = 0; let cur = new Date(startDate); cur.setHours(0,0,0,0);
    const end = new Date(endDate); end.setHours(0,0,0,0);
    while (cur < end) { total += parseInt(getPriceForDate(cur)) || parseInt(dynamicRules.basePrice); cur.setDate(cur.getDate() + 1); }
    return total * adults;
  };

  const safeMinDate = addDays(new Date(), parseInt(dynamicRules.advanceNoticeDays) || 0);
  const currentMinNights = getMinNightsForDate(startDate || safeMinDate);
  const nightsCount = (startDate && endDate) ? differenceInDays(endDate, startDate) : 0;
  const isShortStay = (adults > 0 && adults < currentMinNights);
  const effectiveBookingMode = isShortStay ? 'manual' : currentBookingMode;

  const handleDateChange = (update) => {
    const [newStart, newEnd] = update;
    if (newStart && !newEnd) {
        setDateRange([newStart, null]);
    } else if (newStart && newEnd) {
        if (newEnd < newStart) {
            setDateRange([newEnd, null]);
            return;
        }

        let cur = new Date(newStart);
        cur.setHours(0,0,0,0);
        const endD = new Date(newEnd);
        endD.setHours(0,0,0,0);
        let isValid = true;
        
        while (cur < endD) {
            if (isOccupiedDate(cur) && cur.getTime() !== newStart.getTime()) {
                isValid = false;
                break;
            }
            cur.setDate(cur.getDate() + 1);
        }

        if (!isValid) {
            setDateRange([newStart, null]);
            return;
        }

        const nightsCount = differenceInDays(endD, newStart);
        if (nightsCount > dynamicRules.maxNights) {
            setDateRange([newStart, null]);
            return;
        }
        
        setDateRange([newStart, newEnd]);
    } else {
        setDateRange([null, null]);
    }
  };

  const isOccupiedDate = (targetDate) => {
    if (!targetDate || isNaN(targetDate)) return true;
    const checkDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    return occupiedDates.some(occupiedDate => isSameDayHelper(checkDate, occupiedDate));
  };

  const isDateAvailable = (date) => {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const minStart = addDays(new Date(), parseInt(dynamicRules.advanceNoticeDays) || 0);
    minStart.setHours(0, 0, 0, 0);

    if (startDate && !endDate) {
        const sDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        if (checkDate < sDate) return true; 
        
        const nextOcc = occupiedDates
            .map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()))
            .filter(d => d > sDate)
            .sort((a, b) => a - b)[0];
            
        if (nextOcc && checkDate > nextOcc) return false;
    } else {
        if (checkDate < minStart) return false;
    }

    const isOccupied = isOccupiedDate(checkDate);

    if (isOccupied) {
        const prevDay = addDays(checkDate, -1);
        const isCheckoutValid = !isOccupiedDate(prevDay);

        if (startDate && !endDate) {
            if (isCheckoutValid && checkDate > startDate) return true;
        } else {
            if (isCheckoutValid) return true; 
        }
        return false;
    }

    return true;
  };

  const renderCustomHostCalendar = () => {
    if (!hostCurrentMonth) return null;
    const monthStart = startOfMonth(hostCurrentMonth);
    const monthEnd = endOfMonth(hostCurrentMonth);
    const startDateCal = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDateCal = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = [];
    let day = startDateCal;

    const dayHeaders = Array.from({ length: 7 }, (_, i) => {
        const d = addDays(startDateCal, i);
        return format(d, 'EEEEEE', { locale: lang === 'en' ? enUS : (lang === 'tr' ? tr : ru) });
    });

    while (day <= endDateCal) { days.push(day); day = addDays(day, 1); }

    return (
        <div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-4">{dayHeaders.map((d) => <div key={d}>{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-1">{days.map((d, i) => { const isCurrentMonth = isSameMonth(d, hostCurrentMonth); const isSelectedStart = calSetRange[0] && isSameDayHelper(d, calSetRange[0]); const isSelectedEnd = calSetRange[1] && isSameDayHelper(d, calSetRange[1]); const isInRange = calSetRange[0] && calSetRange[1] && d > calSetRange[0] && d < calSetRange[1]; const isBlocked = isManualBlocked(d); const price = getPriceForDate(d); const note = getNoteForDate(d); let dayClass = "p-2 md:p-3 rounded-xl cursor-pointer transition-all text-center flex flex-col items-center justify-center aspect-square text-sm md:text-base "; if (!isCurrentMonth) dayClass += "text-slate-600 bg-transparent"; else if (isSelectedStart || isSelectedEnd) dayClass += "bg-blue-600 text-white font-bold ring-2 ring-blue-400"; else if (isInRange) dayClass += "bg-blue-600/30 text-blue-200"; else if (isBlocked) dayClass += "bg-red-900/50 text-red-400 line-through"; else dayClass += "bg-slate-800/50 hover:bg-slate-700 text-slate-300"; return (<div key={i} onClick={() => handleHostDayClick(d)} className={dayClass} title={note}><span className="font-bold">{format(d, 'd')}</span>{isCurrentMonth && !isBlocked && (<span className={`text-[10px] mt-1 ${price !== dynamicRules.basePrice ? 'text-green-400 font-bold' : 'text-slate-500'}`}>{price}</span>)}</div>); })}</div>
        </div>
    );
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!agreedKVKK || !agreedContract) return alert(t('legalKVKK'));
    const totalGuests = adults + children;
    if (totalGuests > SITE_CONFIG.maxTotalGuests) return alert(`${t('maxGuests')}: ${SITE_CONFIG.maxTotalGuests}`);
    if (!startDate || !endDate) return alert(t('dates'));

    setStatus('loading');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    data.action = effectiveBookingMode === 'manual' ? 'request_booking' : 'booking'; 
    data.isRegistered = !!currentUser;
    if (currentUser) { data.name = currentUser.name; data.contact = currentUser.contact; }
    data.total_adults = adults; data.total_children = children; data.total_guests = totalGuests;
    data.checkIn = startDate.toLocaleDateString('ru-RU'); data.checkOut = endDate.toLocaleDateString('ru-RU');
    data.nights = nightsCount; data.totalPrice = `${calculateTotalPrice()} ${CURRENCY_SYMBOLS[dynamicRules.currency]}`;
    
    try {
      if (effectiveBookingMode === 'manual') {
        const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const result = await res.json();
        if (result.success) {
           const userObj = { ...result.user }; 
           localStorage.setItem('villa_user', JSON.stringify(userObj)); setCurrentUser(userObj); setStatus('idle'); setDateRange([null, null]);
           alert(t('requestApproved'));
           setTimeout(() => { if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: 'smooth' }); }, 500);
        } else { setStatus('error'); }
      } else {
        const res = await fetch('/api/payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gateway: 'stripe', amount: calculateTotalPrice(), currency: dynamicRules.currency, bookingDetails: data }) });
        const result = await res.json();
        if (result.url) { window.location.href = result.url; } else { setStatus('error'); }
      }
    } catch (err) { setStatus('error'); }
  };

  const safeMaxDate = addMonths(new Date(), parseInt(dynamicRules.bookingWindowMonths) || 24);

  if (siteBlocked) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center">
        <Lock size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      </div>
    );
  }

  // ПАНЕЛЬ ХОЗЯИНА
  if (currentUser?.isHost) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-6 md:p-10 flex flex-col gap-8 w-full max-w-[100vw] lg:max-w-7xl mx-auto">
        <Head><title>{t('adminPanel')} | {SITE_CONFIG.authorName}</title></Head>
        
        <div className="flex flex-wrap justify-between items-center bg-slate-900/80 backdrop-blur p-6 rounded-[2rem] border border-blue-500/30 shadow-2xl gap-4 w-full max-w-full">
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
                {masterAllChats.filter((c) => selectedClientSheets.includes(c.sheetName)).map((chat, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded-2xl">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 border-b border-white/10 pb-2">{t('chatHistory')}: {chat.clientName}</h3>
                    <div className="space-y-4">
                      {chat.messages.map((m, mIdx) => (
                        <div key={mIdx} className={`flex flex-col ${m.sender === currentUser.name || m.sender === 'Система' || m.sender === 'Администратор' ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-slate-500 mb-1">{m.sender} • {m.date}</span>
                          <div className={`p-3 max-w-[85%] rounded-xl text-sm ${m.sender === currentUser.name || m.sender === 'Администратор' ? 'bg-blue-600 text-white' : m.sender === 'Система' ? 'bg-slate-700 text-slate-300 italic whitespace-pre-wrap' : 'bg-slate-800 text-slate-200'}`}>{m[lang] || m.original}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <span className="text-xs text-slate-500 flex items-center mr-2"><FileText size={14} className="mr-1"/> {t('chatTemplatesLabel')}:</span>
                  <button onClick={() => insertTemplate(t('tplWelcome'))} className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 px-3 py-1.5 rounded-lg border border-white/5 transition-colors whitespace-nowrap">{t('tplWelcome')}</button>
                  <button onClick={() => insertTemplate(t('tplConfirmation'))} className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 px-3 py-1.5 rounded-lg border border-white/5 transition-colors whitespace-nowrap">{t('tplConfirmation')}</button>
                </div>
                <form onSubmit={handleMasterSend} className="flex gap-4 items-end">
                  <textarea value={masterChatInput} onChange={(e) => setMasterChatInput(e.target.value)} placeholder={t('messagePlaceholder')} className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500 min-h-[80px] resize-none" />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl text-white font-bold transition-colors h-[80px] flex items-center justify-center min-w-[80px]"><Send size={24} /></button>
                </form>
              </div>
            </div>

            {/* БОКОВАЯ ПАНЕЛЬ ЗАЯВКИ (Лента заявок гостя) */}
            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white mb-2">{t('bookingRequestPanel')}</h2>
              {activeRequestsList.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
                  {activeRequestsList.map((req, idx) => (
                    <div key={idx} className="text-sm text-slate-300 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                      <p className="font-bold text-lg text-white mb-2">{activeChat?.clientName}</p>
                      <div className="space-y-2 border-t border-white/5 pt-2">
                         <p className="text-slate-400">📅 {req.checkIn} – {req.checkOut} ({req.nights} {t('daysAbbr')})</p>
                         <p className="text-slate-400">👥 {t('adults')}: {req.adults}, {t('children')}: {req.children}</p>
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
          <div className="flex flex-col gap-8 w-full mx-auto">
            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-4 md:p-10 w-full overflow-hidden shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3"><CalendarIcon className="text-blue-500"/> {t('calendarTitle')}</h2>
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="relative w-full overflow-hidden flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-slate-500 block mb-3 pl-2">{t('selectDatesLabel')}</label>
                  
                  <div className="flex justify-between items-center mb-4 md:mb-6 bg-slate-800/50 p-2 md:p-4 rounded-2xl border border-white/5 shadow-inner">
                      <button onClick={() => setHostCurrentMonth(addMonths(hostCurrentMonth || new Date(), -1))} className="p-2 md:p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white transition-all shadow-md"><ChevronLeft size={24}/></button>
                      <span className="text-white font-bold text-lg md:text-2xl capitalize tracking-wide">
                        <DatePicker locale={lang === 'en' ? enUS : (lang === 'tr' ? tr : ru)} selected={hostCurrentMonth || new Date()} onChange={(date) => setHostCurrentMonth(date)} dateFormat="LLLL yyyy" showMonthYearPicker customInput={<span className="cursor-pointer">{format(hostCurrentMonth || new Date(), 'LLLL yyyy')}</span>} />
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
                <div className="md:col-span-2 mt-4">
                  <button type="submit" disabled={!currentUser.permissions?.periods && !currentUser.permissions?.bookingWindow && !currentUser.permissions?.finance} className="w-full bg-slate-700 hover:bg-slate-600 py-5 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {t('saveGlobalBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {offerModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setOfferModal(false)}></div>
            <div className="relative bg-slate-900 border border-white/10 w-full max-w-sm p-8 rounded-[2rem] shadow-2xl flex flex-col gap-4">
              <h3 className="text-xl font-bold text-white">{t('specialOfferBtn')}</h3>
              <div><label className="text-xs text-slate-400 block mb-1">Заезд</label><input value={offerData.checkIn} onChange={e => setOfferData({...offerData, checkIn: e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl text-white" /></div>
              <div><label className="text-xs text-slate-400 block mb-1">Выезд</label><input value={offerData.checkOut} onChange={e => setOfferData({...offerData, checkOut: e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl text-white" /></div>
              <div><label className="text-xs text-slate-400 block mb-1">{t('offerPrice')} ({CURRENCY_SYMBOLS[dynamicRules.currency]})</label><input type="number" value={offerData.price} onChange={e => setOfferData({...offerData, price: e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl text-white font-bold" /></div>
              <div className="flex gap-2 mt-4"><button onClick={() => setOfferModal(false)} className="flex-1 bg-slate-800 py-3 rounded-xl text-white">Отмена</button><button onClick={handleSpecialOffer} className="flex-1 bg-blue-600 py-3 rounded-xl text-white font-bold">{t('sendOfferBtn')}</button></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // КЛИЕНТСКАЯ ЧАСТЬ (Гость)
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500 relative w-full overflow-x-hidden">
      <Head><title>{t('heroTitle')} | {SITE_CONFIG.authorName}</title></Head>

      <div className="absolute top-6 left-4 md:left-6 z-50 flex gap-2">
        <button onClick={() => changeLanguage('ru')} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === 'ru' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>RU</button>
        <button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>EN</button>
        <button onClick={() => changeLanguage('tr')} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === 'tr' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>TR</button>
      </div>

      <div className="absolute top-6 right-4 md:right-6 z-50 flex flex-wrap justify-end gap-2 md:gap-4 max-w-[calc(100vw-2rem)]">
        {currentUser ? (
          <div className="flex items-center gap-2 md:gap-4 bg-slate-900/90 backdrop-blur border border-white/10 px-3 md:px-6 py-2 rounded-full shadow-2xl">
            <span className="flex items-center gap-2 text-xs md:text-sm text-slate-300 font-medium">
              <User size={16} className="text-blue-400 hidden sm:block"/>
              <span className="hidden sm:inline">{currentUser.name}</span>
            </span>
            <button onClick={handleLogout} className="text-xs md:text-sm bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full transition-all uppercase tracking-widest font-bold shadow-lg shadow-red-900/50 whitespace-nowrap">{t('logout')}</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setAuthMode('login')} className="bg-slate-900/80 backdrop-blur border border-white/10 px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all">{t('login')}</button>
            <button onClick={() => setAuthMode('register')} className="bg-blue-600 px-6 py-2 rounded-full text-sm font-bold text-white hover:bg-blue-500 transition-all">{t('register')}</button>
          </div>
        )}
      </div>

      <header className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${SITE_CONFIG.heroImage})` }}>
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]"></div>
        <div className="relative z-10 px-6 w-full mt-10">
          <h1 className="text-5xl md:text-8xl font-extralight text-white mb-6 tracking-tighter break-words">{t('heroTitle')}</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-10 font-light">{t('heroSubtitle')}</p>
          <a href="#courses" className="bg-white text-slate-950 px-10 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-all">{t('coursesTitle')}</a>
        </div>
      </header>

      <div className="flex-1">
        <section className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-light text-white mb-6">{t('aboutAuthor')}</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">{t('aboutText')}</p>
            <button onClick={() => setDescModal(true)} className="flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors group">
              {t('viewDetails')} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
          <div className="bg-white/5 rounded-[3rem] p-8 border border-white/10 hidden md:block">
              <div className="space-y-4">
                  {fullDescription.sections.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex gap-3"><Check className="text-blue-500 shrink-0" size={20}/><span className="text-slate-300 text-sm"><b>{s.title}:</b> {s.text.substring(0, 70)}...</span></div>
                  ))}
              </div>
          </div>
        </section>

        <section id="courses" className="py-24 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-light text-white mb-12 tracking-tight">{t('coursesTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <div key={course.id} className="bg-slate-800/50 rounded-3xl p-6 text-left flex flex-col">
                  <img src={course.image} alt={course.name} className="w-full h-60 object-cover rounded-2xl mb-4"/>
                  <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                  <p className="text-slate-400 text-sm flex-grow">{course.short_desc}</p>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-400">{course.price} {CURRENCY_SYMBOLS[course.currency]}</span>
                    <button onClick={(e) => handleBuy(e, course, 'Course')} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-500 transition-all">{t('buyNow')}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="py-24">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-light text-white mb-12 tracking-tight">{t('productsTitle')}</h2>
            {/* Product cards will be here */}
            <p className="text-slate-400">{t('noProducts')}</p>
          </div>
        </section>


        <section id="book" className="py-24 max-w-4xl mx-auto px-6 flex flex-col gap-12 overflow-hidden">
          <div className="bg-white/5 p-6 md:p-16 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl w-full box-border">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-white mb-4 tracking-tight">{t('bookingTitle')}</h2>
              <div className="flex justify-center gap-6 text-sm text-slate-400">
              </div>
            </div>

            <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full">
              {!currentUser && (
                <>
                  <div className="space-y-2"><label className="text-xs uppercase tracking-widest text-slate-500 ml-2">{t('name')}</label><input name="name" required placeholder="Ivan Ivanov" className="w-full bg-slate-800/50 border border-slate-700 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all text-base box-border" /></div>
                  <div className="space-y-2"><label className="text-xs uppercase tracking-widest text-slate-500 ml-2">{t('contact')}</label><input name="contact" required placeholder="@tg / +90..." className="w-full bg-slate-800/50 border border-slate-700 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all text-base box-border" /></div>
                </>
              )}

              <div className={`space-y-2 ${!currentUser ? 'md:col-span-2' : ''} w-full`}>
                <label className="text-xs uppercase tracking-widest text-slate-500 ml-2">{t('dates')}</label>
                <div className="relative calendar-wrapper w-full">
                  <DatePicker
                    locale={lang === 'en' ? enUS : (lang === 'tr' ? tr : ru)}
                    selectsRange={true} startDate={startDate} endDate={endDate} onChange={handleDateChange}
                    minDate={startDate || safeMinDate} maxDate={safeMaxDate} filterDate={isDateAvailable} 
                    monthsShown={2} dateFormat="dd.MM.yyyy" isClearable={true} 
                    placeholderText="..." popperPlacement="bottom-start"
                    className="w-full bg-slate-800/50 border border-slate-700 p-5 rounded-2xl text-white outline-none font-bold text-xl uppercase cursor-pointer box-border"
                    renderDayContents={(day, date) => {
                      const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                      const isOccupied = isOccupiedDate(checkDate);
                      const currentMinNights = getMinNightsForDate(startDate || checkDate);
                      let tooltipText = "";

                      if (startDate && !endDate) {
                        const sDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                        const daysDiff = differenceInDays(checkDate, sDate);

                        if (checkDate < sDate) { 
                            tooltipText = `${t('checkIn')} ${t('tooltipReset')}`; 
                        } else if (daysDiff > 0) {
                            if (daysDiff < currentMinNights) { 
                                tooltipText = `⚠️ ${t('tooltipSelected')} ${daysDiff} (${t('tooltipMin')} ${currentMinNights})`;
                            } else if (daysDiff > dynamicRules.maxNights) { 
                                tooltipText = `⚠️ ${t('tooltipMax')} ${dynamicRules.maxNights}`; 
                            } else {
                                let hasJump = false;
                                let cur = new Date(sDate);
                                while(cur < checkDate) {
                                    if(isOccupiedDate(cur) && cur.getTime() !== sDate.getTime()) { hasJump = true; break; }
                                    cur.setDate(cur.getDate() + 1);
                                }
                                if (hasJump) {
                                    tooltipText = `⛔ ${t('tooltipCross')}`;
                                } else {
                                    tooltipText = `✅ ${t('checkOut')} (${daysDiff} ${t('daysLabel')})`;
                                }
                            }
                        } else { 
                            tooltipText = t('checkIn'); 
                        }
                      } else {
                        if (isOccupied) {
                            const prevDay = addDays(checkDate, -1);
                            if (!isOccupiedDate(prevDay)) {
                                tooltipText = `🔚 ${t('tooltipCheckoutOnly')}`;
                            } else {
                                tooltipText = `⛔ ${t('tooltipOccupied')}`;
                            }
                        } else {
                            tooltipText = `✅ ${t('tooltipAvailable')} (${t('tooltipMin')} ${currentMinNights})`;
                        }
                      }
                      
                      return <div title={tooltipText} className="w-full h-full flex items-center justify-center">{day}</div>;
                    }}
                  >
                  </DatePicker>
                  <CalendarIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={24}/>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-xs uppercase tracking-widest text-slate-500 ml-2">{t('adults')}</label>
                <select value={adults} onChange={(e) => setAdults(parseInt(e.target.value))} className="w-full bg-slate-800/50 border border-slate-700 p-5 rounded-2xl text-white outline-none text-base box-border">
                  {[...Array(SITE_CONFIG.maxTotalGuests + 1).keys()].slice(1).map(n => (<option key={n} value={n} disabled={n + children > SITE_CONFIG.maxTotalGuests}>{n}</option>))}
                </select>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-xs uppercase tracking-widest text-slate-500 ml-2">{t('children')}</label>
                <select value={children} onChange={(e) => setChildren(parseInt(e.target.value))} className="w-full bg-slate-800/50 border border-slate-700 p-5 rounded-2xl text-white outline-none text-base box-border">
                  {[...Array(SITE_CONFIG.maxTotalGuests).keys()].map((n) => (<option key={n} value={n} disabled={n + adults > SITE_CONFIG.maxTotalGuests}>{n}</option>))}
                </select>
              </div>

              {startDate && endDate && (
                <div className="md:col-span-2 mt-4 bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow-inner">
                   <span className="text-lg text-slate-300 font-bold mb-2 md:mb-0 uppercase tracking-widest">{t('totalPrice')}</span>
                   <span className="text-4xl font-extrabold text-green-400 drop-shadow-md">{calculateTotalPrice()} {CURRENCY_SYMBOLS[dynamicRules.currency]}</span>
                </div>
              )}

              {isShortStay && (
                  <div className="md:col-span-2 mt-4 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-2xl shadow-inner">
                     <p className="text-yellow-400 text-sm font-bold">{t('shortStayWarning').replace('{n}', nightsCount).replace('{min}', currentMinNights)}</p>
                     <button type="button" onClick={() => setDateRange([null, null])} className="text-blue-400 text-sm mt-3 underline font-bold hover:text-blue-300 transition-colors">{t('cancelSelection')}</button>
                  </div>
              )}

              <div className="md:col-span-2 mt-4 space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={agreedKVKK} onChange={(e) => setAgreedKVKK(e.target.checked)} className="mt-1 w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                    {t('legalKVKK')} <Link href={`/legal/kvkk`} target="_blank" className="text-blue-400 underline hover:text-blue-300 ml-1">{t('linkKVKK')}</Link>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={agreedContract} onChange={(e) => setAgreedContract(e.target.checked)} className="mt-1 w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                    {t('legalContract')} <Link href={`/legal/contract`} target="_blank" className="text-blue-400 underline hover:text-blue-300 mx-1">{t('linkContract')}</Link>
                  </span>
                </label>
              </div>

              <div className="md:col-span-2 mt-2 w-full">
                <button type="submit" disabled={status === 'loading' || !agreedKVKK || !agreedContract} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed py-6 rounded-2xl font-bold text-2xl text-white shadow-xl transition-all active:scale-[0.98] box-border">
                  {status === 'loading' ? t('loading') : (effectiveBookingMode === 'manual' ? t('sendRequestBtn') : t('payBtn'))}
                </button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs uppercase tracking-widest text-slate-500">
              <div className="flex flex-col gap-2"><span className="text-slate-400 font-bold ml-2">{t('minNights')}</span><span className="text-white ml-2">{dynamicRules.minNights}</span></div>
              <div className="flex flex-col gap-2"><span className="text-slate-400 font-bold ml-2">{t('bookingWindow')}</span><span className="text-white ml-2">{dynamicRules.bookingWindowMonths} {t('monthsAbbr')}</span></div>
              <div className="flex flex-col gap-2"><span className="text-slate-400 font-bold ml-2">{t('advanceNotice')}</span><span className="text-white ml-2">{getNoticeText(dynamicRules.advanceNoticeDays)}</span></div>
              <div className="flex flex-col gap-2"><span className="text-slate-400 font-bold ml-2">{t('maxGuests')}</span><span className="text-white ml-2">{SITE_CONFIG.maxTotalGuests}</span></div>
            </div>
          </div>
        </section>
      </div>
      <footer className="w-full mt-20 pt-16 pb-12 px-6 border-t border-white/10 bg-slate-950 text-slate-400 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h4 className="text-white font-bold text-lg mb-2">{t('legalInfo')}</h4>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4">
              <Link href="/legal/contract" className="hover:text-blue-400 transition-colors">{t('linkContract')}</Link>
              <span className="hidden md:inline text-slate-700">|</span>
              <Link href="/legal/kvkk" className="hover:text-blue-400 transition-colors">{t('linkKVKK')}</Link>
              <span className="hidden md:inline text-slate-700">|</span>
              <Link href="/legal/privacy" className="hover:text-blue-400 transition-colors">{t('linkPrivacy')}</Link>
              <span className="hidden md:inline text-slate-700">|</span>
              <Link href="/legal/cancellation" className="hover:text-blue-400 transition-colors">{t('linkCancellation')}</Link>
            </div>
            <div className="space-y-1 text-xs md:text-sm">
              <p><strong className="text-slate-300">Ticari Ünvan:</strong> VASILISA ZNAMENSKII</p>
              <p><strong className="text-slate-300">Vergi Dairesi ve No:</strong> [УКАЖИТЕ ДАННЫЕ]</p>
              <p><strong className="text-slate-300">Adres:</strong> [УКАЖИТЕ АДРЕС]</p>
              <p><strong className="text-slate-300">İletişim:</strong> znamenskiialeksei@gmail.com</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="border border-dashed border-slate-700 p-6 rounded-2xl flex flex-col items-center justify-center text-xs w-48 h-48 bg-white/5 relative overflow-hidden">
               <span className="text-slate-500 text-center mb-2 whitespace-pre-wrap">{t('etbisPlaceholder')}</span>
            </div>
            <span className="text-xs text-slate-500">{t('etbisText')}</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/5 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Vasilisa Znamenskii.
        </div>
      </footer>

      {/* ЧАТ ГОСТЯ (С ТАЙМЕРОМ ОПЛАТЫ И УДЕРЖАНИЕМ) */}
      {currentUser && !currentUser.isHost && currentUser.hasChat && !currentUser.blockChat && (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end">
          <div className="bg-slate-900 border border-white/10 shadow-2xl w-[90vw] md:w-[400px] h-[500px] rounded-3xl flex flex-col overflow-hidden mb-4 relative">
             <div className="bg-slate-800 p-4 border-b border-white/10 flex justify-between items-center">
                 <span className="text-white font-bold flex items-center gap-2"><MessageCircle size={18}/> {t('chatHeader')}</span>
             </div>
             
             <div className="flex-shrink-0 max-h-[150px] overflow-y-auto w-full">
             {guestActiveRequests.map((req, idx) => {
               const timer = timeLefter[req.rowIndex];
               if ((req.status !== 'ОЖИДАЕТ ОПЛАТЫ' && req.status !== 'СПЕЦПРЕДЛОЖЕНИЕ')) return null;
               if (timer === 'EXPIRED') {
                 return (
                    <div key={idx} className="bg-red-900/80 p-3 flex flex-col gap-1 shadow-md border-b border-white/10">
                      <span className="text-white font-bold text-xs">{t('offerExpired')} ({req.checkIn})</span>
                    </div>
                 );
               }
               return (
                 <div key={idx} className="bg-blue-600 p-3 flex flex-col gap-1 shadow-md border-b border-white/10">
                   <span className="text-white font-bold text-xs">
                      {req.status === 'ОЖИДАЕТ ОПЛАТЫ' ? t('requestApproved') : t('specialOfferBtn')}
                   </span>
                   <span className="text-blue-200 text-[10px]">{t('dates')}: {req.checkIn} - {req.checkOut}</span>
                   {timer && (
                      <span className="text-yellow-300 text-[10px] font-bold">{t('payUntil')} {timer}</span>
                   )}
                   <button onClick={() => handleGuestPayRequest(req)} className="bg-white text-blue-600 font-bold py-1.5 mt-1 rounded-lg w-full text-xs">{t('payRequestBtn')} ({req.price})</button>
                 </div>
               );
             })}
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-500 mb-1">{msg.sender} • {msg.date}</span>
                    <div className={`p-3 max-w-[85%] rounded-2xl text-sm whitespace-pre-wrap break-words ${msg.sender === currentUser.name ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                      {msg[lang] || msg.original}
                      {msg.file && msg.file !== '' && (<div className="mt-2 text-xs font-bold text-blue-200 bg-black/20 p-2 rounded-lg w-fit break-words"><Paperclip size={14} className="inline mr-1"/> {msg.file}</div>)}
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
             </div>
             <form onSubmit={handleSendMessage} className="p-3 bg-slate-800 border-t border-white/10 flex flex-col gap-2">
                 {chatFile && (<div className="flex justify-between bg-slate-900 p-2 rounded-xl border border-white/10 text-xs"><span className="truncate pr-2 text-slate-300">{chatFile.name}</span><button type="button" onClick={() => setChatFile(null)} className="text-red-400"><X size={14}/></button></div>)}
                 <div className="flex gap-2">
                   <label className="cursor-pointer bg-slate-900 hover:bg-slate-700 p-3 rounded-xl flex justify-center text-slate-300 shrink-0"><Paperclip size={20} /><input type="file" className="hidden" onChange={handleFileAttach} /></label>
                   <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={t('messagePlaceholder')} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-white outline-none focus:border-blue-500 min-w-0" />
                   <button disabled={chatLoading} type="submit" className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl text-white flex justify-center min-w-[50px] shrink-0"><Send size={20} /></button>
                 </div>
             </form>
          </div>
        </div>
      )}

      {(!currentUser || (!currentUser.hasChat && !currentUser.isHost)) && (
        <a href={`<https://t.me/${SITE_CONFIG.telegramContact}>`} target="_blank" rel="noreferrer" className="fixed bottom-10 right-10 bg-[#24A1DE] p-6 rounded-full shadow-2xl transition-all hover:scale-110 z-[60] text-white">
          <MessageCircle size={32} />
        </a>
      )}

      {/* Модальное Окно Авторизации Владельца и Клиента */}
      {authMode !== 'none' && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setAuthMode('none')}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[90vh] box-border">
            <button onClick={() => setAuthMode('none')} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24}/></button>
            <h2 className="text-2xl font-bold text-white mb-8">{authMode === 'register' ? t('register') : t('login')}</h2>
            <form onSubmit={(e) => handleAuthSubmit(e, null, null, authMode)} className="space-y-6 w-full">
              {authMode === 'register' && (<div className="w-full"><label className="text-xs uppercase tracking-widest text-slate-500 block mb-2">{t('name')}</label><input name="name" required className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-base text-white outline-none focus:border-blue-500" /></div>)}
              <div className="w-full"><label className="text-xs uppercase tracking-widest text-slate-500 block mb-2">{t('contact')}</label><input name="contact" required className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-base text-white outline-none focus:border-blue-500" /></div>
              <div className="w-full"><label className="text-xs uppercase tracking-widest text-slate-500 block mb-2">{t('passwordLabel')}</label><input name="password" type="password" required className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-base text-white outline-none focus:border-blue-500" /></div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white text-lg">{authMode === 'register' ? t('register') : t('login')}</button>
            </form>
          </div>
        </div>
      )}

      {/* Модальное Окно 2FA Авторизации Владельца */}
      {pendingHostUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setPendingHostUser(null)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-2xl text-center box-border">
            <button onClick={() => setPendingHostUser(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24}/></button>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">ЗАЩИТА ПАНЕЛИ</h2>
            <p className="text-xs text-slate-400 mb-6">Двухфакторная верификация владельца</p>
            
            {!twoFaSecret ? (
               <div className="bg-red-900/50 text-red-300 p-4 rounded-xl text-xs mb-4 border border-red-500/30">
                  Ключ NEXT_PUBLIC_ADMIN_2FA_SECRET не настроен в Vercel.
               </div>
            ) : (
              qrCodeUrl && (
                <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-inner">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                  <p className="text-[10px] text-slate-800 font-mono mt-1 select-all">Ключ: {twoFaSecret}</p>
                </div>
              )
            )}
            
            <form onSubmit={handleVerify2FA} className="space-y-4 w-full">
              <div>
                <label className="block text-left text-xs uppercase tracking-widest text-slate-500 mb-2">Код из Google Authenticator</label>
                <input type="text" maxLength={6} value={twoFaInput} onChange={(e) => setTwoFaInput(e.target.value)} placeholder="000000" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-xl tracking-widest text-center text-white outline-none focus:border-blue-500 font-mono" required disabled={!twoFaSecret} />
              </div>
              {twoFaError && <p className="text-red-500 text-xs font-semibold">{twoFaError}</p>}
              <button type="submit" disabled={!twoFaSecret} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white text-sm tracking-wider shadow-lg disabled:opacity-50">ВЕРИФИЦИРОВАТЬ</button>
            </form>
          </div>
        </div>
      )}

      {/* Модальное Окно Описания */}
      {descModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setDescModal(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-[3rem] p-10 md:p-16 shadow-2xl">
            <button onClick={() => setDescModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={32}/></button>
            <h2 className="text-4xl font-light text-white mb-10 tracking-tight">{t('aboutAuthor')}</h2>
            <div className="space-y-12">
              {fullDescription.sections.map((s, i) => (
                <div key={i} className="border-l-2 border-blue-500 pl-8">
                  <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .react-datepicker { background-color: #1e293b !important; border: 1px solid #334155 !important; border-radius: 1.5rem !important; font-family: inherit !important; overflow: hidden !important; }
        @media (max-width: 640px) { .react-datepicker__month-container { width: 100% !important; float: none !important; } }
        .react-datepicker__header { background-color: #1e293b !important; border-bottom: 1px solid #334155 !important; border-radius: 1.5rem 1.5rem 0 0 !important; }
        .react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day { color: #e2e8f0 !important; }
        .react-datepicker__day:hover { background-color: #334155 !important; border-radius: 0.5rem !important; }
        .react-datepicker__day--in-range { background-color: #2563eb !important; color: white !important; }
        .react-datepicker__day--selected, .react-datepicker__day--range-start, .react-datepicker__day--range-end { background-color: #3b82f6 !important; border-radius: 0.5rem !important; }
        .react-datepicker__day--disabled { color: #475569 !important; text-decoration: line-through; opacity: 0.5; cursor: not-allowed !important; }
      `}</style>
    </div>
  );
}
