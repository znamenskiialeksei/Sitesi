// ==============================================================================
// КОМПОНЕНТ СИНХРОНИЗИРОВАННЫХ ЮРИДИЧЕСКИХ СОГЛАСИЙ (LEGAL CHECKBOXES)
// Файл: components/LegalConsentCheckboxes.js
// Назначение: Единый блок чекбоксов (KVKK, Договор, Конфиденциальность)
// со сквозной синхронизацией состояния по всему приложению.
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../utils/language';
import { useLegalConsent } from '../context/LegalConsentContext';

export default function LegalConsentCheckboxes({ compact = false, className = '' }) {
  const { t } = useLanguage();
  const {
    agreedKVKK,
    setAgreedKVKK,
    agreedContract,
    setAgreedContract,
    agreedPrivacy,
    setAgreedPrivacy
  } = useLegalConsent();

  return (
    <div className={`space-y-2 ${compact ? 'text-[10px]' : 'text-[11px]'} text-slate-300 ${className}`}>
      {/* 1. Согласие с KVKK */}
      <label className="flex items-start gap-2 cursor-pointer group select-none">
        <input
          type="checkbox"
          checked={agreedKVKK}
          onChange={(e) => setAgreedKVKK(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 rounded accent-rose-500 cursor-pointer shrink-0"
        />
        <span className="leading-tight group-hover:text-white transition-colors">
          {t('legalConsentKVKK')}{' '}
          <Link href="/legal/kvkk" target="_blank" className="text-rose-400 hover:text-rose-300 underline font-medium">
            ({t('linkKVKK')})
          </Link>
        </span>
      </label>

      {/* 2. Согласие с Договором аренды */}
      <label className="flex items-start gap-2 cursor-pointer group select-none">
        <input
          type="checkbox"
          checked={agreedContract}
          onChange={(e) => setAgreedContract(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 rounded accent-rose-500 cursor-pointer shrink-0"
        />
        <span className="leading-tight group-hover:text-white transition-colors">
          {t('legalConsentContract')}{' '}
          <Link href="/legal/contract" target="_blank" className="text-rose-400 hover:text-rose-300 underline font-medium">
            ({t('linkContract')})
          </Link>
        </span>
      </label>

      {/* 3. Согласие с Политикой конфиденциальности */}
      <label className="flex items-start gap-2 cursor-pointer group select-none">
        <input
          type="checkbox"
          checked={agreedPrivacy}
          onChange={(e) => setAgreedPrivacy(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 rounded accent-rose-500 cursor-pointer shrink-0"
        />
        <span className="leading-tight group-hover:text-white transition-colors">
          {t('legalConsentPrivacy')}{' '}
          <Link href="/legal/privacy" target="_blank" className="text-rose-400 hover:text-rose-300 underline font-medium">
            ({t('linkPrivacy')})
          </Link>
        </span>
      </label>
    </div>
  );
}
