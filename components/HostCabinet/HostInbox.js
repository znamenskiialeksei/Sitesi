// ==============================================================================
// ЦЕНТР СООБЩЕНИЙ И CRM ХОЗЯИНА: HOST INBOX & CRM
// Файл: components/HostCabinet/HostInbox.js
// Назначение: Сплит-мессенджер, массовые рассылки с плейсхолдерами,
// 14 динамических смарт-шаблонов из Google Таблиц с офлайн-кэшированием,
// многострочный редактор textarea без урезания текста и ИИ-суфлер Gemini Copilot.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Send,
  Users,
  User,
  Search,
  Sparkles,
  MessageSquare,
  PlayCircle,
  CheckSquare,
  Square,
  CheckCircle,
  XCircle,
  RotateCcw,
  Gift,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Database,
  Wifi,
  WifiOff,
  CornerDownLeft,
  Bot,
  ArrowLeft,
  Info,
  Clock
} from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';
import BusinessAssistantModal from '../Modals/BusinessAssistantModal';
import { SMART_TEMPLATES, TEMPLATE_STAGES } from '../../utils/templatesData';
import { detectGuestLanguage, resolveTemplate } from '../../utils/templateResolver';

export default function HostInbox({
  chats = [],
  lmsModules = [],
  initialSelectedSheet = null,
  onSelectChat,
  onSendMessage,
  onBroadcast,
  onApprove,
  onSpecialOffer,
  onReject,
  onRevoke,
  onRefreshChats,
  loading = false
}) {
  const { t, lang } = useLanguage();
  const toast = useToast();

  const [selectedSheet, setSelectedSheet] = useState(() => {
    if (initialSelectedSheet) return initialSelectedSheet;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('villa_host_selected_sheet');
        if (saved) return saved;
      } catch (storageErr) {}
    }
    return chats[0]?.sheetName || null;
  });
  const [selectedMultiSheets, setSelectedMultiSheets] = useState([]);
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('all'); // 'all' | 'requests' | 'paid' | 'registered' | 'unregistered' | 'pending'
  const [activeSortOrder, setActiveSortOrder] = useState('recent'); // 'recent' | 'urgent' | 'amount' | 'name'

  // Многострочное поле ввода: текст никогда не обрезается
  const [messageInput, setMessageInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  // Сворачиваемая правая боковая панель с вкладками Деталей и Умных шаблонов
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState('details'); // 'details' | 'templates'
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  // Мобильный режим отображения: список диалогов, активный чат или детали бронирования
  const [mobileActiveView, setMobileActiveView] = useState('list'); // 'list' | 'chat' | 'details'

  // Вычисление активного диалога с защитой от сброса на chats[0]
  const activeChat = useMemo(() => {
    if (!Array.isArray(chats) || chats.length === 0) return null;
    if (selectedSheet) {
      const found = chats.find((c) => c.sheetName === selectedSheet);
      if (found) return found;
    }
    let saved = null;
    if (typeof window !== 'undefined') {
      try {
        saved = localStorage.getItem('villa_host_selected_sheet');
      } catch (storageErr) {}
    }
    if (saved) {
      const foundSaved = chats.find((c) => c.sheetName === saved);
      if (foundSaved) return foundSaved;
    }
    return chats[0] || null;
  }, [chats, selectedSheet]);

  const chatBottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const userScrolledUpRef = useRef(false);
  const isHostSendingRef = useRef(false);
  const prevMsgCountRef = useRef(0);

  // Синхронизация и удержание выбранного диалога при загрузке или обновлении
  useEffect(() => {
    if (initialSelectedSheet) {
      setSelectedSheet(initialSelectedSheet);
      setMobileActiveView('chat');
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('villa_host_selected_sheet', initialSelectedSheet);
        } catch (storageErr) {}
      }
      return;
    }

    if (Array.isArray(chats) && chats.length > 0) {
      if (!selectedSheet) {
        let restored = null;
        if (typeof window !== 'undefined') {
          try {
            restored = localStorage.getItem('villa_host_selected_sheet');
          } catch (storageErr) {}
        }
        const exists = restored && chats.some((c) => c.sheetName === restored);
        const target = exists ? restored : chats[0]?.sheetName;
        if (target) {
          setSelectedSheet(target);
          if (onSelectChat) onSelectChat(target);
        }
      } else {
        const exists = chats.some((c) => c.sheetName === selectedSheet);
        if (!exists) {
          let saved = null;
          if (typeof window !== 'undefined') {
            try {
              saved = localStorage.getItem('villa_host_selected_sheet');
            } catch (storageErr) {}
          }
          if (saved && chats.some((c) => c.sheetName === saved)) {
            setSelectedSheet(saved);
          }
        }
      }
    }
  }, [initialSelectedSheet, chats]);

  // Динамические шаблоны и база знаний из Google Таблиц с офлайн-памятью
  const [liveTemplates, setLiveTemplates] = useState(SMART_TEMPLATES);
  const [knowledgeVariables, setKnowledgeVariables] = useState({});
  const [isKnowledgeFromCache, setIsKnowledgeFromCache] = useState(false);
  const [isSyncingKnowledge, setIsSyncingKnowledge] = useState(false);

  // Управление умными шаблонами
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isQuickTemplatesOpen, setIsQuickTemplatesOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState('all');
  const [templateLang, setTemplateLang] = useState('ru');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [inboxCountdown, setInboxCountdown] = useState({});
  const [pricingCorridor, setPricingCorridor] = useState(null);

  // Классификация стадии гостя по 5 этапам жизненного цикла
  const guestStageInfo = useMemo(() => {
    const curReq = activeChat?.activeRequests?.[0] || {};
    const status = (curReq.status || '').toUpperCase();
    const now = new Date();

    let isPastCheckOut = false;
    let isInHouse = false;

    if (curReq.checkIn && curReq.checkOut) {
      try {
        const [dIn, mIn, yIn] = curReq.checkIn.split('.').map(Number);
        const [dOut, mOut, yOut] = curReq.checkOut.split('.').map(Number);
        const inDate = new Date(yIn, mIn - 1, dIn, 16, 0);
        const outDate = new Date(yOut, mOut - 1, dOut, 10, 0);
        if (now > outDate) isPastCheckOut = true;
        else if (now >= inDate && now <= outDate) isInHouse = true;
      } catch (e) {
        // Игнорируем несовпадение формата даты
      }
    }

    if (isPastCheckOut) {
      return { id: 'STAGE_5_CHECKED_OUT', label: 'Выезд [Этап 5]', badge: 'bg-purple-950/70 border-purple-500/40 text-purple-300' };
    }
    if (isInHouse) {
      return { id: 'STAGE_4_IN_HOUSE', label: 'Проживание [Этап 4]', badge: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' };
    }
    if (status.includes('ОПЛАЧЕНО') || status.includes('ПОДТВЕРЖДЕНО')) {
      return { id: 'STAGE_3_BOOKED_PRE_ARRIVAL', label: 'Бронь подтверждена [Этап 3]', badge: 'bg-blue-950/70 border-blue-500/40 text-blue-300' };
    }
    if (status.includes('ОЖИДАЕТ') || status.includes('СПЕЦПРЕДЛОЖЕНИЕ') || status.includes('HOLD')) {
      return { id: 'STAGE_2_HOLD_PENDING', label: 'Ожидает оплаты [Этап 2]', badge: 'bg-amber-950/70 border-amber-500/40 text-amber-300' };
    }
    return { id: 'STAGE_1_LEAD', label: 'Лид [Этап 1]', badge: 'bg-slate-800 border-white/10 text-slate-300' };
  }, [activeChat]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!activeChat?.activeRequests) return;
      const newTimes = {};
      activeChat.activeRequests.forEach((req) => {
        if (req.expiresAt) {
          const diff = new Date(req.expiresAt).getTime() - Date.now();
          if (diff <= 0) {
            newTimes[req.rowIndex] = 'EXPIRED';
          } else {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            newTimes[req.rowIndex] = `${h}ч ${m}м ${s}с`;
          }
        }
      });
      setInboxCountdown(newTimes);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeChat]);

  // Загрузка базы знаний и 14 шаблонов из Google Sheets с локальной офлайн-памятью
  const loadKnowledgeBase = async (forceRefresh = false) => {
    setIsSyncingKnowledge(true);
    try {
      // 1. Проверяем локальную офлайн-память на случай обрыва связи
      if (!forceRefresh && typeof window !== 'undefined') {
        try {
          const cachedTmpl = localStorage.getItem('villa_ai_templates_cache');
          const cachedVars = localStorage.getItem('villa_ai_variables_cache');
          const cachedCorridor = localStorage.getItem('villa_pricing_corridor_cache');
          if (cachedTmpl) {
            const parsed = JSON.parse(cachedTmpl);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setLiveTemplates(parsed);
              setIsKnowledgeFromCache(true);
            }
          }
          if (cachedVars) {
            setKnowledgeVariables(JSON.parse(cachedVars));
          }
          if (cachedCorridor) {
            setPricingCorridor(JSON.parse(cachedCorridor));
          }
        } catch (storageErr) {
          console.warn('[HostInbox] Предупреждение чтения localStorage:', storageErr.message);
        }
      }

      // 2. Запрос живых данных из Google Таблиц через API
      const url = forceRefresh ? '/api/ai/knowledge?force=true' : '/api/ai/knowledge';
      const res = await axios.get(url);

      if (res.data?.success && res.data?.data) {
        const { templates, variables, pricingAnalysis } = res.data.data;
        if (Array.isArray(templates) && templates.length > 0) {
          setLiveTemplates(templates);
          if (typeof window !== 'undefined') {
            localStorage.setItem('villa_ai_templates_cache', JSON.stringify(templates));
          }
        }
        if (variables && typeof variables === 'object') {
          setKnowledgeVariables(variables);
          if (typeof window !== 'undefined') {
            localStorage.setItem('villa_ai_variables_cache', JSON.stringify(variables));
          }
        }
        if (pricingAnalysis && typeof pricingAnalysis === 'object') {
          setPricingCorridor(pricingAnalysis);
          if (typeof window !== 'undefined') {
            localStorage.setItem('villa_pricing_corridor_cache', JSON.stringify(pricingAnalysis));
          }
        }
        setIsKnowledgeFromCache(false);
        if (forceRefresh) {
          toast.success(`База знаний и ${templates.length} шаблонов успешно обновлены из Google Таблиц!`);
        }
      }
    } catch (err) {
      console.warn('[HostInbox] Связь с Google Таблицей временно недоступна, активна офлайн-память:', err.message);
      setIsKnowledgeFromCache(true);
      if (forceRefresh) {
        toast.warn('Связь с Google Таблицей прервана: активирована резервная память браузера');
      }
    } finally {
      setIsSyncingKnowledge(false);
    }
  };

  useEffect(() => {
    loadKnowledgeBase(false);
  }, []);

  // Интеллектуальный скролл сообщений без дергания экрана:
  // Сохраняет позицию скролла там где ее оставил хозяин, автоскроллит вниз только при новых сообщениях
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const currentMsgCount = activeChat?.messages?.length || 0;
    const isNewMessage = currentMsgCount > prevMsgCountRef.current;
    prevMsgCountRef.current = currentMsgCount;

    // Если количество сообщений не изменилось и это не отправка хозяином, скролл не трогаем
    if (!isHostSendingRef.current && !isNewMessage) {
      return;
    }

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;

    if (isHostSendingRef.current || !userScrolledUpRef.current || isNearBottom) {
      container.scrollTop = container.scrollHeight;
      isHostSendingRef.current = false;
    }
  }, [activeChat?.messages]);

  // Отслеживание ручного скролла хозяином для блокировки нежелательного авто-скролла
  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 40;
    userScrolledUpRef.current = !isAtBottom;
  };

  // Интеллектуальная фильтрация и сортировка диалогов
  const filteredChats = useMemo(() => {
    let list = chats.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (c.clientName || '').toLowerCase().includes(q) ||
        (c.clientContact || '').toLowerCase().includes(q);
      if (!matchSearch) return false;

      const hasReq = (c.activeRequests && c.activeRequests.length > 0) || c.hasBooking;
      const curReq = c.activeRequests?.[0] || {};
      const status = (curReq.status || c.bookingStatus || '').toUpperCase();
      const isPaid = status.includes('ОПЛАЧЕНО') || status.includes('ПОДТВЕРЖДЕНО');
      const isPending = status.includes('ОЖИДАЕТ') || status.includes('HOLD') || status.includes('СПЕЦПРЕДЛОЖЕНИЕ') || status.includes('ЗАПРОС');
      const isReg = !!c.isRegistered;

      if (activeFilterTab === 'requests') return hasReq;
      if (activeFilterTab === 'paid') return isPaid;
      if (activeFilterTab === 'pending') return isPending;
      if (activeFilterTab === 'registered') return isReg;
      if (activeFilterTab === 'unregistered') return !isReg;
      return true;
    });

    // Сортировка
    return list.sort((a, b) => {
      if (activeSortOrder === 'recent') {
        const lastA = a.messages?.[a.messages.length - 1]?.date || '';
        const lastB = b.messages?.[b.messages.length - 1]?.date || '';
        return lastB.localeCompare(lastA);
      }
      if (activeSortOrder === 'urgent') {
        const hasPendingA = (a.activeRequests?.[0]?.status || a.bookingStatus || '').toUpperCase().includes('ОЖИДАЕТ') ? 1 : 0;
        const hasPendingB = (b.activeRequests?.[0]?.status || b.bookingStatus || '').toUpperCase().includes('ОЖИДАЕТ') ? 1 : 0;
        return hasPendingB - hasPendingA;
      }
      if (activeSortOrder === 'amount') {
        const priceA = parseFloat((a.activeRequests?.[0]?.price || a.bookingAmount || '0').toString().replace(/[^\d.]/g, '')) || 0;
        const priceB = parseFloat((b.activeRequests?.[0]?.price || b.bookingAmount || '0').toString().replace(/[^\d.]/g, '')) || 0;
        return priceB - priceA;
      }
      if (activeSortOrder === 'name') {
        return (a.clientName || '').localeCompare(b.clientName || '');
      }
      return 0;
    });
  }, [chats, searchQuery, activeFilterTab, activeSortOrder]);

  // Автоматическое определение языка гостя при смене активного чата
  useEffect(() => {
    if (activeChat?.messages && activeChat.messages.length > 0) {
      const detected = detectGuestLanguage(activeChat.messages);
      if (detected) setTemplateLang(detected);
    }
  }, [activeChat?.sheetName]);

  // Последнее сообщение гостя для анализа намерений ИИ-суфлером
  const lastGuestMsg = useMemo(() => {
    if (!activeChat?.messages || activeChat.messages.length === 0) return null;
    return [...activeChat.messages].reverse().find((m) => m.sender !== 'Владелец' && m.sender !== 'Система');
  }, [activeChat?.messages]);

  // Функция резолва шаблона под контекст текущего гостя с учетом живых переменных
  const getResolvedTemplateText = (template, targetLang = templateLang) => {
    if (!template) return '';
    const raw =
      template.content?.[targetLang] ||
      template.content?.ru ||
      template.text?.[targetLang] ||
      template.text?.ru ||
      '';
    const curReq = activeChat?.activeRequests?.[0] || {};
    return resolveTemplate(raw, {
      guestName: activeChat?.clientName,
      contact: activeChat?.clientContact,
      checkIn: curReq.checkIn,
      checkOut: curReq.checkOut,
      status: curReq.status,
      totalPrice: curReq.price,
      ...knowledgeVariables
    });
  };

  const handleApplyTemplate = (template, targetLang = templateLang) => {
    const resolved = getResolvedTemplateText(template, targetLang);
    setMessageInput(resolved);
    toast.success('Шаблон перенесен в поле ввода для редактирования');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleDirectSendTemplate = (template, targetLang = templateLang) => {
    const resolved = getResolvedTemplateText(template, targetLang);
    if (!activeChat || !resolved.trim()) return;
    onSendMessage(activeChat.sheetName, resolved.trim(), null);
    toast.success('Шаблон успешно отправлен гостю');
    setIsTemplatesOpen(false);
  };

  // Помощь ИИ-агента Gemini: интеллектуальная генерация проекта ответа в поле ввода
  const handleAskAiHelp = async () => {
    if (!activeChat) return;
    setIsAiLoading(true);
    try {
      const curReq = activeChat?.activeRequests?.[0] || {};
      const lastMsgText =
        lastGuestMsg?.original ||
        lastGuestMsg?.ru ||
        lastGuestMsg?.en ||
        lastGuestMsg?.tr ||
        messageInput ||
        '';
      const res = await axios.post('/api/ai-concierge', {
        guestMessage: lastMsgText,
        guestName: activeChat.clientName,
        contact: activeChat.clientContact,
        lang: templateLang,
        chatHistory: activeChat.messages || [],
        guestStage: guestStageInfo.id,
        bookingContext: {
          checkInDate: curReq.checkIn,
          checkOutDate: curReq.checkOut,
          price: curReq.price,
          status: curReq.status,
          contact: activeChat.clientContact,
          guestName: activeChat.clientName
        },
        context: {
          checkIn: curReq.checkIn,
          checkOut: curReq.checkOut,
          price: curReq.price,
          status: curReq.status
        }
      });
      if (res.data?.success && res.data.reply) {
        setMessageInput(res.data.reply);
        if (res.data.pricingCorridor && !pricingCorridor) {
          setPricingCorridor({ discountCorridor: res.data.pricingCorridor });
        }
        toast.success(`ИИ-Помощник [${res.data.model || 'Gemini'}]: ответ для ${guestStageInfo.label} подготовлен`);
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      } else {
        toast.warn(res.data?.error || 'ИИ не смог сгенерировать ответ. Проверьте GEMINI_API_KEY на Vercel');
      }
    } catch (err) {
      toast.error(`Ошибка ИИ: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Фильтрация шаблонов по выбранному этапу
  const displayedTemplates = useMemo(() => {
    const tmpls = liveTemplates.length > 0 ? liveTemplates : SMART_TEMPLATES;
    if (selectedStage === 'all') return tmpls;
    return tmpls.filter((tmpl) => tmpl.stageId === selectedStage);
  }, [liveTemplates, selectedStage]);

  const handleSendLessonLink = (lesson) => {
    if (!lesson) return;
    const lessonTitle = lesson.name?.[lang] || lesson.name?.ru || lesson.name || t('guideTypeLabel');
    const msg = t('guideAccessGrantedMsg')
      .replace('{title}', lessonTitle)
      .replace('{module}', lesson.module || '')
      .replace('{link}', lesson.privateLink);
    setMessageInput(msg);
  };

  const handleSend = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!messageInput.trim() && !attachedFile) return;

    if (isBroadcastMode) {
      if (selectedMultiSheets.length === 0) {
        toast.warn(t('selectAtLeastOneRecipient'));
        return;
      }
      onBroadcast(selectedMultiSheets, messageInput.trim());
      toast.success(t('broadcastSentSuccess').replace('{count}', selectedMultiSheets.length));
      setMessageInput('');
      setIsBroadcastMode(false);
    } else {
      if (!activeChat) return;
      isHostSendingRef.current = true;
      onSendMessage(activeChat.sheetName, messageInput.trim(), attachedFile);
      setMessageInput('');
      setAttachedFile(null);
    }
  };

  // Обработка нажатия клавиш в поле ввода textarea: Enter отправляет, Shift+Enter переносит строку
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const toggleSelectMulti = (sheetName) => {
    setSelectedMultiSheets((prev) =>
      prev.includes(sheetName) ? prev.filter((s) => s !== sheetName) : [...prev, sheetName]
    );
  };

  const selectAllChats = () => {
    if (selectedMultiSheets.length === chats.length) setSelectedMultiSheets([]);
    else setSelectedMultiSheets(chats.map((c) => c.sheetName));
  };

  const [formattingChats, setFormattingChats] = useState(false);

  const handleFormatChats = async () => {
    setFormattingChats(true);
    try {
      const res = await axios.post('/api/booking', { action: 'format_chat_sheets' });
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Таблица чатов успешно отформатирована');
        if (onRefreshChats) onRefreshChats();
      } else {
        toast.error(res.data?.error || 'Ошибка форматирования таблицы чатов');
      }
    } catch (err) {
      toast.error('Ошибка связи с сервером');
    } finally {
      setFormattingChats(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-[calc(100vh-140px)] min-h-[660px] max-h-[940px] flex flex-col fade-in">

      {/* Верхняя панель управления инбоксом */}
      <div className="p-3 sm:p-4 bg-slate-800/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <MessageSquare className="w-5 h-5 text-rose-500 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-white">{t('guestMessageCenter')}</h3>
          <span className="text-[11px] sm:text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-white/5">
            {t('dialogsCount').replace('{count}', chats.length)}
          </span>

          {/* Индикатор источника базы знаний: онлайн Google Таблицы или локальная память */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-[11px]">
            {isKnowledgeFromCache ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 font-medium">Офлайн-память активна</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Google Таблица онлайн</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Кнопка принудительной синхронизации базы знаний из Google Sheets */}
          <button
            onClick={() => loadKnowledgeBase(true)}
            disabled={isSyncingKnowledge}
            title="Обновить шаблоны и переменные напрямую из Google Таблицы"
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-cyan-500/50 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncingKnowledge ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{isSyncingKnowledge ? 'Синхронизация...' : 'Обновить из Таблицы'}</span>
          </button>

          <button
            onClick={handleFormatChats}
            disabled={formattingChats}
            title="Форматировать шапки и колонки всех листов чатов Google Таблиц"
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-emerald-500/50 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${formattingChats ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{formattingChats ? 'Форматирование...' : 'Форматировать CRM чаты'}</span>
          </button>

          <button
            onClick={() => setIsAssistantOpen(true)}
            title="Открыть Бизнес-Ассистент: Секретарь, Юрист, Бухгалтер"
            className="px-2.5 py-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md hover:brightness-110"
          >
            <Bot className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Бизнес-Ассистент</span>
          </button>

          <button
            onClick={() => {
              setIsBroadcastMode(!isBroadcastMode);
              if (!isBroadcastMode) setSelectedMultiSheets(chats.map((c) => c.sheetName));
            }}
            className={`px-2.5 py-2 sm:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
              isBroadcastMode ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">{isBroadcastMode ? t('regularChatMode') : t('broadcastMode')}</span>
          </button>

          {/* Кнопка быстрого сворачивания / разворачивания правого сайдбара деталей брони */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? 'Развернуть панель деталей бронирования' : 'Свернуть панель деталей для расширения чата'}
            className="hidden md:flex px-3 py-2 rounded-xl text-xs font-bold transition-all items-center gap-1.5 bg-slate-800 text-slate-300 hover:text-white border border-white/10"
          >
            {isSidebarCollapsed ? (
              <>
                <PanelRightOpen className="w-4 h-4 text-rose-400" />
                <span>Детали</span>
              </>
            ) : (
              <>
                <PanelRightClose className="w-4 h-4 text-slate-400" />
                <span>Свернуть детали</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">

        {/* Левая колонка: Список диалогов с гостями [4 колонки] */}
        <div className={`col-span-12 md:col-span-4 border-r border-white/10 flex flex-col bg-slate-950/50 min-h-0 h-full overflow-hidden ${mobileActiveView !== 'list' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 border-b border-white/5 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchChatPlaceholder')}
                className="w-full bg-slate-800/80 border border-white/5 pl-9 pr-3 py-2 rounded-xl text-xs text-white outline-none focus:border-rose-500"
              />
            </div>

            {/* Фильтры по статусам диалогов */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
              {[
                { id: 'all', label: 'Все' },
                { id: 'requests', label: 'С заявками' },
                { id: 'paid', label: 'Оплаченные' },
                { id: 'pending', label: 'В ожидании' },
                { id: 'registered', label: 'Зарегистр.' },
                { id: 'unregistered', label: 'Без регистр.' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilterTab(f.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                    activeFilterTab === f.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-800/70 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Сортировка диалогов */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Сортировка:</span>
              <select
                value={activeSortOrder}
                onChange={(e) => setActiveSortOrder(e.target.value)}
                className="bg-slate-800 text-slate-200 text-[11px] rounded-lg px-2 py-0.5 border border-white/10 outline-none focus:border-rose-500"
              >
                <option value="recent">Свежие сообщения</option>
                <option value="urgent">Срочные (HOLD/Запросы)</option>
                <option value="amount">Сумма брони</option>
                <option value="name">Имя гостя</option>
              </select>
            </div>
          </div>

          {isBroadcastMode && (
            <div className="p-2.5 bg-slate-800/60 border-b border-white/5 flex items-center justify-between text-xs text-slate-300">
              <button onClick={selectAllChats} className="font-bold hover:text-white flex items-center gap-1.5">
                {selectedMultiSheets.length === chats.length ? <CheckSquare className="w-4 h-4 text-rose-400" /> : <Square className="w-4 h-4" />}
                <span>{t('selectAllChatsLabel').replace('{count}', selectedMultiSheets.length)}</span>
              </button>
            </div>
          )}

          {/* Список гостей с гарантией сохранения структуры карточек при росте числа диалогов */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-white/5 custom-scrollbar overscroll-contain max-h-[calc(100vh-220px)] md:max-h-none">
            {filteredChats.map((c, idx) => {
              const isSelected = isBroadcastMode
                ? selectedMultiSheets.includes(c.sheetName)
                : selectedSheet === c.sheetName;
              const lastMsg = c.messages?.[c.messages.length - 1];

              // Смарт-бейджи для контакта
              const curReq = c.activeRequests?.[0] || {};
              const reqStatus = (curReq.status || c.bookingStatus || '').toUpperCase();
              const isPaid = reqStatus.includes('ОПЛАЧЕНО') || reqStatus.includes('ПОДТВЕРЖДЕНО');
              const isHold = reqStatus.includes('ОЖИДАЕТ') || reqStatus.includes('HOLD');
              const isOffer = reqStatus.includes('СПЕЦПРЕДЛОЖЕНИЕ');
              const isRequest = reqStatus.includes('ЗАПРОС') || (c.activeRequests && c.activeRequests.length > 0 && !isPaid && !isHold && !isOffer);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isBroadcastMode) {
                      toggleSelectMulti(c.sheetName);
                    } else {
                      setSelectedSheet(c.sheetName);
                      if (typeof window !== 'undefined') {
                        try {
                          localStorage.setItem('villa_host_selected_sheet', c.sheetName);
                        } catch (storageErr) {}
                      }
                      if (onSelectChat) onSelectChat(c.sheetName);
                      setMobileActiveView('chat');
                    }
                  }}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 min-h-[70px] ${
                    isSelected ? 'bg-rose-950/40 border-l-4 border-rose-500' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5 shadow-sm">
                    {c.clientName?.charAt(0).toUpperCase() || 'G'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">{c.clientName}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{lastMsg?.date?.split(' ')?.[0] || ''}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.clientContact}</p>

                    {/* Смарт-бейджи статусов */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      {c.isRegistered ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                          {c.verificationLevel === 'both' ? '✓ Email и Тел' : c.verificationLevel === 'email' ? '✓ Email' : c.verificationLevel === 'phone' ? '✓ Тел' : '👤 Аккаунт'}
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-400">
                          👁️ Без рег.
                        </span>
                      )}

                      {isPaid && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-emerald-200">
                          💳 Оплачено
                        </span>
                      )}
                      {isHold && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-200">
                          ⏰ HOLD 24ч
                        </span>
                      )}
                      {isOffer && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-200">
                          🎁 Спецпредложение
                        </span>
                      )}
                      {isRequest && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-200">
                          ⏳ Запрос
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-1">
                      {lastMsg ? `${lastMsg.sender}: ${lastMsg.original}` : t('noMessages')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Центральная колонка: Активная переписка, textarea и смарт-шаблоны */}
        {/* Динамическое расширение с 5 до 8 колонок при сворачивании правой панели */}
        <div className={`col-span-12 ${isSidebarCollapsed ? 'md:col-span-8' : 'md:col-span-5'} flex flex-col bg-slate-900 justify-between overflow-hidden transition-all duration-200 ${mobileActiveView !== 'chat' ? 'hidden md:flex' : 'flex'}`}>

          {/* Верхняя строка активного чата */}
          <div className="p-3 sm:p-3.5 border-b border-white/10 bg-slate-800/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setMobileActiveView('list')}
                className="md:hidden p-1.5 rounded-lg bg-slate-700/80 text-white hover:bg-slate-600 transition-colors shrink-0"
                title="Вернуться к списку диалогов"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white block truncate">
                    {isBroadcastMode
                      ? t('massBroadcastRecipients').replace('{count}', selectedMultiSheets.length)
                      : t('chatWithGuest').replace('{name}', activeChat?.clientName || t('guestLabel'))}
                  </span>
                  {!isBroadcastMode && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${guestStageInfo.badge}`}>
                      {guestStageInfo.label}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">{activeChat?.clientContact}</span>
              </div>
            </div>

            {/* Мобильная кнопка перехода в детали бронирования */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMobileActiveView('details')}
                className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold transition-colors"
                title="Детали бронирования и действия с заявкой"
              >
                <Info className="w-3.5 h-3.5 text-rose-400" />
                <span>Детали</span>
              </button>
            </div>
          </div>

          {/* Сообщения активного диалога: изолированный скролл без дергания экрана */}
          <div ref={messagesContainerRef} onScroll={handleMessagesScroll} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/30">
            {activeChat?.messages?.map((m, mIdx) => {
              const isOwner = m.sender === 'Владелец' || m.sender === 'Система';
              return (
                <div key={mIdx} className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-500 mb-1 px-1">
                    {m.sender} • {m.date}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm whitespace-pre-wrap break-words shadow-md leading-relaxed ${
                      isOwner ? 'bg-rose-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-sm'
                    }`}
                  >
                    {m[lang] || m.original}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* БЛОК СУФЛЕРА ХОЗЯИНА: ЖИВОЙ ГЕНЕРАТОР ЧЕРНОВИКОВ GEMINI 3.6 FLASH */}
          {lastGuestMsg && (
            <div className="mx-3 my-2 p-3 bg-gradient-to-r from-purple-950/40 via-slate-900 to-rose-950/40 border border-purple-500/30 rounded-2xl shadow-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                    <span>ИИ-Суфлер</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px]">Gemini 3.6 Flash</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                    Гость: «{lastGuestMsg.original || lastGuestMsg.ru || lastGuestMsg.en || lastGuestMsg.tr || ''}»
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAskAiHelp}
                disabled={isAiLoading}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/30 shrink-0 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                <span>{isAiLoading ? 'Генерация...' : 'Сформировать ответ'}</span>
              </button>
            </div>
          )}

          {/* ФОРМА ВВОДА СООБЩЕНИЯ ХОЗЯИНА: МНОГОСТРОЧНЫЙ TEXTAREA БЕЗ УРЕЗАНИЯ */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-white/10 flex flex-col gap-2">
            {/* БЫСТРАЯ ПАНЕЛЬ СМАРТ-ШАБЛОНОВ НАД ТЕКСТОВЫМ ПОЛЕМ */}
            <div className="flex items-center justify-between gap-2 pb-1 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickTemplatesOpen(!isQuickTemplatesOpen)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                    isQuickTemplatesOpen
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-800 text-rose-300 hover:text-white hover:bg-slate-700 border-white/10'
                  }`}
                  title="Быстрый выбор умного шаблона для вставки в сообщение"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Умные шаблоны [{liveTemplates.length}]</span>
                  {isQuickTemplatesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {/* Быстрые переключатели языка шаблонов */}
                <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-white/10 shrink-0">
                  {['ru', 'en', 'tr'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setTemplateLang(l)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                        templateLang === l
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Стадия клиента */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500">Статус:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${guestStageInfo.badge}`}>
                  {guestStageInfo.label}
                </span>
              </div>
            </div>

            {/* БЫСТРЫЙ ВЫПАДАЮЩИЙ КАТАЛОГ ШАБЛОНОВ ПРЯМО НАД ПОЛЕМ ВВОДА */}
            {isQuickTemplatesOpen && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-rose-500/30 shadow-2xl space-y-2 mb-2 max-h-[260px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Быстрый выбор шаблона для {activeChat?.clientName || 'гостя'}:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsQuickTemplatesOpen(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Фильтры этапов */}
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedStage('all')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      selectedStage === 'all'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    Все [{liveTemplates.length}]
                  </button>
                  {TEMPLATE_STAGES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStage(st.id)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        selectedStage === st.id
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {st.title?.[lang] || st.title?.ru || st.name}
                    </button>
                  ))}
                </div>

                {/* Список быстрых шаблонов */}
                <div className="space-y-1.5 pt-1">
                  {displayedTemplates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-white/5 hover:border-white/10 flex items-center justify-between gap-2 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-rose-400 font-bold">{tmpl.id}</span>
                          <span className="text-xs font-semibold text-white truncate">
                            {tmpl.title?.[templateLang] || tmpl.title?.ru}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {getResolvedTemplateText(tmpl, templateLang)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            handleApplyTemplate(tmpl, templateLang);
                            setIsQuickTemplatesOpen(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-colors"
                        >
                          Вставить
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleDirectSendTemplate(tmpl, templateLang);
                            setIsQuickTemplatesOpen(false);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Отправить напрямую гостю"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <textarea
                ref={textareaRef}
                rows={3}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напишите ответ гостю или выберите один из шаблонов выше... [Shift+Enter для новой строки]"
                className="flex-1 bg-slate-800 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-rose-500 resize-none min-h-[96px] max-h-[220px] overflow-y-auto leading-relaxed"
              />

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAskAiHelp}
                  disabled={isAiLoading}
                  title="Помощь ИИ-агента Gemini: составить ответ на языке гостя"
                  className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center shadow-sm disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : 'text-amber-300'}`} />
                </button>

                <button
                  type="submit"
                  disabled={loading || !messageInput.trim()}
                  title="Отправить сообщение гостю [Enter]"
                  className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors disabled:opacity-40 flex items-center justify-center shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
              <span>Enter для отправки • Shift+Enter для новой строки</span>
              <span>Символов: {messageInput.length}</span>
            </div>
          </form>

          {/* НИЖНЯЯ ПАНЕЛЬ ДЕЙСТВИЙ И БЫСТРОГО ДОСТУПА К ШАБЛОНАМ */}
          <div className="bg-slate-950 border-t border-white/10 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsSidebarCollapsed(false);
                  setRightPanelTab('templates');
                  if (mobileActiveView === 'chat') setMobileActiveView('details');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-white/10 shadow-sm"
                title="Открыть панель умных шаблонов справа без перекрытия чата"
              >
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>Умные шаблоны [{liveTemplates.length}]</span>
              </button>

              {/* Быстрые переключатели языка шаблонов */}
              <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-white/10 shrink-0">
                {['ru', 'en', 'tr'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setTemplateLang(l)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      templateLang === l
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              {isKnowledgeFromCache ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Офлайн-память
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Таблица онлайн
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Правая колонка: Детали гостя, текущая бронь / Умная панель шаблонов */}
        {(!isSidebarCollapsed || mobileActiveView === 'details') && (
          <div className={`${mobileActiveView === 'details' ? 'flex col-span-12' : 'hidden md:flex md:col-span-3'} border-l border-white/10 bg-slate-950/60 p-3.5 flex-col justify-between overflow-y-auto space-y-4`}>
            <div className="space-y-4 flex-1">
              {/* Переключатель вкладок правого сайдбара */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileActiveView('chat')}
                    className="md:hidden p-1.5 rounded-lg bg-slate-700/80 text-white hover:bg-slate-600 transition-colors"
                    title="Вернуться к диалогу"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setRightPanelTab('details')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        rightPanelTab === 'details'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{t('guestInfoTitle')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRightPanelTab('templates')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        rightPanelTab === 'templates'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-300" />
                      <span>Шаблоны [{liveTemplates.length}]</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  title="Свернуть панель"
                  className="hidden md:block text-slate-400 hover:text-white transition-colors"
                >
                  <PanelRightClose className="w-4 h-4" />
                </button>
              </div>

              {/* ВКЛАДКА 1: ДЕТАЛИ ГОСТЯ И БРОНИРОВАНИЯ */}
              {rightPanelTab === 'details' && (
                <div className="space-y-4">
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-400">{t('nameFieldLabel')} <b className="text-white">{activeChat?.clientName || t('guestLabel')}</b></p>
                    <p className="text-slate-400">{t('contactFieldLabel')} <b className="text-white">{activeChat?.clientContact || '-'}</b></p>
                  </div>

                  {/* Карточка стадии гостя и тарифов */}
                  <div className="p-3 bg-slate-900 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Стадия клиента
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${guestStageInfo.badge}`}>
                        {guestStageInfo.label}
                      </span>
                    </div>

                    {pricingCorridor && (
                      <div className="border-t border-white/5 pt-2 space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-300">
                          <span>Базовый тариф:</span>
                          <span className="font-bold text-white">${pricingCorridor.basePriceUsd || pricingCorridor.discountCorridor?.standardFlexiblePrice || 250}/сут</span>
                        </div>
                        <div className="flex justify-between text-amber-300">
                          <span>Порог безопасности:</span>
                          <span className="font-bold">${pricingCorridor.minNightFloorUsd || pricingCorridor.discountCorridor?.absoluteFloor || 180}/сут</span>
                        </div>
                        <div className="flex justify-between text-emerald-400">
                          <span>Макс. скидка:</span>
                          <span className="font-bold">до {pricingCorridor.discountCorridor?.maxDiscountPercent || 28}%</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pt-0.5">
                          Синхронизация: 6 OTA платформ [Airbnb, Booking, Vrbo, Avito, Agoda, Google]
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Активные брони гостя */}
                  {activeChat?.activeRequests && activeChat.activeRequests.length > 0 && (
                    <div className="p-3 bg-slate-900 rounded-2xl border border-white/5 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
                        {t('currentBookingTitle')}
                      </span>
                      {activeChat.activeRequests.map((r, rIdx) => (
                        <div key={rIdx} className="text-xs space-y-1">
                          <p className="font-bold text-white">{r.checkIn} - {r.checkOut}</p>
                          <p className="text-emerald-400 font-bold">{r.price}</p>
                          <p className="text-slate-400 text-[11px]">{t('statusFieldLabel')} {r.status}</p>

                          {r.expiresAt && ['ОЖИДАЕТ ОПЛАТЫ', 'СПЕЦПРЕДЛОЖЕНИЕ'].some((st) => r.status && r.status.includes(st)) && (
                            <div className="py-1">
                              {inboxCountdown[r.rowIndex] && inboxCountdown[r.rowIndex] !== 'EXPIRED' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/70 border border-rose-500/40 text-[10px] font-bold text-rose-300 animate-pulse font-mono">
                                  <Clock className="w-3 h-3 text-rose-400" />
                                  <span>До закрытия: {inboxCountdown[r.rowIndex]}</span>
                                </span>
                              ) : inboxCountdown[r.rowIndex] === 'EXPIRED' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/30 text-[10px] font-bold text-red-400 font-mono">
                                  <Clock className="w-3 h-3" />
                                  <span>Время оплаты истекло</span>
                                </span>
                              ) : null}
                            </div>
                          )}

                          {/* Кнопки управления заявкой на всех активных стадиях */}
                          {['ЗАПРОС', 'ОЖИДАЕТ ОПЛАТЫ', 'СПЕЦПРЕДЛОЖЕНИЕ'].some((st) => r.status && r.status.includes(st)) && (
                            <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                              {r.status === 'ЗАПРОС' && (
                                <button
                                  onClick={() => onApprove && onApprove(r)}
                                  disabled={loading}
                                  title={t('approve24hBtn')}
                                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold transition-all disabled:opacity-40"
                                >
                                  <CheckCircle className="w-3 h-3" /> {t('approve24hBtn')}
                                </button>
                              )}
                              {r.status === 'ЗАПРОС' && (
                                <button
                                  onClick={() => onSpecialOffer && onSpecialOffer({ rowIndex: r.rowIndex, contact: r.contact, name: r.name, checkIn: r.checkIn, checkOut: r.checkOut, chatSheetName: `Chat_${r.name}_${r.contact}` })}
                                  disabled={loading}
                                  title={t('specialOfferShortBtn')}
                                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border border-purple-500/30 text-[10px] font-bold transition-all disabled:opacity-40"
                                >
                                  <Gift className="w-3 h-3" /> {t('specialOfferShortBtn')}
                                </button>
                              )}
                              <button
                                onClick={() => onRevoke && onRevoke(r)}
                                disabled={loading}
                                title={t('revokeShortBtn')}
                                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-500/30 text-[10px] font-bold transition-all disabled:opacity-40"
                              >
                                <RotateCcw className="w-3 h-3" /> {t('revokeShortBtn')}
                              </button>
                              <button
                                onClick={() => onReject && onReject(r)}
                                disabled={loading}
                                title={t('declineShortBtn')}
                                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 text-[10px] font-bold transition-all disabled:opacity-40"
                              >
                                <XCircle className="w-3 h-3" /> {t('declineShortBtn')}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Блок отправки путеводителя */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" /> {t('grantGuideAccessTitle')}
                    </span>
                    <select
                      onChange={(e) => {
                        const lesson = lmsModules.find((m) => m.privateLink === e.target.value);
                        if (lesson) handleSendLessonLink(lesson);
                        e.target.value = '';
                      }}
                      className="w-full bg-slate-800 border border-white/10 p-2 rounded-xl text-xs text-white font-bold outline-none cursor-pointer"
                    >
                      <option value="">{t('selectVideoGuidePlaceholder')}</option>
                      {lmsModules.map((m, mIdx) => (
                        <option key={mIdx} value={m.privateLink}>
                          {m.name?.[lang] || m.name?.ru || m.name?.en || m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* ВКЛАДКА 2: УМНАЯ ПАНЕЛЬ ШАБЛОНОВ БЕЗ ПЕРЕКРЫТИЯ ЧАТА С ПОЛНЫМ ПРОСМОТРОМ */}
              {rightPanelTab === 'templates' && (
                <div className="space-y-3">
                  {/* Фильтр по этапам */}
                  <div className="flex flex-wrap gap-1 pb-1">
                    <button
                      type="button"
                      onClick={() => setSelectedStage('all')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        selectedStage === 'all'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      Все [{liveTemplates.length}]
                    </button>
                    {TEMPLATE_STAGES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStage(st.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          selectedStage === st.id
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {st.title?.[lang] || st.title?.ru || st.name}
                      </button>
                    ))}
                  </div>

                  {/* Список карточек шаблонов */}
                  <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                    {displayedTemplates.map((tItem) => {
                      const curReq = activeChat?.activeRequests?.[0] || {};
                      const isAiMatched = Boolean(
                        curReq?.status &&
                        tItem?.stageId &&
                        curReq.status.toLowerCase().includes(tItem.stageId.toLowerCase())
                      );
                      const resolvedText = getResolvedTemplateText(tItem, templateLang);

                      return (
                        <div
                          key={tItem.id}
                          className="p-3 rounded-2xl border transition-all text-xs space-y-2 bg-slate-900 border-white/10 hover:border-white/20 shadow-md"
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 font-mono text-[10px] font-bold border border-white/5 shrink-0">
                                {tItem.id}
                              </span>
                              <span className="font-bold text-white truncate text-xs">
                                {tItem.title?.[templateLang] || tItem.title?.ru}
                              </span>
                            </div>
                            {isAiMatched && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30 flex items-center gap-1 shrink-0">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Рекомендация ИИ</span>
                              </span>
                            )}
                          </div>

                          {/* Полный текст шаблона без урезания с прокруткой */}
                          <div className="p-2.5 bg-slate-950 rounded-xl border border-white/5 text-slate-200 font-sans text-xs whitespace-pre-wrap leading-relaxed max-h-[140px] overflow-y-auto">
                            {resolvedText}
                          </div>

                          {/* Кнопки действий: вставить для правки или отправить сразу */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleApplyTemplate(tItem, templateLang)}
                              className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors border border-white/10 flex items-center justify-center gap-1"
                            >
                              <FileText className="w-3 h-3 text-rose-400" />
                              <span>Вставить</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDirectSendTemplate(tItem, templateLang)}
                              className="py-1.5 px-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-colors shadow-sm flex items-center justify-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Отправить</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 border-t border-white/5 pt-3">
              {t('chatArchiveNotice')}
            </div>
          </div>
        )}

      </div>

      <BusinessAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeBooking={activeChat?.activeRequests?.[0]}
      />
    </div>
  );
}
