// ==============================================================================
// ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ (PRIVACY POLICY)
// Файл: pages/legal/privacy.js
// Назначение: Регламент защиты конфиденциальности посетителей сайта Villa Turaman
// ==============================================================================

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useLanguage } from '../../utils/language';
import dynamicContent from '../../utils/content.json';

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const content = dynamicContent?.legal?.privacy || {};
  const pageTitle = content?.title?.[lang] || content?.title?.ru || 'Политика конфиденциальности';
  const pageContent = content?.text?.[lang] || content?.text?.ru || `Администрация платформы Villa Turaman уважает право пользователей на конфиденциальность и обеспечивает защиту информации, собираемой при использовании веб-сайта.

1. Сбор информации:
Мы собираем информацию, когда вы регистрируетесь на сайте, оформляете заявку на бронирование или заказываете дополнительные услуги (трансфер, экскурсии, видео-гиды). Собираемая информация включает ваше имя, адрес электронной почты, номер телефона или логин Telegram.

2. Использование информации:
Информация используется исключительно для:
- Обработки бронирования и отправки подтверждений;
- Персональной связи между гостем и хозяином виллы;
- Улучшения качества обслуживания и адаптации языковых настроек сайта.

3. Файлы Cookie:
Сайт использует технические файлы cookie для сохранения выбранного языка (RU/EN/TR), валюты (RUB/EUR/TRY/USD) и состояния авторизованной сессии.

4. Безопасность:
Мы применяем протоколы шифрования SSL/TLS для передачи всех персональных данных и платежной информации.

По всем вопросам: villaturaman@gmail.com`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Head>
        <title>{pageTitle} | Villa Turaman</title>
      </Head>

      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> На главную страницу
        </Link>

        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Lock className="w-8 h-8 text-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{pageTitle}</h1>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {pageContent}
          </div>
        </div>
      </main>

      <Footer legalData={dynamicContent?.legal} />
    </div>
  );
}

