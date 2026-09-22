// ==============================================================================
// ЛИЧНЫЙ КАБИНЕТ ХОЗЯИНА ВИЛЛЫ (HOST DASHBOARD)
// Файл: pages/host/index.js
// Назначение: Управление бронированиями, ценами, iCal, сообщениями и 2FA безопасность
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Shield, Calendar, Clock, MessageSquare, Settings, RefreshCw, Layers, ArrowLeft, LogOut, CheckCircle2, UserCheck, Bot } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HostReservations from '../../components/HostCabinet/HostReservations';
import HostCalendar from '../../components/HostCabinet/HostCalendar';
import HostInbox from '../../components/HostCabinet/HostInbox';
import HostSettings from '../../components/HostCabinet/HostSettings';
import HostChannelManager from '../../components/HostCabinet/HostChannelManager';
import BusinessAssistantModal from '../../components/Modals/BusinessAssistantModal';
import TwoFaModal from '../../components/Modals/TwoFaModal';
import AuthModal from '../../components/Modals/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../utils/language';
import { useToast } from '../../components/Toast';

export default function HostDashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { currentUser, authLoading, logout, setTwoFaModalOpen, setAuthModalOpen } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations', 'calendar', 'inbox', 'settings', 'channels'

  // Данные хоста
  const [dynamicRules, setDynamicRules] = useState({});
  const [dateRules, setDateRules] = useState([]);
  const [apiEvents, setApiEvents] = useState([]);
  const [chats, setChats] = useState([]);
  const [allRequestsList, setAllRequestsList] = useState([]);
  const [lmsModules, setLmsModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);

  // Синхронизация таба из query
  useEffect(() => {
    if (router.query.tab && ['reservations', 'calendar', 'inbox', 'settings', 'channels'].includes(router.query.tab)) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  // Загрузка настроек календаря и тарифов
  const fetchSettings = async () => {
    try {
      const res = await axios.post('/api/booking', { action: 'get_settings' });
      if (res.data && res.data.success) {
        if (res.data.globalRules) setDynamicRules(res.data.globalRules);
        if (res.data.dateRules) setDateRules(res.data.dateRules);
      }
    } catch (err) {
      console.warn('Ошибка загрузки настроек:', err);
    }
  };

  // Загрузка событий iCal синхронизации
  const fetchCalendarEvents = async () => {
    try {
      const res = await axios.get('/api/calendar');
      if (res.data && res.data.events) {
        setApiEvents(res.data.events);
      }
    } catch (err) {
      console.warn('Ошибка загрузки iCal:', err);
    }
  };

  // Загрузка всех чатов и заявок для админ-панели
  const fetchMasterChats = async () => {
    try {
      const res = await axios.post('/api/booking', { action: 'master_get_chats' });
      if (res.data && res.data.success) {
        setChats(res.data.chats || []);
        if (res.data.allRequests) {
          setAllRequestsList(res.data.allRequests);
        }
      }
    } catch (err) {
      console.warn('Ошибка загрузки чатов хозяина:', err);
    }
  };

  // Однократная загрузка обучающих материалов (LMS) для мастера
  const fetchLmsModules = async () => {
    try {
      const lmsRes = await axios.post('/api/booking', { action: 'master_get_lms' });
      if (lmsRes.data && lmsRes.data.success) {
        setLmsModules(lmsRes.data.lms || []);
      }
    } catch (err) {
      console.warn('Ошибка загрузки LMS:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchCalendarEvents();
    if (currentUser?.isHost) {
      fetchMasterChats();
      fetchLmsModules();
      const interval = setInterval(() => {
        fetchMasterChats();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Сбор всех заявок из базы бронирований и чатов
  const allRequests = allRequestsList.length > 0
    ? allRequestsList
    : chats.flatMap((c) => c.activeRequests || []);
  const pendingRequests = allRequests.filter((r) => r.status === 'ЗАПРОС' || (r.status && (r.status.includes('ОЖИДАЕТ') || r.status.includes('СПЕЦПРЕДЛОЖЕНИЕ'))));

  // --- ДЕЙСТВИЯ ХОЗЯИНА ---

  // 1. Одобрение заявки (24h HOLD)
  const handleApproveRequest = async (req) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/booking', {
        action: 'approve_request',
        rowIndex: req.rowIndex,
        contact: req.contact,
        checkIn: req.checkIn,
        checkOut: req.checkOut,
        chatSheetName: `Chat_${req.name || 'Гость'}_${req.contact}`
      });
      if (res.data && res.data.success) {
        toast.success(t('requestApprovedSuccess'));
        fetchMasterChats();
        fetchSettings();
      } else {
        toast.error(t('failedApproveRequest'));
      }
    } catch (err) {
      toast.error(t('networkErrorApprove'));
    } finally {
      setLoading(false);
    }
  };

  // 2. Отправка специального предложения
  const handleSpecialOffer = async (offerData) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/booking', {
        action: 'special_offer',
        ...offerData
      });
      if (res.data && res.data.success) {
        toast.success(t('offerSentSuccess'));
        fetchMasterChats();
        fetchSettings();
      } else {
        toast.error(t('failedSpecialOffer'));
      }
    } catch (err) {
      toast.error(t('networkErrorOffer'));
    } finally {
      setLoading(false);
    }
  };

  // 3. Отклонение заявки
  const handleRejectRequest = async (req) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/booking', {
        action: 'reject_request',
        rowIndex: req.rowIndex,
        chatSheetName: `Chat_${req.name || 'Гость'}_${req.contact}`,
        checkIn: req.checkIn,
        checkOut: req.checkOut
      });
      if (res.data && res.data.success) {
        toast.info(t('requestRejectedToast'));
        fetchMasterChats();
      }
    } catch (err) {
      toast.error(t('networkErrorReject'));
    } finally {
      setLoading(false);
    }
  };

  // 4. Отзыв предложения
  const handleRevokeRequest = async (req) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/booking', {
        action: 'revoke_request',
        rowIndex: req.rowIndex,
        chatSheetName: `Chat_${req.name || 'Гость'}_${req.contact}`,
        checkIn: req.checkIn,
        checkOut: req.checkOut
      });
      if (res.data && res.data.success) {
        toast.info(t('offerRevokedToast'));
        fetchMasterChats();
        fetchSettings();
      }
    } catch (err) {
      toast.error(t('networkErrorRevoke'));
    } finally {
      setLoading(false);
    }
  };

  // 5. Сохранение правил календаря
  const handleSaveCalendarRules = async (rules) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/booking', {
        action: 'master_save_calendar',
        rules,
        sender: currentUser.name
      });
      if (res.data && res.data.success) {
        toast.success(t('calendarUpdatedToast'));
        fetchSettings();
      }
    } catch (err) {
      toast.error(t('calendarSaveErrorToast'));
    } finally {
      setLoading(false);
    }
  };

  // 6. Сохранение глобальных параметров
  const handleSaveSettings = async (rules) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/booking', {
        action: 'master_save_global_rules',
        rules,
        sender: currentUser?.name || 'Admin'
      });
      if (res.data && res.data.success) {
        toast.success(t('settingsSavedToast'));
        await fetchSettings();
      } else {
        toast.error(res.data?.error || t('settingsSaveFailedToast'));
      }
    } catch (err) {
      toast.error(err.response?.data?.error || t('settingsSaveErrorToast'));
    } finally {
      setLoading(false);
    }
  };

  // 7. Отправка сообщения в чат
  const handleSendMessage = async (sheetName, message, file) => {
    // Оптимистичное отображение в интерфейсе без ожидания ответа сети
    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
    const optimisticMsg = {
      date: timestamp,
      sender: 'Владелец',
      original: message,
      ru: message,
      en: message,
      tr: message,
      file: file ? file.name : ''
    };
    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.sheetName === sheetName) {
          return {
            ...c,
            messages: [...(c.messages || []), optimisticMsg]
          };
        }
        return c;
      })
    );

    try {
      await axios.post('/api/booking', {
        action: 'master_send_chats',
        targetSheets: [sheetName],
        message,
        sender: 'Владелец'
      });
      toast.success(t('messageSentToast'));
      fetchMasterChats();
    } catch (err) {
      toast.error(t('messageSendErrorToast'));
      fetchMasterChats();
    }
  };

  // 8. Массовая рассылка
  const handleBroadcast = async (targetSheets, message) => {
    try {
      await axios.post('/api/booking', {
        action: 'master_send_chats',
        targetSheets,
        message,
        sender: 'Владелец'
      });
      fetchMasterChats();
    } catch (err) {
      toast.error(t('broadcastErrorToast'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Head>
        <title>{t('hostHubTitle')} | Villa Turaman</title>
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Заголовок панели хозяина */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link href="/" className="hover:text-white flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('viewAsGuestLink')}
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Shield className="w-7 h-7 text-amber-400" />
              <span>{t('hostHubTitle')}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t('ownerLabel')} {currentUser?.name || 'Aleksei Znamenskii'} • VKN 9991120181
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsAssistantModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/20 hover:scale-105"
              title="Открыть Рабочий Чат Ассистента: Секретарь, Юрист, Бухгалтер"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>Бизнес-Ассистент</span>
            </button>

            <Link
              href="/host/graph"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all shadow-lg"
            >
              <Layers className="w-4 h-4" /> {t('ccGraphBtn')}
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" /> {t('logout')}
            </button>
          </div>
        </div>

        {/* Проверка прав доступа хозяина */}
        {!currentUser?.isHost ? (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-10 text-center max-w-md mx-auto my-12 shadow-2xl">
            <Shield className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{t('accessRestrictedTitle')}</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {t('accessRestrictedDesc')}
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>{t('loginAsOwnerBtn')}</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Навигационные табы кабинета хозяина */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-8">
              <button
                onClick={() => setActiveTab('reservations')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'reservations'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
              >
                <Clock className="w-4 h-4" />
                <span>{t('tabReservations')}</span>
                {pendingRequests.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-rose-600 text-[10px] font-black flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'calendar'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{t('tabCalendarRules')}</span>
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'inbox'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('tabInboxCRM')}</span>
                {chats.length > 0 && (
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {chats.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'settings'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
              >
                <Settings className="w-4 h-4" />
                <span>{t('tabListingSettings')}</span>
              </button>

              <button
                onClick={() => setActiveTab('channels')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'channels'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t('tabChannels')}</span>
              </button>

              <button
                onClick={() => setIsAssistantModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 hover:text-white border border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-500/10"
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Бизнес-Ассистент [ИИ]</span>
              </button>
            </div>

            {/* Контент табов хозяина */}
            {activeTab === 'reservations' && (
              <HostReservations
                requests={pendingRequests}
                dynamicRules={dynamicRules}
                onApprove={handleApproveRequest}
                onSpecialOffer={handleSpecialOffer}
                onReject={handleRejectRequest}
                onRevoke={handleRevokeRequest}
                loading={loading}
              />
            )}

            {activeTab === 'calendar' && (
              <HostCalendar
                dynamicRules={dynamicRules}
                dateRules={dateRules}
                apiEvents={apiEvents}
                masterAllChats={chats}
                onSaveCalendarRules={handleSaveCalendarRules}
                loading={loading}
              />
            )}

            {activeTab === 'inbox' && (
              <HostInbox
                chats={chats}
                lmsModules={lmsModules}
                onSendMessage={handleSendMessage}
                onBroadcast={handleBroadcast}
                onApprove={handleApproveRequest}
                onSpecialOffer={handleSpecialOffer}
                onReject={handleRejectRequest}
                onRevoke={handleRevokeRequest}
                onRefreshChats={fetchMasterChats}
                loading={loading}
              />
            )}

            {activeTab === 'settings' && (
              <HostSettings
                globalRules={dynamicRules}
                onSaveSettings={handleSaveSettings}
                loading={loading}
              />
            )}

            {activeTab === 'channels' && (
              <HostChannelManager />
            )}

          </div>
        )}

      </main>

      <Footer />
      <TwoFaModal />
      <AuthModal />
      <BusinessAssistantModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        activeBooking={allRequestsList?.[0] || chats?.[0]}
      />
    </div>
  );
}

