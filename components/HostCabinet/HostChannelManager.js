// ==============================================================================
// МЕНЕДЖЕР КАНАЛОВ И СИНХРОНИЗАЦИИ ICAL (HOST CHANNEL MANAGER)
// Файл: components/HostCabinet/HostChannelManager.js
// Назначение: Управление 2-way синхронизацией календарей Airbnb, Booking, Vrbo, Google
// ==============================================================================

import React, { useState } from 'react';
import { RefreshCw, Copy, Check, ExternalLink, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useToast } from '../Toast';

export default function HostChannelManager() {
  const { t } = useLanguage();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const channels = [
    { name: "Airbnb", logo: "https://a0.muscache.com/airbnb/static/icons/apple-touch-icon-76x76-3b313d93b1b6e82329407d3b9ceb4272.png", status: t('activeStatusLabel'), mode: "2-Way Sync" },
    { name: "Booking.com", logo: "https://cf.bstatic.com/static/img/b2run_favicon/f8fb38a2e4ff477d6ee0572da9a19d08e5e8e8ff.ico", status: t('activeStatusLabel'), mode: "2-Way Sync" },
    { name: "Vrbo / Expedia", logo: "https://csvcus.homeaway.com/rsrcs/cdn-logos/2.11.0/bce/brand/misc/favicon.ico", status: t('activeStatusLabel'), mode: "2-Way Sync" },
    { name: "Авито Путешествия", logo: "https://www.avito.st/s/common/components/monetization/badge/1/icons/avito_favicon.ico", status: t('activeStatusLabel'), mode: "2-Way Sync" },
    { name: "Agoda", logo: "https://cdn6.agoda.net/images/header/agoda-logo.png", status: t('activeStatusLabel'), mode: "2-Way Sync" },
    { name: "Google Calendar", logo: "https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png", status: t('activeStatusLabel'), mode: "1-Way Sync" }
  ];

  const exportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/export-calendar`
    : 'https://villaturaman.com/api/export-calendar';

  const handleCopy = () => {
    navigator.clipboard.writeText(exportUrl);
    setCopied(true);
    toast.success(t('copiedToast'));
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-4xl fade-in space-y-8 shadow-xl">
      
      {/* Шапка менеджера каналов */}
      <div className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-rose-500" />
          <div>
            <h3 className="text-lg font-bold text-white">{t('channelManagerTitle')}</h3>
            <p className="text-xs text-slate-400">
              {t('twoWaySyncDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Экспортный iCal фид Villa Turaman */}
      <div className="p-5 rounded-2xl bg-slate-800/80 border border-white/10 space-y-3">
        <label className="block text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose-400" />
          {t('exportIcalFeedLabel')}
        </label>
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={exportUrl}
            className="flex-1 bg-slate-900 border border-white/10 p-3 rounded-xl text-xs text-slate-300 font-mono select-all outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-rose-600/30"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t('copiedBtnLabel') : t('copyFeedUrl')}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          {t('icalImportTip')}
        </p>
      </div>

      {/* Список подключенных каналов */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {t('activeChannelsCount')}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {channels.map((ch, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center p-1 border border-white/10">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{ch.name}</h5>
                  <span className="text-[10px] text-slate-400">{ch.mode}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> {ch.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-rose-500 shrink-0" />
        <span>{t('channelsBlockDatesDesc')}</span>
      </div>

    </div>
  );
}

