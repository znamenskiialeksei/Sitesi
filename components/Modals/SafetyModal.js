// ==============================================================================
// МОДАЛЬНОЕ ОКНО БЕЗОПАСНОСТИ И ЗАКОНОДАТЕЛЬСТВА: SAFETY MODAL
// Файл: components/Modals/SafetyModal.js
// Назначение: Отображение 4 детализированных плиток регламентов в модальном окне:
// 1. Закон Турции № 7464 и система учета KBS
// 2. Стандарты безопасности дома и территории
// 3. Доступная инклюзивная среда и подъемник
// 4. Прозрачная политика отмены и возврата
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import LawSafetyAccessibility from '../LawSafetyAccessibility';
import { useLanguage } from '../../utils/language';

export default function SafetyModal({ isOpen = false, onClose = () => {}, homeData = null }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Шапка модального окна */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {t('safetyModalTitle', 'Юридический регламент, безопасность и доступная среда')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('safetyModalSubtitle', 'Закон Турции № 7464, регистрация KBS, сертификаты пожарной безопасности и безбарьерный доступ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Содержимое: 4 плитки из LawSafetyAccessibility */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <LawSafetyAccessibility homeData={homeData} />
        </div>

        {/* Нижняя панель */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('safetyModalFooter', 'Официальное оформление e-Arşiv Fatura по закону VUK 213 Madde 230')}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm transition-colors border border-white/10"
          >
            {t('closeBtn', 'Закрыть')}
          </button>
        </div>

      </div>
    </div>
  );
}
