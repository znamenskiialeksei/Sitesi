// ==============================================================================
// ЛИЧНЫЙ КАБИНЕТ ПУТЕШЕСТВЕННИКА (TRAVELER DASHBOARD)
// Файл: pages/guest/index.js
// Назначение: Управление бронированиями гостя, прямой чат с хозяином, видео-гиды
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { Compass, MessageCircle, Calendar, Sparkles, User, Shield, ArrowLeft, CheckCircle2, Mail, Phone } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GuestBookings from '../../components/GuestCabinet/GuestBookings';
import GuestChat from '../../components/GuestCabinet/GuestChat';
import GuestGuides from '../../components/GuestCabinet/GuestGuides';
import GuestProfile from '../../components/GuestCabinet/GuestProfile';
import AuthModal from '../../components/Modals/AuthModal';
import ContactHostModal from '../../components/Modals/ContactHostModal';
import VerificationModal from '../../components/Modals/VerificationModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../utils/language';
import { useToast } from '../../components/Toast';

export default function GuestCabinetPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { currentUser, authLoading, setAuthModalOpen, setContactModalOpen, updateCurrentUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('trips'); // 'trips', 'chat', 'guides', 'profile'
  const [activeRequests, setActiveRequests] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [timeLefter, setTimeLefter] = useState({});
  const [loadingChat, setLoadingChat] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // Синхронизация активной вкладки с URL query (?tab=chat)
  useEffect(() => {
    if (router.query.tab && ['trips', 'chat', 'guides', 'profile'].includes(router.query.tab)) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  // Загрузка сообщений чата и активных заявок гостя
  const fetchGuestData = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.post('/api/booking', {
        action: 'chat',
        contact: currentUser.contact,
        sender: currentUser.name
      });
      if (res.data && res.data.success) {
        setChatMessages(res.data.messages || []);
        setActiveRequests(res.data.activeRequests || []);
      }
    } catch (err) {
      console.warn('Ошибка загрузки данных гостя:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchGuestData();
      const interval = setInterval(fetchGuestData, 30000); // Опрос раз в 30 секунд
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Таймер обратного отсчета для заявок в статусе "ОЖИДАЕТ ОПЛАТЫ" (24ч HOLD)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newTimes = {};
      let changed = false;

      activeRequests.forEach((req) => {
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

    return () => clearInterval(timerInterval);
  }, [activeRequests]);

  // Отправка сообщения хозяину
  const handleSendMessage = async (msgText, fileObj) => {
    if (!currentUser) return;
    setLoadingChat(true);

    const tempMsg = {
      date: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' }),
      sender: currentUser.name,
      original: msgText,
      ru: msgText,
      en: msgText,
      tr: msgText,
      file: fileObj?.name || ''
    };
    setChatMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await axios.post('/api/booking', {
        action: 'chat',
        contact: currentUser.contact,
        sender: currentUser.name,
        message: msgText,
        fileBase64: fileObj?.base64 || null,
        fileName: fileObj?.name || null,
        mimeType: fileObj?.type || null
      });

      if (res.data && res.data.success) {
        if (res.data.messages && res.data.messages.length > 0) {
          setChatMessages(res.data.messages);
        }
        toast.success('Сообщение отправлено хозяину.');
      } else {
        toast.error('Не удалось отправить сообщение.');
      }
    } catch (err) {
      toast.error('Сетевая ошибка при отправке сообщения.');
    } finally {
      setLoadingChat(false);
    }
  };

  // Переход к оплате одобренной заявки
  const handlePayRequest = async (req) => {
    try {
      const priceNum = parseInt(String(req.price).replace(/[^\d]/g, ''), 10) || 15000;
      const res = await axios.post('/api/payment', {
        gateway: 'stripe',
        amount: priceNum,
        currency: 'EUR',
        bookingDetails: {
          action: 'booking',
          isRegistered: true,
          name: currentUser.name,
          contact: currentUser.contact,
          checkIn: req.checkIn,
          checkOut: req.checkOut,
          nights: req.nights,
          total_guests: req.guests,
          totalPrice: req.price
        }
      });

      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.info('Тестовый режим оплаты: статус успешно подтвержден!');
      }
    } catch (err) {
      toast.error('Ошибка инициализации шлюза оплаты.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Head>
        <title>{t('travelerHubTitle')} | Villa Turaman</title>
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Верхняя панель навигации кабинета */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link href="/" className="hover:text-white flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> На главную виллы
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t('travelerHubTitle')}
            </h1>
            {currentUser && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs text-slate-300 font-medium">
                  {currentUser.name}
                </span>
                {currentUser.emailVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('emailVerifiedBadge') || 'Email подтвержден'}
                  </span>
                )}
                {currentUser.phoneVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('phoneVerifiedBadge') || 'Телефон подтвержден'}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsPhoneModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-semibold transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    {t('verifyPhonePrompt') || 'Подтвердить телефон'}
                  </button>
                )}
              </div>
            )}
          </div>

          {currentUser?.isHost && (
            <Link
              href="/host"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
            >
              <Shield className="w-4 h-4" /> Перейти в панель управления хозяина
            </Link>
          )}
        </div>

        {/* Проверка авторизации */}
        {!currentUser && !authLoading ? (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-10 text-center max-w-md mx-auto my-12 shadow-2xl">
            <User className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Требуется авторизация</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Войдите или зарегистрируйтесь, чтобы просматривать детали своих бронирований и общаться с владельцем виллы.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('writeDirectlyBtn') || 'Написать хозяину без регистрации'}</span>
              </button>

              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Войти по логину и паролю</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Меню табов личного кабинета */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-8">
              <button
                onClick={() => setActiveTab('trips')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'trips'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{t('tabMyTrips')}</span>
                {activeRequests.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-rose-600 text-[10px] font-black flex items-center justify-center">
                    {activeRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('tabHostChat')}</span>
              </button>

              <button
                onClick={() => setActiveTab('guides')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'guides'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('tabMyGuides')}</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t('tabProfile')}</span>
              </button>
            </div>

            {/* Контент активного таба */}
            {activeTab === 'trips' && (
              <GuestBookings
                activeRequests={activeRequests}
                timeLefter={timeLefter}
                onPayRequest={handlePayRequest}
              />
            )}

            {activeTab === 'chat' && (
              <GuestChat
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                loading={loadingChat}
              />
            )}

            {activeTab === 'guides' && (
              <GuestGuides />
            )}

            {activeTab === 'profile' && (
              <GuestProfile />
            )}
          </div>
        )}

      </main>

      {/* Модальное окно подтверждения номера телефона гостя */}
      {currentUser && (
        <VerificationModal
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
          mode="strict"
          guestData={{
            name: currentUser.name || 'Гость',
            email: currentUser.email || '',
            phone: currentUser.phone || currentUser.contact || ''
          }}
          onSuccess={() => {
            setIsPhoneModalOpen(false);
            updateCurrentUser({ phoneVerified: true });
            toast.success(t('verifySuccess') || 'Номер телефона успешно подтвержден!');
          }}
        />
      )}

      <Footer />
      <AuthModal />
      <ContactHostModal />
    </div>
  );
}

