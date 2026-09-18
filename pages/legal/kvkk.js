// ==============================================================================
// ПОЛИТИКА ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ (KVKK POLICY)
// Файл: pages/legal/kvkk.js
// Назначение: Юридическое соглашение по турецкому закону KVKK (Kanun No. 6698)
// ==============================================================================

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useLanguage } from '../../utils/language';
import dynamicContent from '../../utils/content.json';

export default function KVKKPage() {
  const { lang, t } = useLanguage();
  const content = dynamicContent?.legal?.kvkk || {};
  const pageTitle = content?.title?.[lang] || content?.title?.ru || 'Политика обработки персональных данных (KVKK)';
  const pageContent = content?.text?.[lang] || content?.text?.ru || `В соответствии с Законом Турецкой Республики о защите персональных данных № 6698 (KVKK), Villa Turaman в лице владельца Алексея Знаменского (VKN 9991120181) информирует гостей об условиях сбора, обработки и хранения персональных данных.

1. Цели сбора данных:
Персональные данные (ФИО, контактный телефон, Telegram, паспортные данные для заселения) собираются исключительно для заключения договора посуточной аренды жилья, обеспечения безопасности гостей и выполнения требований законодательства Турецкой Республики о регистрации постояльцев (KBS - Kimlik Bildirim Sistemi).

2. Хранение и передача данных:
Данные хранятся в защищенной базе данных и не передаются третьим лицам, за исключением официальных правоохранительных и налоговых органов Турции в случаях, прямо предусмотренных законом.

3. Права субъекта данных:
Гость имеет право в любой момент запросить информацию о своих персональных данных, потребовать их уточнения или удаления после завершения периода аренды и истечения сроков налоговой отчетности.

Контакт для юридических запросов: villaturaman@gmail.com`;

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
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
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

