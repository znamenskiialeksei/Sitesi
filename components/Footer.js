// ==============================================================================
// ПОДВАЛ САЙТА В СТИЛЕ AIRBNB (FOOTER)
// Файл: components/Footer.js
// Назначение: Юридические ссылки (KVKK, Договор), реквизиты VKN, контакты и копирайт,
// динамически загружаемые из Google Sheets (таблица Legal).
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MessageCircle, Mail, MapPin, Heart, QrCode } from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function Footer({ legalData = {} }) {
  const { t, lang } = useLanguage();

  const companyName = legalData.company_name?.text?.[lang] || legalData.company_name?.text?.ru || 'ALEKSEI ZNAMENSKII - Villa Turaman';
  const taxInfo = legalData.tax_info?.text?.[lang] || legalData.tax_info?.text?.ru || 'Ortaca Vergi Dairesi, VKN: 9991120181 (Турция)';
  const contactEmail = legalData.contact_email?.text?.[lang] || legalData.contact_email?.text?.ru || 'villaturaman@gmail.com';
  const etbisText = legalData.etbis_text?.text?.[lang] || legalData.etbis_text?.text?.ru || "ETBİS'e Kayıtlıdır";
  const etbisQr = legalData.etbis_placeholder?.text?.[lang] || legalData.etbis_placeholder?.text?.ru || "ETBIS QR CODE\nVKN: 9991120181";

  const contractTitle = legalData.contract?.title?.[lang] || legalData.contract?.title?.ru || t('linkContract') || 'Договор аренды';
  const kvkkTitle = legalData.kvkk?.title?.[lang] || legalData.kvkk?.title?.ru || t('linkKVKK') || 'Политика KVKK';
  const privacyTitle = legalData.privacy?.title?.[lang] || legalData.privacy?.title?.ru || t('linkPrivacy') || 'Конфиденциальность';
  const cancellationTitle = legalData.cancellation?.title?.[lang] || legalData.cancellation?.title?.ru || t('linkCancellation') || 'Правила отмены';

  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 pt-14 pb-10 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Колонка 1: О Villa Turaman */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Villa Turaman
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Премиальная частная вилла в Дальяне (Турция). Прямое бронирование от владельца Алексея Знаменского без скрытых комиссий сторонних агрегаторов.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Dalyan, Ortaca, Muğla, Turkey</span>
            </div>
          </div>

          {/* Колонка 2: Юридическая база из Google Sheets */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Юридическая база
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/kvkk" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{kvkkTitle}</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/contract" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{contractTitle}</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{privacyTitle}</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/cancellation" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{cancellationTitle}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Колонка 3: Контакты и реквизиты */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Связь и реквизиты
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://t.me/AlekseiZnamenskii"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center gap-2 text-blue-400"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" /> Telegram: @AlekseiZnamenskii
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" /> {contactEmail}
                </a>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1 border-t border-white/5">
              <p><strong className="text-slate-200">Компания:</strong> {companyName}</p>
              <p><strong className="text-slate-200">Налоговый номер:</strong> {taxInfo}</p>
            </div>
          </div>

          {/* Колонка 4: ETBİS и стандарты */}
          <div className="space-y-3 flex flex-col items-start md:items-center text-center">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Госреестр ETBİS
            </h4>
            <div className="p-3 bg-slate-900 rounded-2xl border border-white/10 flex flex-col items-center justify-center w-36 h-36 text-center text-[10px] text-slate-400 space-y-1 shadow-inner">
              <QrCode className="w-12 h-12 text-slate-300" />
              <span className="font-mono leading-tight whitespace-pre-line text-[9px]">{etbisQr}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full">
              {etbisText}
            </span>
          </div>

        </div>

        {/* Копирайт */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} ALEKSEI ZNAMENSKII • Villa Turaman. Все права защищены.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Dalyan, Turkey</span>
            <span>•</span>
            <span>VKN: 9991120181</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
