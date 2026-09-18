// ==============================================================================
// ПРАВИЛА ОТМЕНЫ БРОНИРОВАНИЯ И ВОЗВРАТА (CANCELLATION POLICY)
// Файл: pages/legal/cancellation.js
// Назначение: Условия отмены в стиле AirBnB (Гибкие / Умеренные)
// ==============================================================================

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useLanguage } from '../../utils/language';
import dynamicContent from '../../utils/content.json';

export default function CancellationPage() {
  const { lang } = useLanguage();
  const content = dynamicContent?.legal?.cancellation || {};
  const pageTitle = content?.title?.[lang] || content?.title?.ru || 'Правила отмены бронирования и возврата';
  const pageContent = content?.text?.[lang] || content?.text?.ru || `На вилле Villa Turaman действуют прозрачные и справедливые правила отмены бронирования в стиле стандартов AirBnB.

1. Бесплатная отмена в течение 48 часов:
Гость имеет право на 100% возврат средств при отмене бронирования в течение 48 часов после совершения оплаты, если до даты заезда остается не менее 14 дней.

2. Отмена за 30 дней до заезда:
При отмене более чем за 30 дней до даты заезда возвращается 100% стоимости за вычетом комиссии платежного шлюза (1.5 - 3%).

3. Отмена от 14 до 30 дней до заезда:
При отмене за 14–30 дней до заезда возвращается 50% от общей стоимости проживания.

4. Отмена менее чем за 14 дней до заезда:
При отмене менее чем за 14 дней до даты заселения стоимость проживания не возвращается, так как даты были заблокированы в календаре и сняты со всех мировых площадок.

5. Форс-мажорные обстоятельства:
В случае официального закрытия воздушного пространства или стихийных бедствий даты бронирования могут быть перенесены на любой свободный период по согласованию с хозяином виллы без штрафных санкций.

Служба поддержки хозяина: villaturaman@gmail.com`;

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
            <ShieldAlert className="w-8 h-8 text-amber-400" />
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

