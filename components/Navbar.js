// ==============================================================================
// ШАПКА САЙТА В СТИЛЕ AIRBNB С ПЕРЕКЛЮЧЕНИЕМ РОЛЕЙ И МУЛЬТИЯЗЫЧНОСТЬЮ
// Файл: components/Navbar.js
// Назначение: Навигация, профиль гостя/хозяина, селекторы языка (RU/EN/TR) и валюты
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Globe, Menu, User, Sparkles, Shield, Compass, MessageCircle, LogOut, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../utils/language';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { t, lang, changeLanguage, currency, changeCurrency, CURRENCY_SYMBOLS } = useLanguage();
  const { currentUser, logout, setAuthModalOpen, setAuthModalTab, setContactModalOpen, activeRoleMode, toggleRoleMode } = useAuth();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const langRef = useRef(null);
  const profileRef = useRef(null);

  // Закрытие выпадающих меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHost = !!currentUser?.isHost;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-white/10 transition-all max-w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4 max-w-full">

        {/* Логотип Villa Turaman */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors truncate">
              {t('brandName')}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold hidden xs:flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Dalyan • Turkey
            </span>
          </div>
        </Link>

        {/* Навигационные якоря (десктоп) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-full border border-white/5 text-xs font-semibold text-slate-300">
          <Link href={router.pathname === '/' ? '#about' : '/#about'} className="px-4 py-2 rounded-full hover:text-white hover:bg-white/5 transition-all">
            {t('navAbout')}
          </Link>
          <Link href={router.pathname === '/' ? '#amenities' : '/#amenities'} className="px-4 py-2 rounded-full hover:text-white hover:bg-white/5 transition-all">
            {t('navAmenities')}
          </Link>
          <Link href={router.pathname === '/' ? '#reviews' : '/#reviews'} className="px-4 py-2 rounded-full hover:text-white hover:bg-white/5 transition-all">
            {t('navReviews')}
          </Link>
          <Link href={router.pathname === '/' ? '#gallery' : '/#gallery'} className="px-4 py-2 rounded-full hover:text-white hover:bg-white/5 transition-all">
            {t('galleryTitle') || 'Галерея'}
          </Link>
          <Link href={router.pathname === '/' ? '#catalog' : '/#catalog'} className="px-4 py-2 rounded-full hover:text-white hover:bg-white/5 transition-all">
            {t('navCatalog')}
          </Link>
        </nav>

        {/* Правая панель действий */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Кнопка переключения в режим Хозяина / Путешественника (AirBnB style) */}
          {isHost ? (
            <button
              onClick={() => {
                toggleRoleMode();
                if (router.pathname.startsWith('/host')) router.push('/');
                else router.push('/host');
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-white/10 transition-all hover:scale-105"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{router.pathname.startsWith('/host') ? t('switchToGuest') : t('switchToHost')}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalTab('login');
                setAuthModalOpen(true);
              }}
              className="hidden lg:block text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
            >
              {t('switchToHost')}
            </button>
          )}

          {/* Переключатель языка и валюты */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-white/10 transition-colors"
              title="Сменить язык и валюту"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="uppercase">{lang}</span>
              <span className="text-slate-500">•</span>
              <span>{CURRENCY_SYMBOLS[currency]}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-24px)] bg-slate-800 rounded-2xl shadow-2xl border border-white/10 p-3 z-50 fade-in flex flex-col gap-3">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 px-2">
                    Язык (Language)
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { code: 'ru', label: 'Русский' },
                      { code: 'en', label: 'English' },
                      { code: 'tr', label: 'Türkçe' }
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          changeLanguage(item.code);
                          setLangMenuOpen(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${lang === item.code ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                          }`}
                      >
                        {item.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 px-2">
                    Валюта (Currency)
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {['RUB', 'EUR', 'TRY', 'USD'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          changeCurrency(c);
                          setLangMenuOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-colors ${currency === c ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                          }`}
                      >
                        {CURRENCY_SYMBOLS[c] || c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Быстрая кнопка перехода в чат на мобильных устройствах */}
          <Link
            href={isHost ? '/host?tab=inbox' : '/guest?tab=chat'}
            className="flex sm:hidden items-center justify-center w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title={isHost ? 'Входящие чаты хозяина' : 'Чат с виллой'}
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </Link>

          {/* Меню профиля пользователя (AirBnB Pill) */}
          <div className="relative shrink-0" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pl-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 transition-all shadow-inner shrink-0"
            >
              <Menu className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-16px)] bg-slate-800 rounded-2xl shadow-2xl border border-white/10 p-2 z-50 fade-in flex flex-col">
                {currentUser ? (
                  <>
                    <div className="px-4 py-3 border-b border-white/10 mb-1">
                      <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.contact}</p>
                      {isHost && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {t('superhostBadge')}
                        </span>
                      )}
                    </div>

                    {isHost ? (
                      <>
                        <Link
                          href="/host"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <Shield className="w-4 h-4 text-amber-400" /> {t('hostCabinet')}
                        </Link>
                        <Link
                          href="/guest"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <Compass className="w-4 h-4 text-blue-400" /> {t('guestCabinet')}
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/guest"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <Compass className="w-4 h-4 text-blue-400" /> {t('tabMyTrips')}
                        </Link>
                        <Link
                          href="/guest?tab=chat"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-400" /> {t('tabHostChat')}
                        </Link>
                        <Link
                          href="/guest?tab=guides"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-purple-400" /> {t('tabMyGuides')}
                        </Link>
                      </>
                    )}

                    <div className="border-t border-white/10 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" /> {t('logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setContactModalOpen(true);
                        setProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left"
                    >
                      <MessageCircle className="w-4 h-4 text-rose-400" />
                      <span>{t('contactHostBtn')}</span>
                    </button>
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={() => {
                        setAuthModalTab('login');
                        setAuthModalOpen(true);
                        setProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-slate-700 transition-colors w-full text-left"
                    >
                      {t('login')}
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalTab('register');
                        setAuthModalOpen(true);
                        setProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors w-full text-left"
                    >
                      {t('register')}
                    </button>
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={() => {
                        setAuthModalTab('login');
                        setAuthModalOpen(true);
                        setProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors w-full text-left"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" /> {t('ownerLoginBtn') || 'Вход для владельца'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

